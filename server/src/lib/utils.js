import jwt from 'jsonwebtoken'

// Generate token
export const generateToken = ( userId, response ) => {

    const token = jwt.sign( { userId }, process.env.JWTSECRET, { expiresIn : '1d' } )
    response.cookie('credential', token, {

        maxAge : 1 * 24 * 60 * 60 * 1000, // Converting 1 day into milliseconds
        httpOnly : true,
        sameSite : 'strict',
        secure : process.env.NODE_ENV !== 'development'

    })

    return token

}