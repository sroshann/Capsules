import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
const Landing = lazy( () => import('./Pages/Landing/Landing') )
const Signup = lazy( () => import('./Pages/Signup/Signup') )

function App() {

    return (

        <>

            <Suspense fallback={ <>Loading</> }>

                <Routes>

                    <Route element={ <Landing /> } path='/' />
                    <Route element={ <Signup /> } path='/signup' />

                </Routes>

            </Suspense>
            
        </>

    )

}

export default App
