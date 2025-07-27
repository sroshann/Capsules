import axios from 'axios'
import { toastStyle } from '../constants/common.constant'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

// Hook used to get country code and flags
export const useGetCounrtyDetails = () => {

    return async () => {

        try {

            const response = await axios.get('https://countriesnow.space/api/v0.1/countries/codes')
            const flagResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')

            const countries = response?.data?.data
            const flags = flagResponse?.data?.data
            
            const flagMap = new Map()
            for( const flag of flags ) flagMap.set( flag.iso2, flag.flag )

            // Merging on O(n) complexity
            return countries.reduce( ( accumulator, object ) => {

                const flag = flagMap.get( object.code )
                if( flag ) {

                    accumulator.push({

                        name : object.name,
                        code : object.code,
                        dial_code : object.dial_code,
                        flag

                    })

                }

                return accumulator

            }, [])

        } catch( error ) { console.log( error ) }

    }

}

// Hook used to get user particular flag
export const useGetParticularFlag = ( countryCode ) => {

    const [ flag, setFlag ] = useState( null )

    useEffect( () => {

        ( async () => {

            try {

                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
                const flags = response?.data?.data
                const particular = flags.find( value => value.iso2 === countryCode )
                setFlag( particular?.flag )

            } catch ( error ) { toast.error('Flag error', { style : toastStyle }) }

        } ) ()

    }, [ countryCode ])

    return flag

}

// Converting image into its BS6 format
export const useConvertToBS6 = ( file ) => {

    const [ image, setImage ] = useState( null )
    if( !file ) return 
    const reader = new FileReader()
    reader.readAsDataURL( file )
    reader.onload = () => setImage( reader.result )
    return image

}