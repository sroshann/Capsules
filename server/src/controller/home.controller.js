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
        const { _id } = request.user // From auth.middleware

        let redisHomes = JSON.parse( await redisClient.get('Homes') )
        if( redisHomes && redisHomes.length > 0 ) {

            // Fetching home data from redis
            // The admin and accessed user constraints are already valiated before data added to redis
            const homeData = redisHomes.filter( home => home._id === homeId )
            return response.status( 200 ).json({ home : homeData[0] })

        } else {

            // Fetching home data from database when redis data become empty
            let homeData = await HomeModel.findOne({
    
                _id: homeId,
                $or: [
    
                    { admin: _id },
                    { accessedUsers: _id }
    
                ]
    
            }).select('-__v -updatedAt')
    
            if( homeData === null ) return response.status( 404 ).json({ error : 'Home not found' })
            else {
        
                // Getting the admin details and setting to the home data
                homeData = {
    
                    ...homeData.toObject(),
                    admin : await getAdminDeatils( homeData.admin )
    
                }
                return response.status( 200 ).json({ home : homeData })
        
            }

        }
         
    } catch ( error ) { return response.status( 500 ).json({ error : 'Error on getting home data' }) }

}

// Add medicine to home
export const addMedController = async ( request, response ) => {

    try {

        const { homeId, medicine, disease, quantity, expiryDate } = request?.body

        const update = await HomeModel.findByIdAndUpdate( 
            
            homeId, 
            { $push : { availableMedicines : { medicine, disease, quantity, expiryDate } } },
            { new : true }
            
        )

        if ( !update ) return response.status( 401 ).json({ error : "Could'nt add medicine" })
        else {
    
            // If updation is successfull then also update in redis
            let homesInRedis = JSON.parse( await redisClient.get('Homes') )
            if ( homesInRedis && homesInRedis.length > 0 ) {

                homesInRedis = homesInRedis.map( home => {

                    if( home._id === homeId ) {

                        return {

                            ...home,
                            availableMedicines : [

                                ...home.availableMedicines,
                                { medicine, disease, quantity, expiryDate }

                            ]

                        }

                    }

                    return home

                } )

                await redisClient.setEx('Homes', 6400, JSON.stringify( homesInRedis ))

            }

            return response.status( 200 ).json({ message : 'Medicine added to ' })
    
        }     

    } catch ( error ) { response.status( 500 ).json({ error : 'Error occured on adding medicine' }) }

}