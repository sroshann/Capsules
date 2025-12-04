import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Reducers/auth.reducer'
import homeReducer from './Reducers/home.reducer'
import medicineReducer from './Reducers/medicine.reducer'
import medNamesReducer from './Reducers/medName.reducer'
import allHomesReducer from './Reducers/allHomes.reducer'

export default configureStore({

    reducer : {

        authentication : authReducer,
        homes : homeReducer,
        medicine : medicineReducer,
        medNames : medNamesReducer,
        allHomes : allHomesReducer

    }

})