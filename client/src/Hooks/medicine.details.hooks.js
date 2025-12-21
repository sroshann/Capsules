import { useFormik } from "formik"
import { validateMedicineName } from "../lib/validations"
import axios from "axios"
import toast from "react-hot-toast"
import { toastStyle } from "../constants/common.constant"
import { useDispatch, useSelector } from "react-redux"
import { setSearchedMed } from "../Store/Reducers/medicine.reducer"
import { setMedicineNames } from "../Store/Reducers/medName.reducer"

// Search medicine formik
export const useMedicineFormik = () => {

    const getMedDetails = useGetMedDetails()

    return useFormik({

        initialValues: { medicine: '' },
        validate: validateMedicineName,
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        onSubmit: values => getMedDetails(values)

    })

}

// Get medicine details from API according to searched medicine
export const useGetMedDetails = () => {

    const dispatch = useDispatch()
    return async ({ medicine }) => {

        const loading = toast.loading('Getting medicine details', { style: toastStyle })
        try {

            const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicine}`)
            toast.success('Revceived medicine details', { style: toastStyle })
            let medData = response?.data?.results[0]

            // Changing the format of medicine name
            let genericName = medData?.openfda?.generic_name?.[0]
            genericName = genericName.toLowerCase() // Converting all letters into lower case
            // And convert first letter into upper case and append the remaining letters with it
            genericName = genericName.charAt(0).toUpperCase() + genericName.slice(1)
            medData = { ...medData, name: genericName }

            // Removing the 'Purpose' word from purpose
            let purpose = medData?.purpose?.[0]
            medData = { ...medData, purpose: purpose?.slice(8) }

            dispatch(setSearchedMed(medData)) // Storing searched medicine details to redux

        } catch (error) { toast.error("No medicine found, check spelling", { style: toastStyle }) }
        toast.remove(loading)

    }

}

// Get medicine names on on adding medicine to home
export const useGetMedicineNames = () => {

    const { medicineNames } = useSelector( state => state.medNames )
    const dispatch = useDispatch()

    return async () => {

        const loading = toast.loading('Fetching medicines', { style : toastStyle })
        try {

            if( medicineNames && medicineNames.length === 0 ) {

                const response = await axios.get
                    (`https://api.fda.gov/drug/label.json?search=openfda.brand_name:%20*&limit=100`)
    
                let { results } = response?.data
                results = results
                    ?.map( medicines => medicines?.openfda?.brand_name )
                    .filter( Boolean )
                    .flat()
                dispatch( setMedicineNames( results || null ) )
                return (results || null)

            } else return medicineNames

        } catch (error) { toast.error('Error occured on gtting medicine names', { style : toastStyle }) }
        finally { toast.remove( loading ) }

    }

}