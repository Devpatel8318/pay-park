import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongodbConnection = async () => {
    try {
        const client = new MongoClient(process.env.URL)
        await client.connect()
        console.log(`MongoDB Connected Successfully`)
        const db = client.db()

        return db
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default await mongodbConnection()
