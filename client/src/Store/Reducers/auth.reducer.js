import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    userData : null,
    isAuthenticated : false

}

const authSlice = createSlice({

    name : 'Authentication',
    initialState,
    reducers : {

        setUserData : ( state, action ) => { state.userData = action.payload },
        setIsAuthenticated : ( state ) => { state.isAuthenticated != state.isAuthenticated }

    }

})

export const { setUserData, setIsAuthenticated } = authSlice.actions
export default authSlice.reducer