import { useFormik } from "formik"
import { validateCreateHome } from "../lib/validations"
import toast from "react-hot-toast"
import { toastStyle } from "../constants/common.constant"
import { axiosInstance } from "../lib/axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setHomes } from "../Store/Reducers/home.reducer"
import { changeDateFormat } from "../lib/utils"

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

    const dispatch = useDispatch()
    const { homesData } = useSelector( state => state.homes )
    const { userData } = useSelector( state => state.authentication )

    return async ( data ) => {

        const loading = toast.loading('Creating your home', { style : toastStyle })
        try {

            data.userId = userData._id
            const response = await axiosInstance.post('/home/createHome', data)
            const { message, home } = response?.data
            dispatch( setHomes( [ ...homesData, home ] )) // Adding newly created home to redux
            toast.success( message, { style : toastStyle } )

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }
        toast.remove( loading )

    }

}

// Get created homes
export const useGetHomes = () => {

    const dispatch = useDispatch()
    const { userData } = useSelector( state => state.authentication )
    const { homesData } = useSelector( state => state.homes )

    return async () => {

        const loading = toast.loading('Getting homes data', { style : toastStyle })
        try {

            if( homesData === null ) {

                const response = await axiosInstance.get(`/home/getCreatedHomes/${ userData._id }`)
                let { homes } = response?.data
                homes = homes.map( ( value ) => ({
                    
                    // Changing the date format of each home
                    ...value,
                    createdAt : changeDateFormat( value?.createdAt )
                    
                }))
                dispatch( setHomes( homes ) ) // Home data are store in 'redux'

            }

        } catch( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }
        toast.remove( loading )

    }

}   