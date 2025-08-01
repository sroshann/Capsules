import { useFormik } from "formik"
import { validateCreateHome } from "../lib/validations"
import toast from "react-hot-toast"
import { toastStyle } from "../constants/common.constant"
import { axiosInstance } from "../lib/axios"

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
        onSubmit : ( values, { resetForm } ) => {

            createHome( values )
            resetForm()

        }

    })

}

// Create home
export const useCreateHome = () => {

    return async ( data ) => {

        try {

            console.log( data )
            // const response = await axiosInstance.post('', data)

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }

    }

}