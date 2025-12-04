import { createSlice } from "@reduxjs/toolkit"

const initialState = { allHomesData : null }

const allHomesSlice = createSlice({

    initialState,
    name : 'All Homes',
    reducers : {

        setAllHomes : ( state, action ) => { state.allHomesData = action.payload }

    }

})

export const { setAllHomes } = allHomesSlice.actions
export default allHomesSlice.reducer