import { generateToken } from "../lib/utils.js"
import UserModel from "../models/user.model.js"
import bcrypt from 'bcryptjs'

// Signup
export const signupController = async ( request, response ) => {

    try {

        const { email, userName, phoneNumber, password, fullName } = request.body
        const { number } = phoneNumber

        // Checking whether the user is already exist
        const user = await UserModel.findOne({

            $or : [ { email }, { userName }, { 'phoneNumber.number' : number } ]

        })
        if( user ) {

            if( user?.userName === userName ) 
                return response.status( 400 ).json({ error : "Username is already taken" })
            else if( user?.email === email ) return response.status( 400 ).json({ error : "Email is already taken" }) 
            else if( user?.phoneNumber?.number === number ) 
                return response.status( 400 ).json({ error : "Phonenumber is already taken" })

        }

        // Hashing password
        const salt = await bcrypt.genSalt( 10 )
        const hashedPassword = bcrypt.hashSync( password, salt )

        const newUser = new UserModel({

            fullName,
            email,
            password : hashedPassword,
            userName,
            phoneNumber

        })

        if( newUser ) {
            
            generateToken( newUser._id, response )
            await newUser.save()
            const { password, __v, ...rest } = newUser.toObject()
            return response.status( 201 ).json({ message : 'User created successfully', user : rest })

        } else return response.status( 400 ).json({ error : 'Invalid userd data' })

    } catch ( error ) { return response.status( 500 ).json({ error : 'Error occured on signing up' }) }

}