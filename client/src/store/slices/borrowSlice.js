import { createSlice } from "@reduxjs/toolkit";
import api from "../../../axiosConfig";
import { toggleRecordBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
    userRole: null, // 👈 Added role tracking
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteBorrowRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteBorrowSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteBorrowFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    setUserRole(state, action) {
      state.userRole = action.payload; // 👈 Store role from backend
    },

    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.userRole = null;
    },
  },
});

// Async Thunks
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const res = await api.get("/borrow/my-borrowed-books");
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksFailed(err.response?.data?.message || err.message)
    );
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const res = await api.get("/borrow/borrowed-books-by-users");
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFailed(err.response?.data?.message || err.message)
    );
  }
};

export const fetchUserRole = () => async (dispatch) => {
  try {
    const res = await api.get("/user/me"); // 👈 Adjust endpoint if needed
    dispatch(borrowSlice.actions.setUserRole(res.data.user.role));
  } catch (err) {
    console.error("Failed to fetch user role:", err);
  }
};

export const recordBorrowBook = (borrowData) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await api.post("/borrow/record-borrow-book", borrowData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    dispatch(toggleRecordBookPopup());
  } catch (err) {
    dispatch(
      borrowSlice.actions.recordBookFailed(err.response?.data?.message || err.message)
    );
  }
};

export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await api.put(
      `/borrow/return-borrowed-book/${id}`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  } catch (err) {
    dispatch(
      borrowSlice.actions.returnBookFailed(err.response?.data?.message || err.message)
    );
  }
};

export const deleteBorrow = (borrowId) => async (dispatch) => {
  dispatch(borrowSlice.actions.deleteBorrowRequest());
  try {
    const res = await api.delete(`/borrow/${borrowId}`);
    dispatch(borrowSlice.actions.deleteBorrowSuccess(res.data.message));
    dispatch(fetchAllBorrowedBooks());
  } catch (err) {
    dispatch(
      borrowSlice.actions.deleteBorrowFail(err.response?.data?.message || "Delete failed")
    );
  }
};

export const updateBorrowBook = (payload) => async (dispatch) => {
  const { id, data } = payload;
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await api.put(`/borrow/update/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    dispatch(fetchAllBorrowedBooks());
  } catch (err) {
    dispatch(
      borrowSlice.actions.recordBookFailed(err.response?.data?.message || "Update failed")
    );
  }
};

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;
