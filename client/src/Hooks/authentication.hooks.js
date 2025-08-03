import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateForgot, validateLogin, validateProfile, validateSignup } from "../lib/validations"
import { toastStyle } from "../constants/common.constant"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { setChangePassword, setIsAuthenticated, setMailOTP, setUserData } from "../Store/Reducers/auth.reducer"
import { useLocation, useNavigate } from "react-router-dom"
import { changeDateFormat } from "../lib/utils"
import { isEqual } from 'lodash'

// Signup formik
export const useSignupFromik = () => {

    const signup = useSignup()

    return useFormik({

        initialValues: {

            userName: '',
            phoneNumber: {

                dailCode: '+91', // Setting default value India
                number: '',
                countryCode : 'IN'

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

    return async (data) => {

        try {

            const loading = toast.loading('Signing in', { style : toastStyle })
            const response = await axiosInstance.post('/authentication/signup', data)
            const { message, user } = response?.data
            user.createdAt = changeDateFormat( user?.createdAt ) // Changing Mongo DB default date format
            dispatch(setUserData(user)) // Setting user details to redux store
            dispatch(setIsAuthenticated())
            toast.remove( loading )
            toast.success(message, { style: toastStyle })

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

    return async (data) => {

        try {

            const loading = toast.loading('Logging in', { style : toastStyle })
            const response = await axiosInstance.post('/authentication/login', data)
            const { message, user } = response?.data
            user.createdAt = changeDateFormat( user?.createdAt ) // Changing Mongo DB default date format
            dispatch(setUserData(user))
            dispatch(setIsAuthenticated())
            toast.remove( loading )
            toast.success(message, { style: toastStyle })

        } catch (error) { toast.error(error?.response?.data?.error, { style: toastStyle }) }

    }

}

// Logout 
export const useLogout = () => {

    const dispatch = useDispatch()

    return async () => {

        try {

            const loading = toast.loading('Logging out', { style : toastStyle })
            const response = await axiosInstance.get('/authentication/logout')
            const { message } = response?.data
            dispatch(setUserData(null)) // Clearing user data
            dispatch(setIsAuthenticated())
            toast.remove( loading )
            toast.success(message, { style: toastStyle })

        } catch (error) { toast.error(error?.response?.data?.error, { style: toastStyle }) }

    }

}

// Get user details on data loss on checking whether the token is still exist in backend or not
export const useGetUserData = () => {

    const { userData } = useSelector( state => state.authentication )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    return async () => {

        try {

            if( userData === null ) {
                
                const response = await axiosInstance.get('/authentication/getUserData')
                const { user } = response?.data
                user.createdAt = changeDateFormat( user?.createdAt ) // Changing Mongo DB default date format
                dispatch( setUserData( user ) )
                dispatch( setIsAuthenticated() )
                navigate( location?.pathname || '/', { replace : true } )
                
            } else return

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

            const loading = toast.loading('Mailing OTP', { style : toastStyle })
            const response = await axiosInstance.post('/authentication/mailOTP', data)
            dispatch( setMailOTP() ) // To visible OTP entering section
            const { message } = response?.data
            toast.remove( loading )
            toast.success( message, { style : toastStyle } ) 

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } )}

    }
    
}

// Validate OTP
export const useValidateOTP = () => {

    const dispatch = useDispatch()
    return async ( otp ) => {

        try {

            // Validating the entered OTP
            if (!otp) return toast.error('OTP cannot be empty', { style: toastStyle })
            else if (otp.split(" ").join("") != otp || otp.length !== 6 || isNaN(otp))
                return toast.error('Invalid OTP', { style: toastStyle })
        
            const response = await axiosInstance.post('/authentication/validateOTP', { otp })

            // If validation become true show the change password section
            const { validate, message } = response?.data
            toast.success( message, { style : toastStyle } )
            if( validate ) dispatch( setChangePassword() )

        } catch( responseError ) {  

            const { error, expired } = responseError?.response?.data
            // To hide OTP entering section if the OTP is expired after 5 minutes
            if( expired ) dispatch( setMailOTP() )
            toast.error( error, { style : toastStyle } )

        }

    }

}

// Change password
export const useChangePassword = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    return async ( data ) => {

        try {

            const loading = toast.loading('Changing password', { style : toastStyle })
            const { password } = data
            const response = await axiosInstance.post('/authentication/changePassword', { password })
            const { message } = response?.data
            toast.remove( loading )
            toast.success( message, { style : toastStyle } )

            navigate('/login')
            // Hiding OTP input and password input after completing the process
            dispatch( setMailOTP() )
            dispatch( setChangePassword() )

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }

    }

}

// User profile formik
export const useProfileFormik = ( setEdit ) => {

    const { userData } = useSelector( state => state.authentication )
    const updateProfile = useUpdateProfile()
    return useFormik({

        initialValues : {

            fullName : userData?.fullName || '',
            email : userData?.email || '',
            userName : userData?.userName || '',
            phoneNumber: {

                dialCode: userData?.phoneNumber?.dialCode || '', // Setting default value India
                number: userData?.phoneNumber?.number || '',
                countryCode : userData?.phoneNumber?.countryCode || ''

            },
            profilePicture : userData?.profilePicture || ''

        },
        validate : validateProfile,
        validateOnBlur : false,
        validateOnChange : false,
        validateOnMount : false,
        onSubmit : values => {

            if( !values.profilePicture ) values.profilePicture = userData.profilePicture || ''
            updateProfile( values )
            setEdit( previous => !previous )
            
        }

    })

}

export const useUpdateProfile = () => {

    const { userData } = useSelector( state => state.authentication )
    const dispatch = useDispatch()
    return async ( data ) => {

        const loading = toast.loading('Updating user data', { style : toastStyle })
        try {

            const { createdAt, memberOf, updatedAt, _id, __v, ...rest } = userData
            let changedData = {}
            
            // Checking for only the changed values
            for( const key in rest ) {
                
                if( !isEqual( rest[ key ], data[ key ] ) ) changedData[ key ] = data[ key ]
                
            }
            
            // Retrun if no fields were changed
            if( Object.keys( changedData ).length === 0 ) return toast.error('No fields are changed', { style : toastStyle })

            const response = await axiosInstance.put('/authentication/updateProfile', changedData)
            const { message, updatedUser } = response?.data
            updatedUser.createdAt = changeDateFormat( updatedUser?.createdAt ) // Changing Mongo DB default date format
            dispatch(setUserData(updatedUser)) // Setting updated user data to redux store
            toast.success( message, { style : toastStyle } )
            
        } catch ( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }
        toast.remove( loading )

    }

}