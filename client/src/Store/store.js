import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducers/auth.reducer'
import homeReducer from './Reducers/home.reducer'

export default configureStore({

    reducer : {

        authentication : authReducer,
        homes : homeReducer

    }

})