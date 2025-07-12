import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

export let redisClient
export const connectRedis = async () => {

    try {

        redisClient = createClient({

            username : 'default',
            password : process.env.REDIS_PASSWORD,
            socket : {

                host : process.env.REDIS_URL,
                port : process.env.REDIS_PORT

            }

        })

        redisClient.on( 'ready', () => console.log('Redis connected successfully') )
        redisClient.on( 'error', error => console.log('Error occured on connecting redis ', error) )

        await redisClient.connect()
        
    } catch ( error ) { console.log("Error occured on connecting Redis ", error) }

}