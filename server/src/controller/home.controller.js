import { redisClient } from "../lib/redis.connection.js"
import AddedMedModel from "../models/addedMed.model.js"
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

            })
            .populate([

                { path : 'admin', select : 'profilePicture fullName email userName' },
                { path : 'availableMedicines' }

            ])
            .select('-__v -updatedAt')

            if( homes && homes.length > 0 ) {

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
            // The admin and accessed user constraints are already validated before data added to redis
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
    
            })
            .populate([

                { path : 'admin', select : 'profilePicture fullName userName email' },
                { path : 'availableMedicines' }

            ])
            .select('-__v -updatedAt')
    
            if( homeData === null ) return response.status( 404 ).json({ error : 'Home not found' })
            else return response.status( 200 ).json({ home : homeData })

        }
         
    } catch ( error ) { return response.status( 500 ).json({ error : 'Error on getting home data' }) }

}

// Add medicine to home
export const addMedController = async ( request, response ) => {

    try {

        const { homeId } = request?.body

        // Saving the newly added medicine to added med collection
        const addedMed = await AddedMedModel.create( request?.body )
        const { __v, ...rest } = addedMed.toObject()
        // And the new medicine Id is added to available medicine 
        const update = await HomeModel.findByIdAndUpdate( 
            
            homeId, 
            { $push : { availableMedicines : rest?._id } },
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
                            availableMedicines : [ ...home.availableMedicines, rest ]

                        }

                    }

                    return home

                } )

                await redisClient.setEx('Homes', 6400, JSON.stringify( homesInRedis ))

            }

            return response.status( 200 ).json({ message : 'Medicine added to ', addedMed : rest })
    
        }     

    } catch ( error ) { response.status( 500 ).json({ error : 'Error occured on adding medicine' }) }

}

// Consume medicine
export const consumeMedController = async ( request, response ) => {

    try {

        const { medicineId, homeId } = request?.body
        const medicine = await AddedMedModel.findById( medicineId )

        // Updates the cached Redis "Homes" data after a medicine is modified or removed.
        // If the medicine quantity becomes zero, it is removed from the home's availableMedicines list.
        // Otherwise, the quantity is decremented while keeping all other cached data intact.
        // Ensures proper ObjectId comparison, immutability, and persists the updated list back to Redis.
        let redisHomes = JSON.parse( await redisClient.get('Homes') )
        if( redisHomes && redisHomes.length > 0 ) {

            redisHomes = redisHomes.map( home => {

                if( home._id === homeId ) {

                    if( medicine?.quantity === 1 ) {

                        // Delete specefic medicine data from available medicine of REDIS
                        return {
    
                            ...home,
                            availableMedicines : home.availableMedicines.filter( med => med._id != medicineId )
    
                        }

                    } else {

                        // Just decrement the quantity of sepecefic medicine from available medicine of REDIS
                        return {

                            ...home,
                            availableMedicines : home.availableMedicines.map( med => 
                                
                                med?._id === medicineId ? { ...med, quantity : med.quantity - 1 } : med

                            )

                        }

                    }


                }

                return home

            } )

            await redisClient.setEx('Homes', 6400, JSON.stringify( redisHomes ))

        }
        
        if( medicine.quantity === 1 ) {

            await AddedMedModel.findByIdAndDelete( medicineId ) // Delete from addmed model
            await HomeModel.findByIdAndUpdate( // Also remove the particular id from available medicines of home data

                homeId,
                { $pull : { availableMedicines : medicineId } }

            )

            return response.status( 200 ).json({ 
                
                message : `All medicines for ${medicine?.disease} have been taken`, 
                medUpdationQty : medicine?.quantity 
            
            })

        } else {

            await AddedMedModel.findByIdAndUpdate( // If current count is greater than 1 then just decrement the count

                medicineId,
                { $inc : { 'quantity' : -1 } }

            )

            return response.status( 200 ).json({ 
                
                message : 'Quantity updated, get well soon!',
                medUpdationQty : medicine?.quantity 
            
            })

        }

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on updating medicine quantity' }) }

}

// Delete medicine
export const deleteMedController = async ( request, response ) => {

    try {

        const { medId, homeId } = request?.body
        await AddedMedModel.findByIdAndDelete( medId ) // Delete from added medicine database
        await HomeModel.findByIdAndUpdate( // Update the available medicine list of corresponding home

            homeId,
            { $pull : { availableMedicines : medId } }

        )

        // Also delete the medicine from redis data
        let redisHomes = JSON.parse( await redisClient.get('Homes') )
        if( redisHomes && redisHomes.length > 0 ) {

            redisHomes = redisHomes.map( home => {

                if( home?._id === homeId ) {

                    return {

                        ...home,
                        availableMedicines : home.availableMedicines.filter( med => med?._id != medId )

                    }

                }

                return home

            } )

            await redisClient.setEx('Homes', 6400, JSON.stringify( redisHomes ))

        }

        return response.status( 200 ).json({ message : 'Medicine deleted successfully' })

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on deleting medicine' }) }

}