import { useFormik } from "formik"
import { validateCreateHome } from "../lib/validations"
import toast from "react-hot-toast"
import { toastStyle } from "../constants/common.constant"
import { axiosInstance } from "../lib/axios"
import { useNavigate } from "react-router-dom"

// Create home formik
export const homeFormik = () => {

    // Hook used to create home
    const createHome = useCreateHome()

    return useFormik({

        initialValues : {

            nickName : '',
            homeName : '',
            country : 'India',
            state : '',
            district : '',
            pincode : '',
            description : ''

        },
        validate : validateCreateHome,
        validateOnBlur : false,
        validateOnMount : false,
        validateOnChange : false,
        onSubmit : ( values ) => createHome( values )

    })

}

// Create home
export const useCreateHome = () => {

    const navigate = useNavigate()

    return async ( data ) => {

        const loading = toast.loading('Creating your home', { style : toastStyle })
        try {

            const response = await axiosInstance.post('/home/createHome', data)
            const { message } = response?.data
            navigate('/home')
            toast.success( message, { style : toastStyle } )

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }
        toast.remove( loading )

    }

}