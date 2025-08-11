import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with Bearer token
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunks
export const fetchUserRequests = createAsyncThunk(
  'requests/fetchUserRequests',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/requests/my');
      return response.data.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user requests'
      );
    }
  }
);

export const fetchAllRequests = createAsyncThunk(
  'requests/fetchAllRequests',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/requests');
      return response.data.requests;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all requests'
      );
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.put(
        `/requests/${id}`,
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return {
        request: response.data.request,
        peripheralLoan: response.data.peripheralLoan || null,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update request status'
      );
    }
  }
);

// Slice
const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    peripheralLoansCreated: [], // ✅ track auto-created loans
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchUserRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRequest = action.payload.request;
        const newLoan = action.payload.peripheralLoan;

        const idx = state.requests.findIndex((r) => r._id === updatedRequest._id);
        if (idx !== -1) state.requests[idx] = updatedRequest;

        if (newLoan) {
          state.peripheralLoansCreated.push(newLoan);
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestSlice.reducer;
