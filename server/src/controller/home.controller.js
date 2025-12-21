import mongoose from "mongoose"
import { redisClient } from "../lib/redis.connection.js"
import AddedMedModel from "../models/addedMed.model.js"
import HomeModel from "../models/home.model.js"
import UserModel from "../models/user.model.js"
import RequestModel from "../models/request.model.js"

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

            // In here the type of _id is string but the admin and the accessedUsers has object Ids
            // But in this query, Mongo db automatically cast string into object Ids in the case of equality

            homes = await HomeModel.find({

                $or : [

                    { admin : _id },
                    { accessedUsers : _id }

                ]

            }).select('-__v -updatedAt')

            // First check the dates of medicines stored with the corresponding medicine Id
            // and update it with 'e' if expired
            const today = new Date()
            for( const home of homes ) {

                const medicines = await AddedMedModel.find({ homeId : home._id })
                for( const med of medicines ) {

                    if (med?.expiryDate != "e") { 

                        // There is no need to check already date confirmed medicines
                        const medDate = new Date(med?.expiryDate)
                        if ( today >= medDate ) {

                            await AddedMedModel.findByIdAndUpdate(

                                med._id,
                                { $set: { expiryDate: "e" } }

                            )

                        }
                    }

                }

            }

            // Then populate the data
            homes = await HomeModel.populate( homes, [

                { path : 'admin', select : 'profilePicture fullName email userName' },
                { path : 'accessedUsers', select : 'profilePicture fullName email _id userName' },
                { path : 'availableMedicines' },
                { 

                    // REQUEST POOPULATION IS ONLY REQUIRE IF THE CURRENT USER IS ADMIN OF ANY HOME
                    path : 'accessRequest', 
                    match : { homeAdmin : _id },
                    select : '-updatedAt -__v -homeAdmin -homeId',
                    populate : {

                        // In here the requester basic data are also needed, 
                        // then its population can also done by nested population
                        path : 'requester',
                        select : 'profilePicture userName'

                    }
                
                }

            ])
            
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
                { path : 'accessedUsers', select : 'profilePicture fullName userName email _id' },
                { path : 'availableMedicines' },
                { 
                    
                    // REQUEST POOPULATION IS ONLY REQUIRE IF THE CURRENT USER IS ADMIN OF ANY HOME
                    path : 'accessRequest', 
                    match : { homeAdmin : _id }, 
                    select: '-updatedAt -__v -homeAdmin -homeId',
                    populate : {

                        // In here the requester basic data are also needed, 
                        // then its population can also done by nested population
                        path : 'requester',
                        select : 'profilePicture userName'

                    } 
                
                }

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

// Update home description
export const updateHomeDescCtrl = async ( request, response ) => {

    try {

        const { homeId, data } = request?.body

        const update = await HomeModel.findByIdAndUpdate(

            homeId,
            { $set : { description : data } },
            { new : true }

        )

        if( !update ) return response.status( 500 ).json({ error : "Counld'nt update description" })
        else {
    
            // Also made the changes in redis
            let redisData = JSON.parse( await redisClient.get('Homes') )
            if( redisData && redisData.length > 0 ) {

                redisData = redisData.map( home => 
                    
                    home._id === homeId ? { ...home, description : data } : home 
                
                )
                await redisClient.setEx('Homes', 6400, JSON.stringify( redisData ))

            }

            return response.status( 200 ).json({ message : "Description updated successfully" })

        }

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on updating description' }) }

}

// Updating address
export const updateAddressCtrl = async ( request, response ) => {

    try {

        const { homeId, data } = request?.body
        const { country, state, district, pincode } = data
        const updated = await HomeModel.findByIdAndUpdate(

            homeId,
            { $set : { country, state, district, pincode } },
            { new : true }

        )

        if( !updated ) { return response.status( 500 ).json({ error : "Could'nt update address" }) }
        else {

            // Update the changes in redis
            let redisData = JSON.parse( await redisClient.get('Homes') )
            if ( redisData && redisData.length > 0 ) {

                redisData = redisData.map( 
                    
                    home => home?._id === homeId ? { ...home, country, state, district, pincode } : home 
                
                )
                await redisClient.setEx( 'Homes', 6400, JSON.stringify( redisData ) )

            }

            return response.status( 200 ).json({ message : 'Address updated successfully' })

        }

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on updating address' }) }

}

// Get all homes for finding other homes
export const getAllHomeCtrl = async ( request, response ) => {

    try {

        const redisData = JSON.parse( await redisClient.get('AllHomes') )
        if ( redisData && redisData.length > 0 ) 
            
            // Redis access
            return response.status( 200 ).json({ homes : redisData })

        else {

            // Database access 
            const { _id } = request?.user
            const homes = await HomeModel.find({

                admin : { $ne : _id },
                accessedUsers : { $ne : _id }

            })
            .populate([ { path : 'admin', select : 'profilePicture fullName email _id' } ])
            .select('-__v -updatedAt -accessedUsers -availableMedicines -description')
            if ( homes && homes.length > 0 ) {
    
                // Storing data into redis inorder for faster access
                await redisClient.setEx('AllHomes', 6400, JSON.stringify( homes )) 
                return response.status( 200 ).json({ homes })
    
            } else return response?.status( 500 ).json({ error : 'No other homes were found' })

        }

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on getting homes data' }) }

}

// Sending home access request
export const sendRequestCtrl = async ( request, response ) => {

    try {

        const { homeId, admin } = request?.body
        const { _id } = request?.user

        // Saving new request 
        const newRequset = await RequestModel.create({ requester : _id, homeId, homeAdmin : admin })
        const { __v, ...rest } = newRequset.toObject()
        // Updating the corresponding home
        const update = await HomeModel.findByIdAndUpdate( 
            
            homeId,
            { $push : { accessRequest : rest?._id } },
            { new : true }
        
        )

        if ( update ) {

            // IAM NOT REALLY SURE ABOUT MAKING THE CHANGES ALSO ON REDIS
            // BECAUSE THIS FEATURE IS LATER DONE BY ANOTHER USER ( HOME ADMIN )
            // SO THE CURRENT USER NOT REQUIRED CURRENT DATA

            // Update the change in redis
            // let redisHome = JSON.parse( await redisClient.get('Homes') )
            // if( redisHome && redisHome.length > 0 ) {

            //     redisHome = redisHome.map( 
                    
            //         home => home?._id === homeId ? { ...home, accessRequest : [ ...home?.accessRequest, rest ] } : home 
                
            //     )
            //     await redisClient.setEx('Homes', 6400, JSON.stringify( redisHome ))

            // }
            return response.status( 200 ).json({ message : 'Request sent successfully' })

        } else {

            await RequestModel.findByIdAndDelete( rest?._id )
            return response?.status( 500 ).json({ error : "Could'nt send requests" })

        }

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured sending request' }) }

}

// Validating user access reqeusts
export const validateUsrAcsReCtrl = async ( request, response ) => {

    try {

        const { _id } = request?.user
        const { homeId, requestId, requesterId, option } = request?.body

        // This feature is only available for home admin, so we should restrict this for other users
        const home = await HomeModel.findById( homeId ).select('admin')
        if( home?.admin != _id ) return response.status( 500 ).json({ error : 'You have no permission to manage user access' })

        if( option === "a" ) {

            // Accepting user request
            // Adding ID of requester into accessed users list of home
            const update = await HomeModel.findByIdAndUpdate(

                homeId,
                { $push : { accessedUsers : requesterId } },
                { new : true }

            )

            if( !update ) return response?.status( 500 ).json({ error : 'Error occured on accepting request' })
            
            // Adding the details of approved user into redis data of home
            const addedUser = await UserModel.findById( requesterId ).select("_id fullName email profilePicture")
            let redisHomes = JSON.parse( await redisClient.get('Homes') )
            if( redisHomes && redisHomes.length > 0 ) {

                redisHomes = redisHomes.map( home => home._id === homeId ? {

                    ...home,
                    accessedUsers : [ ...home.accessedUsers, addedUser ]

                } : home )

                await redisClient.setEx('Homes', 6400, JSON.stringify( redisHomes ))

            }

            // Finally deleting the accepted reequest from request database
            await RequestModel.findByIdAndDelete( requestId )

            return response.status( 200 ).json({ message : `${ addedUser?.fullName } added to your members list`, user : addedUser })

        } else {

            // Rejecting user request

        }
        return response?.status( 200 ).json({ message : 'Successful' })

    } catch ( error ) { return response?.status( 500 )?.json({ error : 'Error occured on validating reqeusts' }) }

}