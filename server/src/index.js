import express from 'express'
import http from 'http'
import path from 'path' // Deployment
import dotenv from 'dotenv'

const app = express()
const server = http.createServer( app )
const __dirname = path.resolve()
dotenv.config()

if( process.env.NODE_ENV === 'production' ) {

    app.use( express.static( path.join( __dirname, '../client/dist' ) ) )
    app.get('/*', ( request, response ) => {

        response.sendFile( path.join( __dirname, '../client', 'dist', 'index.html' ) )

    })

}

server.listen( 5000, () => console.log('Server is running') )