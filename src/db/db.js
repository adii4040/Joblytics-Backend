import dotenv from 'dotenv'
import mongoose from 'mongoose'


dotenv.config()


const sleep = (delayInMs) => new Promise((resolve) => setTimeout(resolve, delayInMs))


const connectDb = async () => {
    const mongoDbUrl = process.env.MONGODB_URL

    if (!mongoDbUrl) {
        throw new Error('MONGODB_URL is not configured')
    }

    const maxRetries = Number(process.env.DB_CONNECT_RETRIES ?? 5)
    const retryDelayInMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS ?? 2000)

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const connectionInstance = await mongoose.connect(mongoDbUrl, {
                serverSelectionTimeoutMS: 5000
            })
            console.log(`\n MongoDb connected successfully!! Db host: ${connectionInstance.connection.host}`)
            return connectionInstance
        } catch (error) {
            const isLastAttempt = attempt === maxRetries

            console.log(`MongoDB connection attempt ${attempt}/${maxRetries} failed`, error)

            if (isLastAttempt) {
                throw error
            }

            const delayForNextAttempt = retryDelayInMs * attempt
            console.log(`Retrying MongoDB connection in ${delayForNextAttempt}ms...`)
            await sleep(delayForNextAttempt)
        }
    }
}

export default connectDb