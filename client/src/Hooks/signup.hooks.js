import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateSignup } from "../lib/validations"
import { toastStyle } from "../constants/common.constant"
import toast from "react-hot-toast"

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
        onSubmit : ( values, { resetForm } ) => {

            signup( values )
            resetForm()

        }

    })

}

// Signup 
export const useSignup = () => {

    return async ( data ) => {

        try {

            const response = await axiosInstance.post('/authentication/signup', data)
            const { message, user } = response?.data
            toast.success( message, { style : toastStyle } )

        } catch ( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }

    }

}