import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
const Landing = lazy( () => import('./Pages/Landing/Landing') )
const Signup = lazy( () => import('./Pages/Signup/Signup') )
const Login = lazy( () => import('./Pages/Login/Login') )
import { Toaster } from 'react-hot-toast'

function App() {

    return (

        <>

            <Suspense fallback={ <>Loading</> }>

                <Routes>

                    <Route element={ <Landing /> } path='/' />
                    <Route element={ <Signup /> } path='/signup' />
                    <Route element={ <Login /> } path='/login' />

                </Routes>

            </Suspense>

            <Toaster />
            
        </>

    )

}

export default App
