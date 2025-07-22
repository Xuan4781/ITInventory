import {createSlice} from "@redux.js/toolkit"

const popupSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
    },
    reducers: {
        toggleSettingPopup(state){
            state.settingPopup = !state.settingPopup;
        },
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
        toggleReturnBookPopup(state){
            state.returnBookPopup = !state.returnBookPopup;
        },
        closeAllPopup(state){
            state.settingPopup = false;
            state.addBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.addNewAdminPopup = false;
            state.returnBookPopup = false;
        }
    }
})

export const {
    closeAllPopup, toggleAddBookPopup, toggleAddNewAdminPopup, toggleReadBookPopup, toggleRecordBookPopup, toggleReturnBookPopup, toggleSettingPopup
} = popupSlice.actions;
export default popupSlice.reducer;