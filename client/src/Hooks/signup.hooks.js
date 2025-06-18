import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateSignup } from "../lib/validations"

// Signup formik
export const useSignupFromik = () => {

    const signup = useSignup()

    return useFormik({

        initialValues : {

            userName : '',
            phoneNumber : {

                country : '+91', // Setting default value India
                number : ''

            },
            email : '',
            fullName : '',
            password : '',
            confirmPassword : '',
            profilePicture : ''
            
        },
        validate : validateSignup,
        validateOnBlur : false,
        validateOnChange : false,
        validateOnMount : false,
        onSubmit : values => signup( values ) 

    })

}

// Signup 
export const useSignup = () => {

    return async ( data ) => {

        try {

            const response = await axiosInstance.post('/authentication/signup', data)
            console.log('Response = ', response )

        } catch ( error ) { console.error(error) }

    }

}