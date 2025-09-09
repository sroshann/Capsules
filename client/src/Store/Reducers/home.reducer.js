import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    homesData : null

}

const homeSlice = createSlice({

    name : 'Homes',
    initialState,
    reducers : {

        setHomes : ( state, action ) => { state.homesData = action.payload }

    }

})

export const { setHomes } = homeSlice.actions
export default homeSlice.reducer