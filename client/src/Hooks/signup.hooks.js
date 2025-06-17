import { axiosInstance } from "../lib/axios"

export const useSignup = () => {

    return async () => {

        try {

            const response = await axiosInstance.post('/authentication/signup', { data : 'roshan' })
            console.log('Response = ', response )

        } catch ( error ) { console.error(error) }

    }

}