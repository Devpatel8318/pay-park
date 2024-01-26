import { api, liveServerUrl } from '../../env.js'

document.getElementById('home').addEventListener('click', function () {
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/index/index.html`)
})

document.getElementById('login').addEventListener('click', function () {
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/login/login.html`)
})

document.getElementById('Location').addEventListener('click', markerSetter)
document.getElementById('verify').addEventListener('click', sendMail)
document.getElementById('otpCheck').addEventListener('click', otpChecker)

document.getElementById('one').onclick = function () {
    document.querySelector('.right .khokhu').classList.add('no')
    document.querySelector('.khokhu:nth-child(2)').classList.remove('no')
}
document.getElementById('two-back').onclick = function () {
    document.querySelector('.right .khokhu').classList.remove('no')
    document.querySelector('.khokhu:nth-child(2)').classList.add('no')
}

function markerSetter() {
    let marker = L.marker([x, y]).addTo(map)
    map.closePopup()
    document.getElementById('Location').remove()
}

function fireClickEvent(element) {
    var evt = new window.MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    element.dispatchEvent(evt)
}

function openNewURLInTheSameWindow(targetURL) {
    var a = document.createElement('a')
    a.href = targetURL
    fireClickEvent(a)
}

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf4ff',
                    100: '#fae8ff',
                    200: '#f5d0fe',
                    300: '#f0abfc',
                    400: '#e879f9',
                    500: '#d946ef',
                    600: '#c026d3',
                    700: '#a21caf',
                    800: '#86198f',
                    900: '#701a75',
                },
            },
        },
        fontFamily: {
            body: [
                'Open Sans',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji',
            ],
            sans: [
                'Open Sans',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji',
            ],
        },
    },
}

var map = L.map('map').setView([23.234724, 72.642108], 14)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

let x
let y

function onMapClick(e) {
    fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&apiKey=bed8b866464f4b369ab39767ba49258d`
    )
        .then((response) => response.json())
        .then((result) => {
            if (result.features.length) {
                const address = result.features[0].properties.formatted

                x = e.latlng.lat
                y = e.latlng.lng
                L.popup().setLatLng(e.latlng).setContent(address).openOn(map)
            } else {
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent('No address found')
                    .openOn(mymap)
                x = e.latlng.latitude
                y = e.latlng.longitude
            }
        })
}
map.on('click', onMapClick)

document.getElementById('sub').style.display = 'none'
let otp
function otpGenerator() {
    otp = Math.floor(Math.random() * 1000000) + 1
    return otp
}

function sendMail() {
    //Uncomment to send mail

    // var params = {
    //     name: document.getElementById('name').value,
    //     email_id: document.getElementById('mail').value,
    //     message: otpGenerator(),
    // }
    // emailjs
    //     .send('service_cyxbt0d', 'template_plwjtef', params)
    //     .then(function (res) {
    //         alert(`Mail sent to ${document.getElementById('mail').value}`)
    //     })
    document.getElementById('verify').style.display = 'none'
}

function otpChecker() {
    let k = document.getElementById('otp').value
    if (k == otp) {
        document.getElementById('sub').style.display = ''
        document.getElementById('otpCheck').style.display = 'none'
    } else {
        //remove bottom 3 line to send mail
        document.getElementById('sub').style.display = ''
        document.getElementById('otpCheck').style.display = 'none'

        // uncomment bottom line
        // alert('Wrong Otp, Try Again')

        //ignore
        // document.getElementById("sub").style.display = "";
        // console.log("Right OTP");
        // document.getElementById("otpCheck").style.display = "none";
    }
}
const formEl = document.querySelector('.form1')

formEl.addEventListener('submit', async (event) => {
    event.preventDefault()

    const {
        data: { parkings: itemsData },
    } = await axios.get('http://localhost:7070/parking/list')

    // document.getElementById('ID').value =
    //     Number(itemsData[Object.keys(itemsData).pop()].id) + 1

    const formData = new FormData(formEl)
    const newItemData = Object.fromEntries(formData)
    const available = Number(newItemData?.Slots)

    delete newItemData['otp']
    delete newItemData['slots']
    newItemData['xcoo'] = x.toString()
    newItemData['ycoo'] = y.toString()
    console.log(itemsData)
    const id = itemsData.length ? itemsData[itemsData.length - 1].id + 1 : 1
    newItemData['id'] = id.toString()
    Object.assign(newItemData, {
        stock: {
            available,
            id: Number(id),
            customer: [],
            name: [],
            car: [],
            status: [],
            slot: [],
            date: [],
        },
    })

    await axios.post(`http://localhost:7070/parking/add`, newItemData)
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/login/login.html`)
})
