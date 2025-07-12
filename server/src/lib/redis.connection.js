import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

export const connectRedis = async () => {

    try {

        const client = createClient({

            username : 'default',
            password : process.env.REDIS_PASSWORD,
            socket : {

                host : process.env.REDIS_URL,
                port : process.env.REDIS_PORT

            }

        })

        client.on( 'ready', () => console.log('Redis connected successfully') )
        client.on( 'error', error => console.log('Error occured on connecting redis ', error) )
        
        await client.connect()
        
    } catch ( error ) { console.log("Error occured on connecting Redis ", error) }

}