import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

export const app = express()
export const server = createServer( app )

export const io = new Server( server, {

    cors : { 
        
        origin : ["http://localhost:5173"],
        credentials : true
    
    }

} )

io.on("connection", ( socket ) => {

    socket.on('join', (userId) => socket.join( userId ))
    // socket.on('disconnect', () => console.log('User disconnected = ', socket.id))

} )