import express from 'express'
import http from 'http'
import path from 'path' // Deployment
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDb } from './lib/db.connection.js'
import authRouter from './routes/ath.routes.js'
import homeRouter from './routes/home.routes.js'
import { connectRedis } from './lib/redis.connection.js'

const app = express()
const server = http.createServer( app )
const __dirname = path.resolve()
dotenv.config()

app.use( express.json({ limit : '10mb' }) )
app.use( cookieParser() )
app.use( cors({

    origin : 'http://localhost:5173',
    credentials : true

}))

app.use('/authentication', authRouter)
app.use('/home', homeRouter)

if( process.env.NODE_ENV === 'production' ) {

    app.use( express.static( path.join( __dirname, '../client/dist' ) ) )
    app.get('*', ( request, response ) => {

        response.sendFile( path.join( __dirname, '../client', 'dist', 'index.html' ) )

    })

}

server.listen( process.env.port || 5000, () => {

    console.log('Server is running')
    connectDb()
    connectRedis()

})