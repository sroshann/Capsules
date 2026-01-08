import { redisClient } from "../lib/redis.connection.js"
import AddedMedModel from "../models/addedMed.model.js"
import HomeModel from "../models/home.model.js"
import UserModel from "../models/user.model.js"
import RequestModel from "../models/request.model.js"
import { io } from "../lib/socket.js"

// Creating new home
export const createHomeController = async ( request, response ) => {

    try {

        const { nickName, homeName, country, state, district, pincode, description } = request.body
        const { _id } = request?.user

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
            admin : _id

        })

        if( homeSchema ) {

            const createdHome = await homeSchema.save()
            await createdHome.populate([{ path : 'admin', select : 'profilePicture fullName email userName' }])
            const { __v, updatedAt, ...rest } = createdHome.toObject()

            let redisUser = JSON.parse( await redisClient.get(`user:${ _id }`) )
            if( redisUser ) {

                // Adding the _id of newly created home into its accessedHomes list of corresponding user
                redisUser = { ...redisUser, accessedHomes : [ ...redisUser.accessedHomes, rest?._id ] }
                await redisClient.setEx(`user:${ _id }`, 1800, JSON.stringify( redisUser ))

            }
            await redisClient.setEx(`home:${ rest?._id }`, 1800, JSON.stringify( rest ))
            return response.status( 200 ).json({ message : 'Home created successfully', home : rest })

        }

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on creating home' }) }

}

// Get created homes
export const getCHController = async (request, response) => {

    try {

        // Inorder to make the execution fast the data is fetched form 'redis'
        // If data is not present in 'redis', then it fetched from database
        // and then stored in 'redis'
        const { _id } = request?.user

        const redisUser = JSON.parse(await redisClient.get(`user:${ _id }`))
        if (redisUser && redisUser?.accessedHomes) {

            // Getting home names in which user has access 
            // and then fetching each home data according to the homes from redis
            const userHomes = redisUser?.accessedHomes.map(homeId => `home:${homeId}`)
            const cachedHomes = await redisClient.mGet(userHomes)
            const homes = cachedHomes.filter(Boolean).map(home => JSON.parse(home))
            if (homes && homes.length > 0) return response.status(200).json({ homes })

        }

        // Fetching the homes in which the accessed user is 'admin'
        // or the homes in which user have the access
        // In here the type of _id is string but the admin and the accessedUsers has object Ids
        // But in this query, Mongo db automatically cast string into object Ids in the case of equality

        let homes = await HomeModel.find({

            $or: [

                { admin: _id },
                { accessedUsers: _id }

            ]

        }).select('-__v -updatedAt')

        // First check the dates of medicines stored with the corresponding medicine Id
        // and update it with 'e' if expired
        const today = new Date()
        for (const home of homes) {

            const medicines = await AddedMedModel.find({ homeId: home._id })
            for (const med of medicines) {

                if (med?.expiryDate != "e") {

                    // There is no need to check already date confirmed medicines
                    const medDate = new Date(med?.expiryDate)
                    if (today >= medDate) {

                        await AddedMedModel.findByIdAndUpdate(

                            med._id,
                            { $set: { expiryDate: "e" } }

                        )

                    }
                }

            }

        }

        // Then populate the data
        homes = await HomeModel.populate(homes, [

            { path: 'admin', select: 'profilePicture fullName email userName' },
            { path: 'accessedUsers', select: 'profilePicture fullName email _id userName' },
            { path: 'availableMedicines', select : '-__v' },
            {

                // REQUEST POOPULATION IS ONLY REQUIRE IF THE CURRENT USER IS ADMIN OF ANY HOME
                path: 'accessRequest',
                match: { homeAdmin: _id },
                select: '-updatedAt -__v -homeAdmin -homeId',
                populate: {

                    // In here the requester basic data are also needed, 
                    // then its population can also done by nested population
                    path: 'requester',
                    select: 'profilePicture userName'

                }

            }

        ])

        if (homes && homes.length > 0) {

            // Stores each home with its own _id
            await Promise.all(

                homes.map(home => redisClient.setEx( `home:${home._id}`, 1800, JSON.stringify(home)))

            )
            let user = JSON.parse(await redisClient.get(`user:${ _id }`))
            if (user) {

                // The _id of each home is added to user data
                // So later then we can fetch the home data of corresponding user
                user.accessedHomes = homes.map(home => home?._id)
                await redisClient.setEx(`user:${ _id }`, 1800, JSON.stringify(user))

            }
            return response.status(200).json({ homes })

        } else return response.status(401).json({ error: 'No homes were created' })

    } catch (error) { return response.status(500).json({ error: 'Error occured on getting homes' }) }

}

// Get data of partcular home
export const getPHController = async ( request, response ) => {

    try {

        const { homeId } = request.params
        const { _id } = request.user // From auth.middleware

        let redisHome = JSON.parse( await redisClient.get(`home:${ homeId }`) )
        if( redisHome && Object.keys( redisHome ).length > 0 ) {

            // Fetching home data from redis
            // The admin and accessed user constraints are already validated before data added to redis
            return response.status( 200 ).json({ home : redisHome })

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
                { path : 'availableMedicines', select : '-__v' },
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
            let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if ( home && Object.keys( home ).length > 0 ) {

                home = { ...home, availableMedicines : [ ...home.availableMedicines, rest ] }
                await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( home ))

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
        let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
        if( home && Object.keys( home ).length > 0 ) {

            if ( medicine?.quantity === 1 ) {

                // Deleting specefic medicine data from available medicine of redis
                home = {  

                    ...home,
                    availableMedicines : home?.availableMedicines.filter( med => med?._id != medicineId )

                }

            } else {

                // Just decrement the quantity of sepecefic medicine from available medicine of REDIS
                home = {

                    ...home,
                    availableMedicines : home?.availableMedicines.map( med => med?._id === medicineId ? {

                        ...med,
                        quantity : med?.quantity - 1

                    } : med )

                }

            }

            await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( home ))

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
        let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
        if( home && Object.keys( home ).length > 0 ) {

            home = { ...home, availableMedicines : home?.availableMedicines.filter( med => med?._id != medId ) }
            await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( home ))

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
            let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if( home && Object.keys( home ).length > 0 ) {

                home = { ...home, description : data }
                await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( home ))

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
            let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if ( home && Object.keys( home ).length > 0 ) {

                home = { ...home, country, state, district, pincode }
                await redisClient.setEx( `home:${ homeId }`, 1800, JSON.stringify( home ) )

            }

            return response.status( 200 ).json({ message : 'Address updated successfully' })

        }

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on updating address' }) }

}

// Get all homes for finding other homes
export const getAllHomeCtrl = async ( request, response ) => {

    try {

        // Database access 
        const { _id } = request?.user
        const homes = await HomeModel.find({

            admin: { $ne: _id },
            accessedUsers: { $ne: _id }

        })
        .populate([{ path: 'admin', select: 'profilePicture fullName email _id' }])
        .select('-__v -updatedAt -accessedUsers -availableMedicines -description -accessRequest')

        if (homes && homes.length > 0) return response.status(200).json({ homes })
        else return response?.status(500).json({ error: 'No other homes were found' })

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on getting homes data' }) }

}

// Sending home access request
export const sendRequestCtrl = async ( request, response ) => {

    try {

        const { homeId, admin } = request?.body
        const { _id } = request?.user

        // Saving new request 
        const newRequset = await RequestModel.create({ requester : _id, homeId, homeAdmin : admin })
        const { __v, updatedAt, ...rest } = newRequset.toObject()
        // Updating the corresponding home
        const update = await HomeModel.findByIdAndUpdate( 
            
            homeId,
            { $push : { accessRequest : rest?._id } },
            { new : true }
        
        )

        if ( update ) {

            const requestedUser = await UserModel.findById( _id ).select('profilePicture userName')
            let home = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if ( home ) {

                home = {

                    ...home,
                    accessRequest : [ ...home?.accessRequest, {

                        _id : rest?._id,
                        status : rest?.status,
                        createdAt : rest?.createdAt,
                        requester : requestedUser

                    } ]

                }

                await redisClient.setEx( `home:${ homeId }`, 1800, JSON.stringify( home ) )
                
            }

            // Sending socket request to coresponding admin
            io.to( admin ).emit('access_request',{

                _id : rest?._id,
                status : rest?.status,
                createdAt : rest?.createdAt,
                requester : requestedUser

            })
            return response.status( 200 ).json({ message : 'Request sent successfully' })

        } 
        else {

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
        // admin will object id and _id may string or object id
        if( home?.admin.toString() != _id.toString() ) 
            return response.status( 500 ).json({ error : 'You have no permission to manage user access' })

        const addedUser = await UserModel.findById( requesterId ).select("_id fullName userName email profilePicture")
        if( option === "a" ) { // Accepting user request

            // Adding ID of requester into accessed users list of home
            // Removing the reqeust ID from access request list
            const update = await HomeModel.findByIdAndUpdate(

                homeId,
                { 
                    
                    $push : { accessedUsers : requesterId },
                    $pull : { accessRequest : requestId }
                
                },
                { new : true }

            )

            if( !update ) return response?.status( 500 ).json({ error : 'Error occured on accepting request' })
            
            // Adding the details of approved user into redis data of home
            // Removing the accepted request data from accessRequest list of redis
            let redisHome = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if( redisHome && Object.keys( redisHome ).length > 0 ) {

                redisHome = {

                    ...redisHome,
                    accessedUsers : [ ...redisHome.accessedUsers, addedUser ],
                    accessRequest : redisHome?.accessRequest.filter( request => request?._id != requestId )

                }
                await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( redisHome ))

            }
            
            await RequestModel.findByIdAndDelete( requestId ) // Finally deleting the accepted reequest from request database
            return response.status( 200 ).json({ message : `${ addedUser?.userName } added to your members list`, user : addedUser })

        } else if ( option === "r" ) { // Rejecting user request

            // Setting the status of request from 'a' to 'r'
            const update = await RequestModel.findByIdAndUpdate(  

                requestId,
                { $set : { status : 'r' } }

            )

            if( !update ) return response.status( 500 ).json({ error : 'Error occured on rejecting the request' })
            
            // Also make the updation in redis data
            let redisHome = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if ( redisHome && Object.keys( redisHome ).length > 0 ) {

                redisHome = {  

                    ...redisHome,
                    accessRequest : redisHome?.accessRequest.map( request => request?._id === requestId ? {

                        ...request,
                        status : 'r'

                    } : request )

                }
                await redisClient.setEx( `home:${ homeId }`, 1800, JSON.stringify( redisHome ) )

            }

            return response?.status( 200 ).json({ message : `Rejected request from ${ addedUser?.userName }` })

        } else { // Deleting rejected request

            // Removing the request Id from access request list of home
            const update = await HomeModel.findByIdAndUpdate(

                homeId,
                { $pull : { accessRequest : requestId } }

            )

            if( !update ) return response.status( 500 ).json({ error : 'Error occured on deleting the request' })

            // Also remove request from access request list of redis data
            let redisData = JSON.parse( await redisClient.get(`home:${ homeId }`) )
            if( redisData && Object.keys( redisData ).length > 0 ) {
                
                redisData = {

                    ...redisData,
                    accessRequest : redisData?.accessRequest.filter( request => request?._id != requestId )

                }
                await redisClient.setEx( `home:${ homeId }`, 1800, JSON.stringify( redisData ) )

            }

            await RequestModel.findByIdAndDelete( requestId ) // Finally delete the request from request collection
            return response.status( 200 ).json({ message : `Deleted request from ${ addedUser?.userName }` })

        }

    } catch ( error ) { return response?.status( 500 )?.json({ error : 'Error occured on validating reqeusts' }) }

}

// Remove members from home
export const removeMemberCtrl = async ( request, response ) => {

    try {

        const { homeId, memberId, memberName } = request?.body
        const { _id } = request?.user

        // Check whether current user is admin of the home
        const home = await HomeModel.findById( homeId ).select('admin homeName')
        if( home?.admin.toString() != _id.toString() ) 
            return response.status( 500 ).json({ error : 'You have no permission to remove the member' })

        // Removing specified member id from accessedUsers list of home
        const update = await HomeModel.findByIdAndUpdate(

            homeId,
            { $pull : { accessedUsers : memberId } }

        )
        if( !update ) return response?.status( 500 ).json({ error : 'Error occured while removing member' })

        // Also make the change in redis
        let redisHome = JSON.parse( await redisClient.get(`home:${ homeId }`) )
        if( redisHome && Object.keys( redisHome ).length > 0 ) {

            redisHome = {

                ...redisHome,
                accessedUsers : redisHome?.accessedUsers.filter( member => member?._id != memberId )

            }
            await redisClient.setEx(`home:${ homeId }`, 1800, JSON.stringify( redisHome ))

        }

        return response?.status( 200 ).json({ message : `${ memberName } removed from ${ home?.homeName }` })

    } catch ( error ) { return response?.status( 500 ).json({ error : 'Error occured on removing user' }) }

}