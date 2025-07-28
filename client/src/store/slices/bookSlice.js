import { createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";


const bookSlice = createSlice({
    name: "Device",
    initialState: {
        loading: false,
        error: null,
        message: null,
        books: [],
    },
    reducers:{
        fetchBooksRequest(state){
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        fetchBooksSuccess(state, action){
            state.loading = false;
            state.books = action.payload;
        },
        fetchBooksFailed(state, action){
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        addBooksRequest(state){
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        addBooksSuccess(state, action){
            state.loading = false;
            state.message = action.payload;
        },
        addBooksFailed(state, action){
            state.error = action.payload;
            state.message = null;
            state.loading = false;
        },
        resetBookSlice(state){
            state.error = null;
            state.message = null;
            state.loading = false;
        }
    }
})

export const fetchAllBooks = ()=> async(dispatch) => {
    dispatch(bookSlice.actions.fetchBooksRequest());
    await axios.get("http://localhost:4000/api/v1/book/all", {withCredentials:true}).then(res=>{
        dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books))
    }).catch(err=>{
        dispatch(bookSlice.actions.fetchBooksFailed(err.response.data.message))
    })
}

export const addBook = (data)=> async(dispatch) =>{
    dispatch(bookSlice.actions.addBooksRequest());
    await axios.post("http://localhost:4000/api/v1/book/admin/add",data,{
        withCredentials:true,
        headers: {
            "Content-Type":"application/json"
        }
    }).then((res)=>{
        dispatch(bookSlice.actions.addBooksSuccess(res.data.message));
    }).catch((err)=>{
        dispatch(bookSlice.actions.addBooksFailed(err.response.data.message));
    })
}
export const resetBookSlice = ()=>(dispatch)=>{
    dispatch(bookSlice.actions.resetBookSlice())
}
export default bookSlice.reducer;