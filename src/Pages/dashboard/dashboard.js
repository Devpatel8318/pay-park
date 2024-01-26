const api = 'http://localhost:7070'
const liveServerUrl = 'http://127.0.0.1:5500'

document.getElementById('home').addEventListener('click', function () {
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/index/index.html`)
})

document.getElementById('logout').addEventListener('click', function () {
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/login/login.html`)
})

document.getElementById('name').innerHTML

const id = window.localStorage.getItem('loggedIn')

// Remove from parking EVENT
fetch(`${api}/parking/view/${id}`)
    .then((res) => res.json())
    .then(({ parking: data }) => {
        document.getElementById('name').innerHTML = data.name
        document.getElementById('id').innerHTML = `Id: ${data.id}`
        const data2 = data.stock
        let tbody = document.getElementById('people')
        document.getElementById('slots').innerHTML = `${data2.available}/${
            data2.available + data2.customer.length
        }`
        for (let index = 0; index < data2.customer.length; index++) {
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
                document.getElementById(data2.slot[i]).classList.add('booked')
                document.getElementById(data2.slot[i]).innerHTML = data2.name[i]
            } else if (data2.status[i] == 2) {
                document.getElementById(data2.slot[i]).classList.add('pack')
                document.getElementById(data2.slot[i]).innerHTML = data2.name[i]
                document
                    .getElementById(data2.slot[i])
                    .addEventListener('click', function () {
                        const response = confirm('Remove parking slot?')

                        if (response) {
                            // // for receipt
                            // const raw = {
                            //     name: name,
                            //     email: mail,
                            //     car: car,
                            //     amount: price,
                            //     pname: document.getElementById('name')
                            //         .innerHTML,
                            //     slot: data.slot[x],
                            //     date: parkedDate[x],
                            // }
                            // var myHeaders = new Headers()
                            // myHeaders.append('Content-Type', 'application/json')
                            // const requestOptions = {
                            //     method: 'PATCH',
                            //     headers: myHeaders,
                            //     body: JSON.stringify(raw),
                            //     redirect: 'follow',
                            // }
                            // fetch(
                            //     `${api}/parking/receipt`,
                            //     requestOptions
                            // )

                            // For RECEIPT NEW
                            var raww2 = {
                                name: data2.name[i],
                                email: data2.customer[i],
                                car: data2.car[i],
                                amount: data.price,
                                pname: document.getElementById('name')
                                    .innerHTML,
                                slot: data2.slot[i],
                                date: data2.date[i],
                            }
                            var myHeaders = new Headers()
                            myHeaders.append('Content-Type', 'application/json')
                            const requestOptions = {
                                method: 'PATCH',
                                headers: myHeaders,
                                body: JSON.stringify(raww2),
                                redirect: 'follow',
                            }
                            fetch(`${api}/parking/receipt`, requestOptions)

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

                            const body = JSON.stringify({
                                available: data2.available + 1,
                                name: data2.name,
                                id: data2.id,
                                customer: customer_edited,
                                car: car_edited,
                                status: status_edited,
                                date: date_edited,
                                slot: slot_edited,
                            })

                            fetch(`${api}/parking/bookslot/${id}`, {
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                method: 'PATCH',
                                body,
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
document.getElementById('${car}')

//CAR ENTERED PARKING EVENT
function test(mail, name, car, price) {
    var id = window.localStorage.getItem('loggedIn')
    fetch(`${api}/parking/view/${id}`)
        .then((res) => res.json())
        .then(({ parking }) => {
            const { stock: data } = parking

            x = data.customer.indexOf(mail)
            y = document.getElementById(data.slot[x])
            if (data.status[x] != 1) {
                return
            }
            data.status[x] = 2

            parkedDate = data.date
            const date = new Date()
            const time = {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                hour: date.getHours(),
                minute: date.getMinutes(),
            }
            parkedDate[x] = time

            const patchData = {
                customer: data.customer,
                name: data.name,
                available: data.available,
                car: data.car,
                status: data.status,
                slot: data.slot,
                date: parkedDate,
            }

            fetch(`${api}/parking/bookslot/${id}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
                body: JSON.stringify(patchData),
            })

            // for receipt
            const raw = {
                name: name,
                email: mail,
                car: car,
                amount: price,
                pname: document.getElementById('name').innerHTML,
                slot: data.slot[x],
                date: parkedDate[x],
            }
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            const requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: JSON.stringify(raw),
                redirect: 'follow',
            }
            fetch(`${api}/parking/receipt`, requestOptions).then((data) => {
                location.reload()
            })
        })
    // })
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

    let x = document.getElementById(`${car}`)
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
    td.innerHTML = `
            
            `
    td.setAttribute('class', 'items')
    td.setAttribute('id', number)
    return td
}

function dev(x) {
    let row = 0
    for (let i = 1; i < x + 1; i++) {
        // console.log(i, row);
        let tbody = document.getElementById(`col${row + 1}`)
        tbody.append(td_fun2(i))
        if (i % 2 == 0) {
            row = (row + 1) % 3
        }
    }
}
