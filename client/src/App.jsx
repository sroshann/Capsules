import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { ProtectAuth, ProtectFeatures } from './Middlewares/ProtectRoutes' 
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { useGetUserData } from './Hooks/authentication.hooks'

const Landing = lazy( () => import('./Pages/Landing/Landing') )
const Signup = lazy( () => import('./Pages/Signup/Signup') )
const Login = lazy( () => import('./Pages/Login/Login') )
const ForgotPassword = lazy( () => import('./Pages/Forgot/ForgotPassword') )
const Profile = lazy( () => import('./Pages/Profile/Profile') )
const Home = lazy( () => import('./Pages/Home/Home') )
const CreateHome = lazy( () => import('./Pages/Create new home/CreateHome') )
const Medicines = lazy( () => import('./Pages/Medicines/Medicines') )
const About = lazy( () => import('./Pages/About/About') )

function App() {

    const { userData } = useSelector( state => state.authentication )
    // const { homesData } = useSelector( state => state.homes )
    // console.log( homesData )
    const getUserData = useGetUserData() // Hook use to get user data on data loss

    useEffect( () => {

        // The data is fetched from backend on checking the token
        // is still exist in cookies of backend
        // If token is still exist the user is authenticated,
        // so we can fetch user data from token and then from database
        // console.log('User data changes')
        getUserData()

    }, [ userData ] )

    return (

        <>

            <Suspense fallback={ <>Loading</> }>

                <Routes>

                    <Route element={ <Landing /> } path='/' />
                    <Route element={ <ProtectAuth><Signup /></ProtectAuth> } path='/signup' />
                    <Route element={ <ProtectAuth><Login /></ProtectAuth> } path='/login' />
                    <Route element={ <ProtectAuth><ForgotPassword /></ProtectAuth> } path='/forgot' />
                    <Route element={ <ProtectFeatures><Profile /></ProtectFeatures> } path='/profile' />
                    <Route element={ <ProtectFeatures><Home /></ProtectFeatures> } path='/home' />
                    <Route element={ <ProtectFeatures><CreateHome /></ProtectFeatures> } path='/createHome' />
                    <Route element={ <Medicines /> } path='/medicines' />
                    <Route element={ <About /> } path='/about' />

                </Routes>

            </Suspense>

            <Toaster />
            
        </>

    )

}

export default App
