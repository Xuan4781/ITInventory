import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

// Axios instance with token interceptor
const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // your MS token saved here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunk for fetching users
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/user/all");
      return res.data.users;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk for adding a new admin
export const addNewAdmin = createAsyncThunk(
  "user/addNewAdmin",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/user/register-microsoft-admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAddNewAdminPopup());
      return res.data.admin;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetUserState(state) {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addNewAdmin
      .addCase(addNewAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add the new admin to users list:
        if (action.payload) {
          state.users.push(action.payload);
        }
      })
      .addCase(addNewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
