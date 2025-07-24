import {createSlice} from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-toastify"




const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        fetchAllUsersRequest(state){
            state.loading = true;
        },
        fetchAllUsersSuccess(state,action){
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed(state){
            state.loading = false;
        },
        AddNewAdminRequest(state){
            state.loading = true;
        },
        AddNewAdminSuccess(state){
            state.loading = false;
        },
        AddNewAdminFailed(state){
            state.loading = false;
        },
    }
})

export const fetchAllUsers = ()=> async(dispatch)=> {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios.get("http://localhost:4000/api/v1/user/all", {withCredentials:true}).then(res => {
        dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users))
    }).catch(err=>{
        dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message))
    })
}


export const AddNewAdmin = (data)=>async(dispatch)=> {
    dispatch(userSlice.actions.AddNewAdminRequest());
    await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, {
        withCredentials:true,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res=>{
        dispatch(userSlice.actions.AddNewAdminSuccess());
        toast.success(res.data.message);
    }).catch(err=>{
        dispatch(userSlice.actions.AddNewAdminFailed());
        toast.error(err.response.data.message)
    })
}

export default userSlice.reducer;