import { createSlice } from "@reduxjs/toolkit";

// Retrieve persisted auth state from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("accessToken");

const initialState = {
  loading: false,
  error: null,
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken,
  loggedOut: false, // ✅ NEW
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set user and token after login
    setUser(state, action) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;

      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    },

    // ✅ Clear user and token on logout
    logout(state) {
  state.user = null;
  state.accessToken = null;
  state.isAuthenticated = false;
  state.loggedOut = true; // ✅ NEW
  state.error = null;
  state.loading = false;
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
},



    // ✅ Set loading state manually
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // ✅ Clear only the user object (optional)
    clearUser(state) {
      state.user = null;
    },

    // ✅ Set error message
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    // ✅ Clear error message
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setUser,
  logout,
  setLoading,
  clearUser,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
