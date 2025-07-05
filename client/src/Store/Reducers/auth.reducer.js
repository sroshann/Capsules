import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    userData : null,
    isAuthenticated : false,
    mailOTP : false,
    changePassword : false

}

const authSlice = createSlice({

    name : 'Authentication',
    initialState,
    reducers : {

        setUserData : ( state, action ) => { state.userData = action.payload },
        setIsAuthenticated : ( state ) => { state.isAuthenticated = !state.isAuthenticated },
        setMailOTP : ( state ) => { state.mailOTP = !state.mailOTP },
        setChangePassword : ( state ) => { state.changePassword = !state.changePassword }

    }

})

export const { setUserData, setIsAuthenticated,setMailOTP, setChangePassword } = authSlice.actions
export default authSlice.reducer