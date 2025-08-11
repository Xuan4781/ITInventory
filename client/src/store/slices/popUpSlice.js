import {createSlice} from "@reduxjs/toolkit"


const popupSlice = createSlice({
    name: "popup",
    initialState: {
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        addNewAdminPopup: false,
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
        toggleAddNewAdminPopup(state){
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },
        toggleAddPeripheralPopup(state){
            state.addPeripheralPopup = !state.addPeripheralPopup;
        },
        closeAllPopup(state){
            state.addBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.addNewAdminPopup = false;
            state.addPeripheralPopup = false;
        }
    }
})

export const {
    closeAllPopup, toggleAddBookPopup, toggleAddNewAdminPopup, toggleReadBookPopup, toggleRecordBookPopup,toggleAddPeripheralPopup,
} = popupSlice.actions;
export default popupSlice.reducer;