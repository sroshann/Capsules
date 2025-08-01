import { useNavigate } from "react-router-dom"

// Navigation
export const useNavigateTo = () => {

    const navigate = useNavigate()
    return ( destination ) => {

        if( destination === 'landing' ) navigate('/')
        else if( destination === 'signup' ) navigate('/signup')
        else if( destination === 'login' ) navigate('/login')
        else if( destination === 'profile' ) navigate('/profile')
        else if( destination === 'home' ) navigate('/home')
        else if( destination === 'createHome' ) navigate('/createHome')

    }

}