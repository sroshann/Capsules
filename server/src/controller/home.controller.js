import { getAdminDeatils } from "../helper/database.helper.js"
import { redisClient } from "../lib/redis.connection.js"
import HomeModel from "../models/home.model.js"
import UserModel from "../models/user.model.js"

// Creating new home
export const createHomeController = async ( request, response ) => {

    try {

        const { nickName, homeName, country, state, district, pincode, description, userId } = request.body

        // Checking whether home name is already exist or not
        const existingHome = await HomeModel.findOne({ homeName })
        // Also check this home name is used for 'username' by any other user
        const existingName = await UserModel.findOne({ userName : homeName })
        if( existingHome || existingName ) return response.status( 401 ).json({ error : 'Home name is already taken' })

        const homeSchema = new HomeModel({

            nickName,
            homeName,
            country,
            state,
            district, 
            pincode,
            description,
            admin : request?.user._id

        })

        if( homeSchema ) {

            const createdHome = await homeSchema.save()
            const { __v, updatedAt, ...rest } = createdHome.toObject()

            // Newly created home is also added to already stored data in REDIS
            let homesInRedis = JSON.parse( await redisClient.get('Homes') )
            if( homesInRedis ) await redisClient.setEx('Homes', 6400, JSON.stringify( [ ...homesInRedis, rest ] ))
            else {
        
                // If some times redis data becomes empty, so adding only newly created home into redis 
                // is not a good idea, then we should fetch all the details from db and then add to redis
                let dbHomes = await HomeModel.find({

                    // Fetching the homes in which the accessed user is 'admin'
                    // or the homes in which user have the access
                    $or : [

                        { admin : userId },
                        { accessedUsers : userId }

                    ]

                }).select('-__v -updatedAt')
                await redisClient.setEx('Homes', 6400, JSON.stringify([ dbHomes ]))
        
            }

            return response.status( 200 ).json({ message : 'Home created successfully', home : rest })

        }

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on creating home' }) }

}

// Get created homes
export const getCHController = async ( request, response ) => {

    try {

        // Inorder to make the execution fast the data is fetched form 'redis'
        // If data is not present in 'redis', then it fetched from database
        // and then stored in 'redis'
        
        let homes = JSON.parse( await redisClient.get('Homes') )
        if( homes && homes.length > 0 ) return response.status( 200 ).json({ homes })
        else {
        
            // Fetching the homes in which the accessed user is 'admin'
            // or the homes in which user have the access
            const { _id } = request.params
            homes = await HomeModel.find({

                $or : [

                    { admin : _id },
                    { accessedUsers : _id }

                ]

            }).select('-__v -updatedAt')
            if( homes && homes.length > 0 ) {

                // Setting admin details for each homes
                // We use await in 'getAdminDetails' function, but map doesnt wait for it
                // so we need to put it in 'Promise.all' inorder to wait for each home execution
                homes = await Promise.all(

                    homes.map( async object => ({
                    
                        ...object.toObject(),
                        admin : await getAdminDeatils( object.admin )

                    }))

                )

                await redisClient.setEx('Homes', 6400, JSON.stringify( homes ))
                return response.status( 200 ).json({ homes })

            } else return response.status( 401 ).json({ error : 'No homes were created' })
    
        }

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on getting homes' }) }

}

// Get data of partcular home
export const getPHController = async ( request, response ) => {

    try {

        const { homeId } = request.params
        let homeData = await HomeModel.findById( homeId ).select('-__v -updatedAt')

        if( homeData === null ) return response.status( 404 ).json({ error : 'Home not found' })
        else {
    
            // Getting the admin details and setting to the home data
            homeData = {

                ...homeData.toObject(),
                admin : await getAdminDeatils( homeData.admin )

            }
            return response.status( 200 ).json({ home : homeData })
    
        }
         
    } catch ( error ) { return response.status( 500 ).json({ error : 'Error on getting home data' }) }

}