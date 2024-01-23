const api = 'http://localhost:6060'
const liveServerUrl = 'http://127.0.0.1:5501'
document.getElementById('name').innerHTML
var id
fetch(`${api}/idd/1`)
    .then((response) => response.json())
    .then((result) => {
        var id = Object.values(result)[0]
        fetch(`${api}/items/${id}`)
            .then((res) => res.json())
            .then((data) => {
                document.getElementById('name').innerHTML = data.name
                document.getElementById('id').innerHTML = `Id: ${data.id}`
                fetch(`${api}/stock/${id}`)
                    .then((res) => res.json())
                    .then((data2) => {
                        // console.log(document.getElementById("people"));
                        let tbody = document.getElementById('people')
                        document.getElementById('slots').innerHTML = `${
                            data2.available
                        }/${data2.available + data2.customer.length}`
                        for (
                            let index = 0;
                            index < data2.customer.length;
                            index++
                        ) {
                            // console.log(index);
                            // console.log(tbody);
                            tbody.append(
                                td_fun1(
                                    data2.customer[index],
                                    data2.name[index],
                                    data2.car[index],
                                    data.price,
                                    data2.status[index],
                                    data2.slot[index]
                                )
                            )
                        }
                        var space = data2.available + data2.customer.length
                        dev(space)

                        for (let i = 0; i < data2.customer.length; i++) {
                            if (data2.status[i] == 1) {
                                document
                                    .getElementById(data2.slot[i])
                                    .classList.add('booked')
                                document.getElementById(
                                    data2.slot[i]
                                ).innerHTML = data2.name[i]
                            } else if (data2.status[i] == 2) {
                                document
                                    .getElementById(data2.slot[i])
                                    .classList.add('pack')
                                document.getElementById(
                                    data2.slot[i]
                                ).innerHTML = data2.name[i]
                                document
                                    .getElementById(data2.slot[i])
                                    .addEventListener('click', function () {
                                        console.log(data2.name[i])
                                        console.log(data2.id)

                                        const response = confirm(
                                            'Remove parking slot?'
                                        )

                                        if (response) {
                                            fetch(`${api}/stock/${data2.id}`)
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    console.log(data.name[i])
                                                })
                                            var myHeaders = new Headers()
                                            myHeaders.append(
                                                'Content-Type',
                                                'application/json'
                                            )

                                            var raww = JSON.stringify({
                                                name: data2.name[i],
                                                email: data2.customer[i],
                                                car: data2.car[i],
                                                pname: document.getElementById(
                                                    'name'
                                                ).innerHTML,
                                                slot: data2.slot[i],
                                                date: data2.date[i],
                                                amount: data2.amount,
                                            })
                                            console.log(raww)
                                            var requestOptions = {
                                                method: 'PATCH',
                                                headers: myHeaders,
                                                body: raww,
                                                redirect: 'follow',
                                            }
                                            fetch(
                                                `${api}/receipt/1`,
                                                requestOptions
                                            ).then((response) =>
                                                response.text()
                                            )

                                            var customer_edited = data2.customer
                                            var name_edited = data2.name
                                            var car_edited = data2.car
                                            var slot_edited = data2.slot
                                            var status_edited = data2.status
                                            var date_edited = data2.date
                                            var index = i
                                            if (index > -1) {
                                                customer_edited.splice(index, 1)
                                                name_edited.splice(index, 1)
                                                car_edited.splice(index, 1)
                                                slot_edited.splice(index, 1)
                                                status_edited.splice(index, 1)
                                                date_edited.splice(index, 1)
                                            }
                                            fetch(`${api}/stock/${id}`, {
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type':
                                                        'application/json',
                                                },
                                                method: 'PATCH',

                                                body: JSON.stringify({
                                                    status: status_edited,
                                                    customer: customer_edited,
                                                    slot: slot_edited,
                                                    name: name_edited,
                                                    car: car_edited,
                                                    available:
                                                        data2.available + 1,
                                                    date: date_edited,
                                                    amount: data2.amount,
                                                }),
                                            })
                                            openNewURLInTheSameWindow(
                                                `${liveServerUrl}/src/Pages/pdf/pdf.html`
                                            )
                                        } else {
                                        }
                                    })
                            }
                        }
                    })
            })
    })
document.getElementById('${car}')

function test(mail, name, car, price) {
    fetch(`${api}/idd/1`)
        .then((res) => res.json())
        .then((json) => {
            var id = Object.values(json)[0]

            fetch(`${api}/stock/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    x = data.customer.indexOf(mail)
                    y = document.getElementById(data.slot[x])

                    // console.log(data.status);
                    data.status[x] = 2
                    z = data.status
                    // console.log(z);

                    fetch(`${api}/stock/${id}`, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        method: 'PATCH',

                        body: JSON.stringify({
                            status: z,
                        }),
                    })
                })

            fetch(`${api}/stock/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    var xy = data.customer.indexOf(mail)
                    // console.log(xy);
                    var yz = data.slot[xy]
                    var myHeaders = new Headers()
                    myHeaders.append('Content-Type', 'application/json')
                    // console.log(name);
                    // console.log(mail);
                    // console.log(car);
                    // console.log("dev patel",data.dev);
                    // console.log("dev patel",name);
                    // console.log(xy);
                    console.log(data.date)
                    bhagat = data.date
                    const date = new Date()
                    const time = {
                        day: date.getDate(),
                        month: date.getMonth(),
                        year: date.getFullYear(),
                        hour: date.getHours(),
                        minute: date.getMinutes(),
                    }
                    bhagat[xy] = time

                    console.log(bhagat)

                    fetch(`${api}/stock/${id}`, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        method: 'PATCH',

                        // Fields that to be updated are passed
                        body: JSON.stringify({
                            date: bhagat,
                        }),
                    })
                    var raw = JSON.stringify({
                        name: name,
                        email: mail,
                        car: car,
                        amount: price,
                        pname: document.getElementById('name').innerHTML,
                        slot: yz,
                        date: bhagat[xy],
                    })
                    console.log(raw)
                    var requestOptions = {
                        method: 'PATCH',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow',
                    }
                    fetch(`${api}/receipt/1`, requestOptions).then((response) =>
                        response.text()
                    )
                })
        })
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
    a.target = '_blank'
    fireClickEvent(a)
}

function td_fun1(mail, name, car, price, status, slot) {
    let td = document.createElement('tr')

    var c
    if (status == 1) {
        status = 'Booked'
        c = 'bg-green-200 text-green-800'
    } else {
        status = 'Parked'
        c = 'bg-red-400 text-white'
    }

    x = document.getElementById(`${car}`)
    td.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div>
                                <div class="text-sm font-medium text-grey-900">${name}</div>
                                <div class="text-sm text-gray-500">${mail}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibo rounded-full ${c} ">
                            ${status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-500">
                            ${slot}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-500">
                            ${car}
                        </span>
                    </td>



                    <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-500">
                    <button id="${car}" style="width: 55%;
                    height: 90%;
                    padding: 3px;
                    padding-top: 7px;
                    padding-bottom: 7px;" onclick="test('${mail}','${name}','${car}','${price}')" class="relative  inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-500 rounded-full shadow-md group">
                    <span
                        class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-400 group-hover:translate-x-0 ease">
                        Car
                    </span>
                    <span
                        class="absolute flex items-center justify-center w-full h-full text-indigo-500 transition-all duration-300 transform group-hover:translate-x-full ease">Parked</span>
                    <span class="relative invisible">Button Text</span>
                </button>
                </span>
                       
                    </td>
            `
    // td.setAttribute("id", mail)
    // td.setAttribute("class","px-6 py-4 whitespace-nowrap")
    return td
}

// let tbody = document.getElementById("people");

function td_fun2(number) {
    let td = document.createElement('div')

    // x = document.getElementById(`${car}`);

    td.innerHTML = `
            
            `
    td.setAttribute('class', 'items')
    td.setAttribute('id', number)
    return td
}

function dev(x) {
    row = 0
    for (let i = 1; i < x + 1; i++) {
        // console.log(i, row);
        let tbody = document.getElementById(`col${row + 1}`)
        tbody.append(td_fun2(i))
        if (i % 2 == 0) {
            row = (row + 1) % 3
        }
    }
}
