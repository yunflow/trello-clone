import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    data: {}
}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload
        }
    }
})
export const { setUser } = UserSlice.actions

export default UserSlice.reducer