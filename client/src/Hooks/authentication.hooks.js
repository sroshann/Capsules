import { axiosInstance } from "../lib/axios"
import { useFormik } from 'formik'
import { validateLogin, validateSignup } from "../lib/validations"
import { toastStyle } from "../constants/common.constant"
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux'
import { setIsAuthenticated, setUserData } from "../Store/Reducers/auth.reducer"
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