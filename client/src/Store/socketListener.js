import { socket } from "../lib/socket"
import { changeDateFormat } from "../lib/utils"
import { setHomes } from "./Reducers/home.reducer"

let initialized = false

// Socket listeners
export const socketListener = ( store ) => {

    if( initialized ) return
    else initialized = true

    const { dispatch, getState } = store

    // Connceting user
    socket.on('connect', () => { 

        const userId = getState().authentication.userData?._id
        if( userId ) socket.emit('join', userId)

    })

    // Receiving access request
    socket.on('access_request', data => {

        const homes = getState().homes.homesData
        data = {

            ...data,
            createdAt : changeDateFormat( data?.createdAt, true )

        }

        const updated = homes?.map( home => home?._id === data?.homeId ? {

            ...home,
            accessRequest : [ ...home?.accessRequest, data ]

        } : home )

        dispatch( setHomes( updated ) )

    })

    // Accepting user access request
    socket.on('accept_request', data => {

        const homes = getState().homes.homesData
        data = {

            ...data,
            createdAt : changeDateFormat( data?.createdAt, true )

        }

        const updated = [ ...homes, data ]
        dispatch( setHomes( updated ) )

    })

    // Removing user
    socket.on('removed_user', homeId => {

        const homes = getState().homes.homesData
        const updated = homes?.filter( home => home?._id != homeId )
        dispatch( setHomes( updated ) )

    })

}

// Disconnecting from socket
export const destroySocket = () => {

    // On disconnecting from socket, the existing connection get turned off
    socket.disconnect()
    initialized = false

}