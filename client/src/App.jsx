import { Route, Routes } from 'react-router-dom'
import Landing from './Pages/Landing/Landing'

function App() {

    return (

        <>

            <Routes>

                <Route element={ <Landing /> } path='/' />

            </Routes>
            
        </>

    )

}

export default App
