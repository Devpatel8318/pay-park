const api = 'http://localhost:7070';
const map = L.map('map').setView([23.234724, 72.642108], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
let x, y;
function fetchDataAndAddMarkers() {
    fetch(`${api}/parking/list`)
        .then((response) => response.json())
        .then(({ parkings }) => {
            parkings.forEach((data) => {
                const markers = L.marker([data.xcoo, data.ycoo])
                    .addTo(map)
                    .bindPopup(data.name);

                const len = document.getElementsByClassName(
                    'leaflet-marker-icon'
                ).length;
                const names = data.name.split(' ')[0];

                document
                    .getElementsByClassName('leaflet-marker-icon')
                    [len - 1].setAttribute('id', names);

                markers.on('click', function (e) {
                    x = e.latlng.lat;
                    y = e.latlng.lng;
                    panelchanger(x, y);
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

fetchDataAndAddMarkers();

function panelchanger(x, y) {
    fetch(`${api}/parking/coordinate/${x}/${y}`)
        .then((itemsResponse) => itemsResponse.json())
        .then(({ parking }) => {
            if (parking) {
                document.getElementById(
                    'nameOf'
                ).innerHTML = `Name: ${parking.name}`;
                document.getElementById('id').innerHTML = `ID: ${parking.id}`;
                document.getElementById('price').innerHTML = `${parking.price}`;

                const { stock: stockData } = parking;

                const subElement = document.getElementById('sub');
                subElement.style.display =
                    stockData.available === 0 ? 'none' : 'inline-block';

                const elementsToToggle = ['email', 'name', 'car_no'];

                elementsToToggle.forEach((elementId) => {
                    const element = document.getElementById(elementId);
                    element.style.display =
                        stockData.available === 0 ? 'none' : 'block';
                });

                document.getElementById(
                    'slotsAvailable'
                ).innerHTML = `Slots: ${stockData.available}`;
            }
        })
        .catch((error) => {
            console.error('Error fetching items data:', error);
        });
}

//Location

var Slatitude;
var Slongitude;
var Dlatitude;
var Dlongitude;
document.getElementById('para').addEventListener('click', getLocation);

function getLocation() {
    const x = document.getElementById('para');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}

function showPosition(position) {
    const { latitude, longitude } = position.coords;
    Slatitude = latitude;
    Slongitude = longitude;
    console.log(latitude, longitude);
    routing();
}

function showError(error) {
    const x = document.getElementById('para');

    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            x.innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = 'An unknown error occurred.';
            break;
    }
}

//Routing Start
function routing() {
    console.log('fghjkl');
    const myAPIKey = 'bed8b866464f4b369ab39767ba49258d';
    const isRetina = L.Browser.retina;

    const baseUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`;
    const retinaUrl = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

    const tileLayer = L.tileLayer(isRetina ? retinaUrl : baseUrl, {
        attribution:
            'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
        maxZoom: 20,
        id: 'osm-bright',
    });

    tileLayer.addTo(map);

    const fromWaypoint = [Slatitude, Slongitude];
    const toWaypoint = [x, y];

    const fromWaypointMarker = L.marker(fromWaypoint).addTo(map);
    const toWaypointMarker = L.marker(toWaypoint).addTo(map);

    const turnByTurnMarkerStyle = {
        radius: 5,
        fillColor: '#fff',
        color: '#555',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
    };

    fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(
            ','
        )}|${toWaypoint.join(',')}&&mode=drive&apiKey=${myAPIKey}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.status}`
                );
            }
            return response.json();
        })
        .then((result) => {
            const geoJSONLayer = L.geoJSON(result, {
                style: (feature) => ({
                    color: 'rgba(20, 137, 255, 0.7)',
                    weight: 5,
                }),
            })
                .bindPopup(
                    (layer) =>
                        `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
                )
                .addTo(map);

            const turnByTurns = result.features.flatMap((feature) =>
                feature.properties.legs.flatMap((leg, legIndex) =>
                    leg.steps.map((step) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates:
                                feature.geometry.coordinates[legIndex][
                                    step.from_index
                                ],
                        },
                        properties: {
                            instruction: step.instruction.text,
                        },
                    }))
                )
            );

            const turnByTurnLayer = L.geoJSON(
                { type: 'FeatureCollection', features: turnByTurns },
                {
                    pointToLayer: (feature, latlng) =>
                        L.circleMarker(latlng, turnByTurnMarkerStyle),
                }
            )
                .bindPopup((layer) => `${layer.feature.properties.instruction}`)
                .addTo(map);
        })
        .catch((error) => {
            console.error('Error during routing:', error);
        });
}
//Routing End

function addressAutocomplete(containerElement, callback, options) {
    const MIN_ADDRESS_LENGTH = 3;
    const DEBOUNCE_DELAY = 300;

    // create container for input element
    const inputContainerElement = document.createElement('div');
    inputContainerElement.setAttribute('class', 'input-container');
    containerElement.appendChild(inputContainerElement);

    // create input element
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('placeholder', options.placeholder);
    inputContainerElement.appendChild(inputElement);

    // add input field clear button
    const clearButton = document.createElement('div');
    clearButton.classList.add('clear-button');
    addIcon(clearButton);
    clearButton.addEventListener('click', (e) => {
        e.stopPropagation();
        inputElement.value = '';
        callback(null);
        clearButton.classList.remove('visible');
        closeDropDownList();
    });
    inputContainerElement.appendChild(clearButton);

    /* We will call the API with a timeout to prevent unneccessary API activity.*/
    let currentTimeout;

    /* Save the current request promise reject function. To be able to cancel the promise when a new request comes */
    let currentPromiseReject;

    /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
    let focusedItemIndex;

    let currentItems;

    /* Process a user input: */
    inputElement.addEventListener('input', function (e) {
        const currentValue = this.value;

        /* Close any already open dropdown list */
        closeDropDownList();

        // Cancel previous timeout
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        // Cancel previous request promise
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true,
            });
        }

        if (!currentValue) {
            clearButton.classList.remove('visible');
        }

        // Show clearButton when there is a text
        clearButton.classList.add('visible');

        // Skip empty or short address strings
        if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
            return false;
        }

        /* Call the Address Autocomplete API with a delay */
        currentTimeout = setTimeout(() => {
            currentTimeout = null;

            /* Create a new promise and send geocoding request */
            const promise = new Promise((resolve, reject) => {
                currentPromiseReject = reject;

                // The API Key provided is restricted to JSFiddle website
                // Get your own API Key on https://myprojects.geoapify.com
                const apiKey = 'bed8b866464f4b369ab39767ba49258d';

                var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    currentValue
                )}&format=json&limit=5&apiKey=${apiKey}`;

                fetch(url).then((response) => {
                    currentPromiseReject = null;

                    // check if the call was successful
                    if (response.ok) {
                        response.json().then((data) => resolve(data));
                    } else {
                        response.json().then((data) => reject(data));
                    }
                });
            });

            promise.then(
                (data) => {
                    // here we get address suggestions
                    currentItems = data.results;

                    /*create a DIV element that will contain the items (values):*/
                    const autocompleteItemsElement =
                        document.createElement('div');
                    autocompleteItemsElement.setAttribute(
                        'class',
                        'autocomplete-items'
                    );
                    inputContainerElement.appendChild(autocompleteItemsElement);

                    /* For each item in the results */
                    data.results.forEach((result, index) => {
                        /* Create a DIV element for each element: */
                        const itemElement = document.createElement('div');
                        /* Set formatted address as item value */
                        itemElement.innerHTML = result.formatted;
                        autocompleteItemsElement.appendChild(itemElement);

                        /* Set the value for the autocomplete text field and notify: */
                        itemElement.addEventListener('click', function (e) {
                            inputElement.value = currentItems[index].formatted;
                            callback(currentItems[index]);
                            /* Close the list of autocompleted values: */
                            closeDropDownList();
                            showMap(latitude, longitude);
                        });
                    });
                },
                (err) => {
                    if (!err.canceled) {
                        console.log(err);
                    }
                }
            );
        }, DEBOUNCE_DELAY);
    });

    /* Add support for keyboard navigation */
    inputElement.addEventListener('keydown', function (e) {
        var autocompleteItemsElement = containerElement.querySelector(
            '.autocomplete-items'
        );
        if (autocompleteItemsElement) {
            var itemElements =
                autocompleteItemsElement.getElementsByTagName('div');
            if (e.keyCode == 40) {
                e.preventDefault();
                /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
                focusedItemIndex =
                    focusedItemIndex !== itemElements.length - 1
                        ? focusedItemIndex + 1
                        : 0;
                /*and and make the current item more visible:*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 38) {
                e.preventDefault();

                /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
                focusedItemIndex =
                    focusedItemIndex !== 0
                        ? focusedItemIndex - 1
                        : (focusedItemIndex = itemElements.length - 1);
                /*and and make the current item more visible:*/
                setActive(itemElements, focusedItemIndex);
            } else if (e.keyCode == 13) {
                /* If the ENTER key is pressed and value as selected, close the list*/
                e.preventDefault();
                if (focusedItemIndex > -1) {
                    closeDropDownList();
                    showMap(latitude, longitude);
                }
            }
        } else {
            if (e.keyCode == 40) {
                /* Open dropdown list again */
                var event = document.createEvent('Event');
                event.initEvent('input', true, true);
                inputElement.dispatchEvent(event);
            }
        }
    });

    function setActive(items, index) {
        if (!items || !items.length) return false;

        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('autocomplete-active');
        }

        /* Add class "autocomplete-active" to the active element*/
        items[index].classList.add('autocomplete-active');

        // Change input value and notify
        inputElement.value = currentItems[index].formatted;
        callback(currentItems[index]);
    }

    function closeDropDownList() {
        const autocompleteItemsElement = inputContainerElement.querySelector(
            '.autocomplete-items'
        );
        if (autocompleteItemsElement) {
            inputContainerElement.removeChild(autocompleteItemsElement);
        }

        focusedItemIndex = -1;
    }

    function addIcon(buttonElement) {
        const svgElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        svgElement.setAttribute('viewBox', '0 0 24 24');
        svgElement.setAttribute('height', '24');

        const iconElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        iconElement.setAttribute(
            'd',
            'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
        );
        iconElement.setAttribute('fill', 'currentColor');
        svgElement.appendChild(iconElement);
        buttonElement.appendChild(svgElement);
    }

    /* Close the autocomplete dropdown when the document is clicked. 
                Skip, when a user clicks on the input field */
    document.addEventListener('click', function (e) {
        if (e.target !== inputElement) {
            closeDropDownList();
            // showMap(latitude,longitude);
        } else if (!containerElement.querySelector('.autocomplete-items')) {
            // open dropdown list again
            var event = document.createEvent('Event');
            event.initEvent('input', true, true);
            inputElement.dispatchEvent(event);
        }
    });
}

var latitude = 23.233323;
var longitude = 72.651392;
addressAutocomplete(
    document.getElementById('autocomplete-container'),
    (data) => {
        latitude = data.lat;
        longitude = data.lon;
        console.log(latitude, longitude, 'Hellooo');
    },
    {
        placeholder: 'Enter Loaction to find parking',
    }
);

function showMap(latitude, longitude) {
    map.flyTo([latitude, longitude], 13);
}
document.getElementById('para2').onclick = function () {
    var url2 = `https://www.google.com/maps/dir/?api=1&origin=${Slatitude},${Slongitude}&destination=${x},${y}`;
    window.open(url2, '_blank');
};

var a;
var b;

document.getElementById('nearest').onclick = function () {
    getLocation2();
};
function getLocation2() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition2, showError);
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}
function showPosition2(position) {
    a = position.coords.latitude;
    b = position.coords.longitude;
    console.log(a, b);

    nearest(a, b);
}
// let id;
let id;
function nearest(xcoo, ycoo) {
    fetch(`${api}/parking/list`)
        .then((res) => res.json())
        .then(({ parkings: json }) => {
            let arr = [];
            // console.log(json);
            json.map((data) => {
                arr.push([Number(data.xcoo), Number(data.ycoo), data.name]);
            });
            return arr; // array of coordinates of markers
        })
        .then((arr) => {
            // console.log(arr); //array of coordinates of markers
            // console.log(xcoo, ycoo); //live location coords
            var kilometer = 1000000000000000;
            arr.forEach((data) => {
                // console.log(data);
                // var marker = L.marker([xcoo,ycoo]).addTo(map);
                // kilometer=getDistanceFromLatLonInKm(data[0], data[1], xcoo, ycoo);
                // getDistanceFromLatLonInKm(data[0], data[1], xcoo, ycoo);
                // console.log(data[2].split(" ")[0],getDistanceFromLatLonInKm(data[0], data[1], xcoo, ycoo));
                var temperory = getDistanceFromLatLonInKm(
                    data[0],
                    data[1],
                    xcoo,
                    ycoo
                );
                if (temperory < kilometer) {
                    kilometer = temperory;
                    id = data[2].split(' ')[0];
                }
            });
            arr.forEach((data) => {
                if (data[2].split(' ')[0] == id) {
                    map.flyTo([data[0], data[1]], 17);
                    document.getElementById(id).click();
                }
            });
        });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const formEl = document.querySelector('.form1');
formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formEl);
    const dataOfForm = Object.fromEntries(formData);
    const fetchedId = document.getElementById('id').innerText.slice(4);

    const response = await fetch(`${api}/parking/view/${fetchedId}`);
    const {
        parking: {
            stock: { customer, name, car, status, date, slot, available },
        },
    } = await response.json();

    if (available < 1) {
        return alert('No Slots Available');
    }

    const total = customer.length + available;
    const r = generateUniqueRandomNumber(1, total, slot);

    slot.push(r);

    customer.push(dataOfForm.email);
    name.push(dataOfForm.name);
    car.push(dataOfForm.car_no);
    status.push(1);
    date.push(-1);

    const patchData = {
        customer,
        name,
        available: available - 1,
        car,
        status,
        slot,
        date,
    };

    await axios.patch(`${api}/parking/bookslot/${fetchedId}`, patchData);
    alert('Slot Booked');
    location.reload();
});

async function fetchJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data for url: ${url}`);
    return await response.json();
}

function generateUniqueRandomNumber(min, max, excludeArray) {
    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excludeArray.includes(randomNum));
    return randomNum;
}
