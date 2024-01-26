import { api, liveServerUrl } from '../../env.js'

document.getElementById('homeLeft').addEventListener('click', function () {
    openNewURLInTheSameWindow(`${liveServerUrl}/src/Pages/index/index.html`)
})

document.getElementById('homeRight').addEventListener('click', function () {
    openNewURLInTheSameWindow(
        `${liveServerUrl}/src/Pages/register/register.html`
    )
})

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

window.onload = function () {
    const formEl = document.querySelector('.form1')
    formEl.addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(formEl)
        const dataOfForm = Object.fromEntries(formData)
        // console.log(dataOfForm);

        var x = ''

        fetch(`${api}/parking/list`)
            .then((res) => res.json())
            .then(({ parkings: json }) => {
                json.map((dataJson) => {
                    // console.log(dataJson);
                    // console.log("form vadu:", dataOfForm.email);
                    //     console.log("database vadu:", dataJson.mail);
                    if (dataOfForm.email == dataJson.mail) {
                        x = dataJson
                        // console.log(x);
                    }
                })

                if (x == '') {
                    alert('Email not Found')
                } else if (x.password == dataOfForm.password) {
                    console.log(x.name)
                    var person2 = {
                        id: 1,
                        logged: x.id,
                    }
                    window.localStorage.setItem('loggedIn', x.id)
                    openNewURLInTheSameWindow(
                        `${liveServerUrl}/src/Pages/dashboard/dashboard.html`
                    )
                } else {
                    if (document.getElementById('password').value == '') {
                        alert('Please Enter Password')
                    } else {
                        alert('wrong password')
                    }
                }
            })
    })
}
