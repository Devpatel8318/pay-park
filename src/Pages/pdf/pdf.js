const api = 'http://localhost:7070'
window.onload = function () {
    namee = document.getElementById('Name')
    mail = document.getElementById('mail')
    car = document.getElementById('car')
    price = document.getElementById('price')

    var currentdate = new Date()

    var date =
        currentdate.getDate() +
        '/' +
        (currentdate.getMonth() + 1) +
        '/' +
        currentdate.getFullYear()

    var time = currentdate.getHours() + ':' + currentdate.getMinutes()

    document.getElementById('time').innerHTML = `${time}<br>${date}`

    fetch(`${api}/parking/receipt/view`)
        .then((res) => res.json())
        .then((data) => {
            console.log('====================================')
            console.log(data)
            console.log('====================================')
            document.getElementById('name').innerText = data.name
            document.getElementById('pname').innerText = data.pname
            document.getElementById('mail').innerText = data.email
            document.getElementById('car').innerText = data.car
            document.getElementById('slot').innerText = data.slot
            document.getElementById('time2').innerText = `${data.date.hour}:${
                data.date.minute
            }   ${data.date.day}/${data.date.month + 1}/${data.date.year} `
            var billDate = new Date(
                data.date.year,
                data.date.month,
                data.date.day,
                data.date.hour,
                data.date.minute
            )
            var diff = currentdate.valueOf() - billDate.valueOf()
            var diffInHours = Math.ceil(diff / 1000 / 60 / 60)
            console.log(diffInHours)
            if (diffInHours < 1) {
                diffInHours = 1
            }
            document.getElementById('timeused').innerText = diffInHours
            document.getElementById('rate').innerText = data.amount

            document.getElementById('price').innerText = Math.round(
                data.amount * diffInHours.toFixed(1)
            )
        })
    document.getElementById('download').addEventListener('click', () => {
        const invoice = this.document.getElementById('invoice')
        console.log(invoice)
        console.log(window)
        var opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        }
        html2pdf().from(invoice).set(opt).save()
    })
}
