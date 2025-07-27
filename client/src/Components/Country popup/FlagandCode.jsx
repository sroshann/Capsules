import React, { useEffect, useState } from 'react'
import { useGetCounrtyDetails } from '../../Hooks/common.hooks'
import './FlagandCode.css'

// Pass a state function as props inorder to store the selected coutry
function FlagandCode({ select, formik }) {

    const [countryDetails, setCountryDetails] = useState([])
    const getCountry = useGetCounrtyDetails()

    const handleGettingData = async (option) => {

        if (option === 'open') setCountryDetails(await getCountry())
        else setCountryDetails([])

    }

    useEffect(() => {

        handleGettingData('open')
        return () => handleGettingData('close')

    }, [])

    // Storing the selected country details in props function state
    const handleSelected = ( countryCode, dialCode, flag ) => {

        select({ countryCode, dialCode, flag })
        formik.setFieldValue('phoneNumber.dialCode', dialCode)
        formik.setFieldValue('phoneNumber.countryCode', countryCode)

    }

    return (

        <>

            {
                countryDetails.length > 0 && <section id='flag-and-code-popup' >

                    {countryDetails.map((object) => (

                        <div key={object.code}
                        onMouseDown={ () => handleSelected( object.code, object.dial_code, object.flag ) }>

                            <img src={object.flag} alt="" />
                            <p>{object.name}</p>

                        </div>

                    ))}

                </section>
            }

        </>

    )

}

export default FlagandCode