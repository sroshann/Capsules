import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { socketListener } from './Store/socketListener.js'
import './main.css'

socketListener( store )

createRoot(document.getElementById('root')).render(

    <>

        <Provider store={ store }>

            <Router>

                <App />

            </Router>

        </Provider>

    </>

)
