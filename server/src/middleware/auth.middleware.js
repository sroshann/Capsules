import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js'
import { redisClient } from '../lib/redis.connection.js'

// Protecting user function routes on checking the presence of token
export const protectUserRoutes = async ( request, response, next ) => {

    try {

        const token = request.cookies.credential
        if( token ) {

            const decode = jwt.verify( token, process.env.JWTSECRET )
            if( decode ) {

                const { userId } = decode
                let user = JSON.parse( await redisClient.get(`user:${ userId }`) )
                if( !user ) user = await UserModel.findById( userId ).select('-password -__v -updatedAt')
                request.user = user
                next()

            } else return response.status( 500 ).json({ error : 'Invalid token' })

        } else return response.status( 500 ).json({ error : 'No token provided' })

    } catch( error ) { return response.status( 500 ).json({ error : 'No token provided' }) }

}