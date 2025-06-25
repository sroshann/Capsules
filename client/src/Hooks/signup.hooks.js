import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateSignup } from "../lib/validations"
import { toastStyle } from "../constants/common.constant"
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { setIsAuthenticated, setUserData } from "../Store/Reducers/auth.reducer"

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

    const dispatch = useDispatch()
    return async ( data ) => {

        try {

            const response = await axiosInstance.post('/authentication/signup', data)
            const { message, user } = response?.data
            dispatch( setUserData( user ) ) // Setting user details to redux store
            dispatch( setIsAuthenticated() )
            toast.success( message, { style : toastStyle } )

        } catch ( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }

    }

}