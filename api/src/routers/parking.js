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

router.get('/view/:id', async (ctx) => {
    const { id } = ctx.params
    const parking = await db.collection('parking').findOne({ id })
    ctx.body = { parking: parking || 'No Parking' }
})

router.post('/add', async (ctx) => {
    const { id, name, mail, Slots, price, password, xcoo, ycoo } =
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
    })
    ctx.body = { message: 'ok' }
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
// router.put(
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
