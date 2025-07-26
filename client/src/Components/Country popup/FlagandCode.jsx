import React, { useEffect, useState } from 'react'
import { useGetCounrtyDetails } from '../../Hooks/common.hooks'
import './FlagandCode.css'

function FlagandCode() {

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

    return (

        <>

            {
                countryDetails.length > 0 && <section id='flag-and-code-popup' >

                    {countryDetails.map((object) => (

                        <div key={object.code}>

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