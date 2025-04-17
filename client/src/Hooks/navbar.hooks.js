import { useNavigate } from "react-router-dom"

export const useNavigateTo = () => {

    const navigate = useNavigate()
    return ( destination ) => {

        if( destination === 'landing' ) navigate('/')
        else if( destination === 'signup' ) navigate('/signup')

    }

}