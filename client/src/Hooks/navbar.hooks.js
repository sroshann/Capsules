import { useNavigate } from "react-router-dom"

// Navigation
export const useNavigateTo = () => {

    const navigate = useNavigate()
    return ( destination ) => {

        if( destination === 'landing' ) navigate('/')
        else if( destination === 'signup' ) navigate('/signup')
        else if( destination === 'login' ) navigate('/login')

    }

}