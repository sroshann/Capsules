import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
const Landing = lazy( () => import('./Pages/Landing/Landing') )
const Signup = lazy( () => import('./Pages/Signup/Signup') )
const Login = lazy( () => import('./Pages/Login/Login') )
import { ProtectAuth } from './Middlewares/ProtectRoutes' 
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { useGetUserData } from './Hooks/authentication.hooks'

function App() {

    const { userData } = useSelector( state => state.authentication )
    const getUserData = useGetUserData() // Hook use to get user data on data loss

    useEffect( () => {

        // The data is fetched from backend on checking the token
        // is still exist in cookies of backend
        // If token is still exist the user is authenticated,
        // so we can fetch user data from token and then from database
        getUserData()

    }, [ userData ] )

    return (

        <>

            <Suspense fallback={ <>Loading</> }>

                <Routes>

                    <Route element={ <Landing /> } path='/' />
                    <Route element={ <ProtectAuth><Signup /></ProtectAuth> } path='/signup' />
                    <Route element={ <ProtectAuth><Login /></ProtectAuth> } path='/login' />

                </Routes>

            </Suspense>

            <Toaster />
            
        </>

    )

}

export default App
