export const signupController = async ( request, response ) => {

    try {

        const { data } = request.body
        console.log( 'Data receiving = ', data )
        return response.status( 201 ).json({ message : 'Data received successfully' })

    } catch ( error ) { 

        console.log( error )
        return response.status( 500 ).json({ error : 'Error occured on signing up' })

    }

}