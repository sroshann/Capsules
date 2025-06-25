import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducers/auth.reducer'

export default configureStore({

    reducer : {

        authentication : authReducer

    }

})