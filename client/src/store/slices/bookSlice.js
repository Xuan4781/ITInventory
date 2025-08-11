import { createSlice } from "@reduxjs/toolkit";
import api from "../../../axiosConfig"; // ✅ uses centralized Axios instance
import { toast } from "react-toastify";
import { toggleAddBookPopup } from "./popUpSlice"; // adjust path as needed

const bookSlice = createSlice({
  name: "Device",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    addBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBooksSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBooksFailed(state, action) {
      state.error = action.payload;
      state.message = null;
      state.loading = false;
    },
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const res = await api.get("/book/all"); // ✅ token handled by interceptor
    dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message;
    toast.error(errorMessage);
    dispatch(bookSlice.actions.fetchBooksFailed(errorMessage));
  }
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBooksRequest());
  try {
    const res = await api.post("/book/admin/add", data, {
      headers: {
        "Content-Type": "application/json", // ✅ token still added by interceptor
      },
    });
    dispatch(bookSlice.actions.addBooksSuccess(res.data.message));
    toast.success(res.data.message);
    dispatch(toggleAddBookPopup());
    dispatch(fetchAllBooks());
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message;
    toast.error(errorMessage);
    dispatch(bookSlice.actions.addBooksFailed(errorMessage));
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const res = await api.delete(`/book/delete/${bookId}`);
    toast.success(res.data.message);
    dispatch(fetchAllBooks());
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message;
    toast.error(errorMessage);
    dispatch(bookSlice.actions.fetchBooksFailed(errorMessage));
  }
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;
