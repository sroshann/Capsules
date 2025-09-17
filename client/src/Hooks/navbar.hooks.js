import { useNavigate } from "react-router-dom"

// Navigation
export const useNavigateTo = () => {

    const navigate = useNavigate()
    return ( destination, params = null ) => {

        if( destination === 'landing' ) navigate('/')
        else if( destination === 'signup' ) navigate('/signup')
        else if( destination === 'login' ) navigate('/login')
        else if( destination === 'profile' ) navigate('/profile')
        else if( destination === 'home' ) navigate('/home')
        else if( destination === 'createHome' ) navigate('/createHome')
        else if( destination === 'medicines' ) navigate('/medicines')
        else if( destination === 'about' ) navigate('/about')
        else if( destination === 'homeDetail' ) navigate(`/homeDetail/${ params }`)

    }

}