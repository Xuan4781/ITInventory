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
export const createPeripheralRequest = createAsyncThunk(
  "requests/createPeripheralRequest",
  async ({ deviceId, notes }, thunkAPI) => {
    try {
      const response = await api.post("/requests", { deviceId, notes });
      return response.data.request;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create request"
      );
    }
  }
);
export const deleteRequest = createAsyncThunk(
  "requests/deleteRequest",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/requests/${id}`);
      // Return the updated request (status = Denied) if admin
      return data.request || id; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
      
      .addCase(createPeripheralRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPeripheralRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload); // add the newly created request
      })
      .addCase(createPeripheralRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload;
        // if payload is object (admin denial), update in array
        if (typeof updatedRequest === "object" && updatedRequest._id) {
          const idx = state.requests.findIndex(r => r._id === updatedRequest._id);
          if (idx !== -1) state.requests[idx] = updatedRequest;
        } else {
          // if payload is just ID (user delete), remove
          state.requests = state.requests.filter(r => r._id !== updatedRequest);
        }
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.error = action.payload;
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
