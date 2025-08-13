import {createSlice} from "@reduxjs/toolkit"


const popupSlice = createSlice({
    name: "popup",
    initialState: {
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        addPeripheralPopup: false,
    },
    reducers: {
        toggleAddBookPopup(state){
            state.addBookPopup = !state.addBookPopup;
        },
        toggleReadBookPopup(state){
            state.readBookPopup = !state.readBookPopup;
        },
        toggleRecordBookPopup(state){
            state.recordBookPopup = !state.recordBookPopup;
        },
        toggleAddPeripheralPopup(state){
            state.addPeripheralPopup = !state.addPeripheralPopup;
        },
        closeAllPopup(state){
            state.addBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.addPeripheralPopup = false;
        }
    }
})

export const {
    closeAllPopup, toggleAddBookPopup,toggleReadBookPopup, toggleRecordBookPopup,toggleAddPeripheralPopup,
} = popupSlice.actions;
export default popupSlice.reducer;