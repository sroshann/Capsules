import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateForgot, validateLogin, validateSignup } from "../lib/validations"
import { toastStyle } from "../constants/common.constant"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { setIsAuthenticated, setMailOTP, setUserData } from "../Store/Reducers/auth.reducer"
import { useNavigate } from "react-router-dom"

// Signup formik
export const useSignupFromik = () => {

    const signup = useSignup()

    return useFormik({

        initialValues: {

            userName: '',
            phoneNumber: {

                country: '+91', // Setting default value India
                number: ''

            },
            email: '',
            fullName: '',
            password: '',
            confirmPassword: '',
            profilePicture: ''

        },
        validate: validateSignup,
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: (values, { resetForm }) => {

            signup(values)
            resetForm()

        }

    })

}

// Signup 
export const useSignup = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    return async (data) => {

        try {

            const response = await axiosInstance.post('/authentication/signup', data)
            const { message, user } = response?.data
            dispatch(setUserData(user)) // Setting user details to redux store
            dispatch(setIsAuthenticated())
            toast.success(message, { style: toastStyle })
            navigate('/')

        } catch (error) { toast.error(error?.response?.data?.error, { style: toastStyle }) }

    }

}

// Login formik
export const useLoginFormik = () => {

    const login = useLogin()
    return useFormik({

        initialValues: {

            email: '',
            password: '',

        },
        validate: validateLogin,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values, { resetForm }) => {

            login(values)
            resetForm()

        }

    })

}

// Login
export const useLogin = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    return async (data) => {

        try {

            const response = await axiosInstance.post('/authentication/login', data)
            const { message, user } = response?.data
            dispatch(setUserData(user))
            dispatch(setIsAuthenticated())
            toast.success(message, { style: toastStyle })
            navigate('/')

        } catch (error) { toast.error(error?.response?.data?.error, { style: toastStyle }) }

    }

}

// Logout 
export const useLogout = () => {

    const dispatch = useDispatch()
    return async () => {

        try {

            const response = await axiosInstance.get('/authentication/logout')
            const { message } = response?.data
            dispatch(setUserData(null)) // Clearing user data
            dispatch(setIsAuthenticated())
            toast.success(message, { style: toastStyle })

        } catch (error) { toast.error(error?.response?.data?.error, { style: toastStyle }) }

    }

}

// Get user details on data loss on checking whether the token is still exist in backend or not
export const useGetUserData = () => {

    const { userData } = useSelector( state => state.authentication )
    const dispatch = useDispatch()
    return async () => {

        try {

            if( userData === null ) {

                const response = await axiosInstance.get('/authentication/getUserData')
                const { user } = response?.data
                dispatch( setUserData( user ) )
                dispatch( setIsAuthenticated() )

            }

        } catch( error ) { toast.error( error?.response?.data?.erro, { style : toastStyle } ) }

    }

}

// Forgot password formik
export const useForgotFormik = () => {

    const sendMail = useSendMail()
    const changePassword = useChangePassword()

    // Email
    const forgotEmailFormik = useFormik({

        initialValues : { email : '' },
        validate : validateForgot.validateForgotEmail,
        validateOnBlur : false,
        validateOnChange : false,
        validateOnMount : false,
        onSubmit : value => sendMail( value )

    })

    // Password, isue might arise
    const passwordFormik = useFormik({

        initialValues : {

            password : '',
            confirmPassword : ''

        },
        validate : validateForgot.validateForgotChange,
        validateOnBlur : false,
        validateOnChange : false,
        validateOnMount : false,
        onSubmit : ( values ) => changePassword( values )

    })

    return { forgotEmailFormik, passwordFormik }

}

// Send mail
export const useSendMail = () => {

    const dispatch = useDispatch()
    return async ( data ) => {

        try {

            const response = await axiosInstance.post('/authentication/mailOTP', data)
            dispatch( setMailOTP() )
            const { message } = response?.data
            toast.success( message, { style : toastStyle } ) 

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } )}

    }
    
}

// Validate OTP
export const useValidateOTP = () => {

    return async ( otp ) => {

        try {

            if (!otp) return toast.error('OTP cannot be empty', { style: toastStyle })
            else if (otp.split(" ").join("") != otp || otp.length !== 6 || isNaN(otp))
                return toast.error('Invalid OTP', { style: toastStyle })
        
            const response = await axiosInstance.post('/authentication/validateOTP', { otp })
            console.log( response )

        } catch( error ) {  }

    }

}

// Change password
export const useChangePassword = () => {

    return async ( data ) => {

        try {

            const { password } = data
            const response = await axiosInstance.post('/authentication/changePassword', { password })
            console.log( response )

        } catch( error ) {  }

    }

}