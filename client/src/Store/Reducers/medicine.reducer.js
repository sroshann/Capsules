import { createSlice } from "@reduxjs/toolkit"

const initialState = {

    searchedMed : null

}

const medicineSlice = createSlice({

    name : 'Medicine',
    initialState,
    reducers : {

        setSearchedMed : ( state, action ) => { state.searchedMed = action.payload }

    }

})

export const { setSearchedMed } = medicineSlice.actions
export default medicineSlice.reducer