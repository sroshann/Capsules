import { sendMailTo } from "../lib/email.lib.js"
import { redisClient } from "../lib/redis.connection.js"
import { generateToken } from "../lib/utils.js"
import UserModel from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

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

// Login
export const loginController = async ( request, response ) => {

    try {

        const { email, password } = request.body

        // Fetching user data
        const user = await UserModel.findOne({ email })
        if( user ) {

            const compare = bcrypt.compareSync( password, user.password )
            if( compare ) {

                generateToken( user._id, response )
                const { password, __v, ...rest } = user.toObject()
                return response.status( 200 ).json({ message : 'User authenticated', user : rest })


            } else return response.status( 400 ).json({ error : 'Invalid credentials' })

        } else return response.status( 400 ).json({ error : 'Invalid credentials' })

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on loging in' }) }

}

// Logout
export const logoutController = async ( request, response ) => {

    try {

        // Deleting cookie
        response.cookie('credential', '', { maxAge : 0 })
        return response.status( 200 ).json({ message : 'Loged out successfully' })

    } catch( error ) { return response.status( 500 ).json({ error : 'Error ocuured while logging out' }) }

}

// Get user data on data loss
export const getUserDataController = async ( request, response ) => {

    try {

        const token = request.cookies.credential
        if( token ) {

            const decode = jwt.verify( token, process.env.JWTSECRET )
            if( decode ) {

                const user = await UserModel.findById( decode.userId ).select('-password')
                return response.status( 200 ).json({ user })

            }

        } else return

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on getting user data' }) }

}

// Email OTP
export const mailOTPController = async ( request, response ) => {

    try {

        const { email } = request.body
        // Checks whehter the mail is exist in database or not
        const user = await UserModel.findOne({ email })
        if( !user ) return response.status( 500 ).json({ error : 'This mail not exist in user data' })

        // Generating otp
        const generatedOTP = otpGenerator.generate(6, {

            lowerCaseAlphabets : false,
            upperCaseAlphabets : false,
            specialChars : false

        })
        
        const subject = 'Change password'
        const description = `Change the password by typing this OTP ${ generatedOTP }`

        // Storing the otp in redis with key value 'otp' and it will expire in 5 minutes( 300 seconds )
        await redisClient.setEx( 'otp', 300, generatedOTP )
        // Storing email of user in redis inorder use while changing password
        await redisClient.setEx( 'email', 300, email )
        sendMailTo( email, subject, description ) // Sending email

        return response.status( 200 ).json({ message : 'OTP mailed' })

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured on sending email' }) }

}

// Validate OTP
export const validateOTPController = async ( request, response ) => {

    try {

        const { otp } = request.body
        const redisOtp = await redisClient.get('otp')

        // Return error if the otp is expired after 5 minutes
        if( !redisOtp ) return response.status( 500 ).json({ error : 'OTP expired, please request again', expired : true })
        else if( otp !== redisOtp ) return response.status( 500 ).json({ error : 'OTP missmatches' })
        
        await redisClient.del('otp') // Deleting the otp from redis after its usage
        return response.status( 200 ).json({ message : 'OTP validated', validate : true })

    } catch ( error ) { response.status( 500 ).json({ error : 'Error occured while validating OTP' }) }

}

// Change password
export const changePasswordController = async ( request, response ) => {

    try {

        const { password } = request.body
        if( !password ) return response.status( 500 ).json({ error : 'Password cannot be empty' })
        
        // Hashing password
        const salt = await bcrypt.genSalt( 10 )
        const hashedPassword = bcrypt.hashSync( password, salt )

        // Retreiving the email of user in the password should be changed, from redis
        const email = await redisClient.get('email')
        const result = await UserModel.updateOne({ email }, { $set : { password : hashedPassword } })

        if( result.acknowledged && result.modifiedCount > 0 ) {

            // Mongo db accepted and updated the document
            await redisClient.del('email') // Deleting the value of email from redis after its usage
            return response.status( 200 ).json({ message : 'Password changed successfully' })

        }

    } catch( error ) { return response.status( 500 ).json({ error : 'Error occured while changing the password' }) }

}