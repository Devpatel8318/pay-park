import Koa from 'koa'
import cors from '@koa/cors'
import { config } from 'dotenv'
import { createServer } from 'http'
import bodyParser from 'koa-bodyparser'
import parkingRouter from './routers/parking.js'
// import subjectRouter from './routers/subject.js'
// import resultRouter from './routers/result.js'

config()
const app = new Koa()
const httpServer = createServer(app.callback())

const port = process.env.REST_PORT || 8000

// Middlewares
app.use(
    cors({
        origin: 'http://127.0.0.1:5500',
        credentials: true,
    })
)

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = {
            status: err.status,
            message: err.message,
        }
    }
})
app.use(bodyParser())
// app.use(
//     bodyParser({
//         enableTypes: ['json'],
//         onerror(err, ctx) {
//             const error = new Error('Invalid Body')
//             error.status = 422
//             throw error
//         },
//     })
// )

app.use(parkingRouter.routes())
// app.use(subjectRouter.routes())
// app.use(resultRouter.routes())

app.use(async (ctx) => {
    ctx.status = 404
    ctx.body = { message: 'Route does not exist' }
})

httpServer.listen(port, () => console.log('REST Server is up on port ' + port))
