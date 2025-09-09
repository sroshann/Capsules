import UserModel from "../models/user.model.js"

// Getting admin details for a home
export const getAdminDeatils = async ( admin ) => {

    try {

        // Mongoose auto-converts string → ObjectId here
        const adminDetails = await UserModel.findById( admin )
        const { profilePicture, fullName, userName, email } = adminDetails
        return { profilePicture, fullName, userName, email }

    } catch ( error ) { console.log('Error occured on getting admin details = ', error ) }

}