import axios from 'axios'
import { toastStyle } from '../constants/common.constant'
import toast from 'react-hot-toast'

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

export const useGetParticularFlag = () => {

    return async ( countryCode ) => {

        try {

            const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
            const data = response?.data?.data
            const particlularFlag = data.filter( value => value.iso2 === countryCode )
            return particlularFlag[0].flag

        } catch ( error ) { toast.error('Country flag error', { style : toastStyle }) }

    }

}