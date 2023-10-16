import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import UserReducer from './slices/user/UserSlice'

export const store = configureStore({
    
    reducer: {
        user: UserReducer
    }, // reducer: like a table
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
})
