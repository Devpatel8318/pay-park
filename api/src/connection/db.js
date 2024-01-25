import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongodbConnection = async () => {
    try {
        const client = new MongoClient(process.env.URL)
        await client.connect()
        console.log(`MongoDB Connected Successfully`)

        const db = client.db()

        // Check if collections exist
        const collections = await db.listCollections().toArray()

        if (!collections.some((collection) => collection.name === 'students')) {
            await db.createCollection('students')
        }

        if (!collections.some((collection) => collection.name === 'subjects')) {
            await db.createCollection('subjects')
        }

        if (!collections.some((collection) => collection.name === 'results')) {
            await db.createCollection('results')
        }

        if (
            !collections.some(
                (collection) => collection.name === 'allowedUsers'
            )
        ) {
            await db.createCollection('allowedUsers')
        }

        return db
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

export default await mongodbConnection()
