import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    medicineNames : []

}

const medNameSlice = createSlice({

    initialState,
    name : 'MedicineName',
    reducers : {

        setMedicineNames : ( state, action ) => { state.medicineNames = action.payload }

    }

})

export const { setMedicineNames } = medNameSlice.actions
export default medNameSlice.reducer