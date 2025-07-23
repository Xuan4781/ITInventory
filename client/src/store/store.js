import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import popupReducer from "./slices/popUpSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        popup: popupReducer,
    },

})