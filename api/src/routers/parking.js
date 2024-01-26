import Router from '@koa/router'

import db from '../connection/db.js'
// import {
//     isPasswordCorrect,
//     doesParkingExistByEmail,
//     doesParkingExistById,
//     doesParkingExistByIdAndAttach,
//     isFieldsValid,
//     isEmailAvailable,
//     isFirstNameValid,
//     isLastNameValid,
//     isEmailValid,
//     isPasswordValid,
// } from '../validators/parkingValidators.js'

// import {
//     deleteParking,
//     getOneParking,
//     getAllParkings,
//     loginParking,
//     updateParking,
//     createParking,
// } from '../controllers/parkingControllers.js'

export const router = new Router({ prefix: '/parking' })

// Get all parkings
router.get('/list', async (ctx) => {
    const response = await db.collection('parking').find({}).toArray()
    ctx.body = { parkings: response }
})

router.get('/coordinate/:x/:y', async (ctx) => {
    const { x, y } = ctx.params
    const parking = await db.collection('parking').findOne({ xcoo: x, ycoo: y })
    ctx.body = { parking: parking || 'No Parking' }
})

router.get('/view/:id', async (ctx) => {
    const { id } = ctx.params
    const parking = await db.collection('parking').findOne({ id })
    ctx.body = { parking: parking || 'No Parking' }
})

router.post('/add', async (ctx) => {
    const { id, name, mail, Slots, price, password, xcoo, ycoo, stock } =
        ctx.request.body
    await db.collection('parking').insertOne({
        id,
        name,
        mail,
        Slots,
        price,
        password,
        xcoo,
        ycoo,
        stock,
    })
    ctx.body = { message: 'ok' }
})

router.patch('/bookslot/:id', async (ctx) => {
    const {
        customer,
        name,
        available,
        car,
        status,
        slot: newslot,
        date,
    } = ctx.request.body
    const { id } = ctx.params
    const resultDoc = await db.collection('parking').findOne({ id })
    const { stock } = resultDoc
    stock.customer = customer
    stock.name = name
    stock.available = available
    stock.car = car
    stock.status = status
    stock.slot = newslot
    stock.date = date

    console.log(stock)

    await db.collection('parking').updateOne(
        { id },
        {
            $set: {
                stock,
            },
        }
    )

    ctx.body = { message: 'Slot Booked' }
})

router.patch('/receipt', async (ctx) => {
    console.log(ctx.request.body)
    const { name, email, car, amount, pname, slot, date } = ctx.request.body
    const updatedData = { name, email, car, amount, pname, slot, date }

    const isEmpty = await db.collection('receipt').countDocuments()

    if (!isEmpty) {
        await db.collection('receipt').insertOne(updatedData)
    } else {
        await db.collection('receipt').updateOne({}, { $set: updatedData })
    }

    ctx.body = { message: 'ok' }
})

router.get('/receipt/view', async (ctx) => {
    const response = await db.collection('receipt').findOne()
    console.log(response)
    ctx.body = response
})

// // Get Single parking
// router.get(
//     '/view/:parkingId',
//     validator([doesParkingExistByIdAndAttach]),
//     getOneParking
// )

// // Parking Login
// router.post(
//     '/login',
//     validator([
//         isFieldsValid,
//         isEmailValid,
//         isPasswordValid,
//         doesParkingExistByEmail,
//         isPasswordCorrect,
//     ]),
//     loginParking
// )

// // Create a new parking
// router.post(
//     '/add',
//     validator([
//         isFieldsValid,
//         isEmailValid,
//         isEmailAvailable,
//         isFirstNameValid,
//         isLastNameValid,
//         isPasswordValid,
//     ]),
//     createParking
// )

// // Update a Parking
// router.patch(
//     '/edit/:parkingId',
//     validator([
//         isFieldsValid,
//         doesParkingExistById,
//         isEmailValid,
//         isFirstNameValid,
//         isLastNameValid,
//         isPasswordValid,
//     ]),
//     updateParking
// )

// // Delete a parking
// router.delete(
//     '/delete/:parkingId',
//     validator([doesParkingExistByIdAndAttach]),
//     deleteParking
// )

export default router
