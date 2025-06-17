import mongoose from 'mongoose'

export const connectDb = async () => {

    try {

        await mongoose.connect( process.env.connection_string )
        console.log("Database connected")

    } catch ( error ) { console.error( error ) }

}