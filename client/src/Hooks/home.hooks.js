import { useFormik } from "formik"
import { validateCreateHome, validateMedicineNameComponent } from "../lib/validations"
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

// Filter out homes whether you are admin or you have access to
export const useSearchYourHome = () => {

    const { homesData } = useSelector( state => state.homes )

    // Getting search string and resut setting state as parameters
    return ( searchingHome, setFilteredHome ) => {

        try {

            // Filtering out data according to homeName and home nick name
            const filtered = homesData.filter( 
                
                object => object?.homeName === searchingHome || 
                object?.nickName.toLowerCase() === searchingHome.toLowerCase()
            
            )
            
            // Booleans are returned inorder to set the search status
            // to make the cleatring search input process proper 
            if( filtered.length === 0 ) {

                toast.error('No home found', { style : toastStyle })
                return false

            }
            else {

                setFilteredHome( filtered ) // Setting filtered data
                return true

            }

        } catch ( error ) { toast.error("Could'nt search home", { style : toastStyle }) }

    }

}

// Get details of a particular home
export const useGetParticularHome = () => {

    const { homesData } = useSelector( state => state.homes )

    return async ( homeId, setHomeData ) => {

        try {

            if( homesData === null ) {

                // Get data from database
                const response = await axiosInstance.get(`home/getParticularHome/${ homeId }`)
                let { home } = response?.data
                home = {

                    ...home,
                    createdAt : changeDateFormat( home?.createdAt ) // Changing the data format

                }
                setHomeData( home )

            } else {

                // Filter out the home redux data
                const particular = homesData.filter( object => object._id === homeId )
                if( particular.length > 0 ) setHomeData( particular[0] ) // Got data
                else toast.error( 'Home not found', { style : toastStyle } )

            }

        } catch( error ) { toast.error( error?.response?.data?.error , { style : toastStyle }) }

    }

}

// Add medicine formik
export const useAddMedFormik = () => {

    const addMedicine = useAddMedicine()
    return useFormik({

        initialValues : {

            homeId : '',
            nickName : '',
            medicine : '',
            disease : '',
            quantity : '',
            expiryDate : ''

        },
        validate : validateMedicineNameComponent,
        validateOnChange : false,
        validateOnBlur : false,
        validateOnChange : false,
        onSubmit : ( values, { resetForm } ) => {

            addMedicine( values )
            resetForm()

        }

    })

}

export const useAddMedicine = () => {

    let { homesData } = useSelector( state => state.homes )
    const dispatch = useDispatch()

    return async ( data ) => {

        let loading = toast.loading('Adding medicine', { style : toastStyle })
        try {

            const { homeId, nickName, medicine, disease, quantity, expiryDate } = data
            const response = await axiosInstance.post('home/addMedicine', data)
            const { message } = response?.data

            homesData = homesData?.map( home => {
                
                if( home._id === homeId ) {
                    
                    return {
                        
                        ...home,
                        availableMedicines : [

                            ...home.availableMedicines,
                            { medicine, disease, quantity, expiryDate }

                        ]
                        
                    }
                    
                }
                return home
                
            } )

            dispatch( setHomes( homesData ) )
            toast.success( message + nickName, { style : toastStyle } )

        } catch ( error ) { toast.error( error?.response?.data?.error, { style : toastStyle } ) }
        finally { toast.remove( loading ) }

    }

}