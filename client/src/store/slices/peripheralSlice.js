import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../axiosConfig";

// 🔄 Fetch all peripheral loans
export const fetchAllPeripheralLoans = createAsyncThunk(
  "peripheral/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/peripherals");
      return data.peripherals;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch peripherals");
    }
  }
);

// ➕ Add a new peripheral loan
export const addPeripheralLoan = createAsyncThunk(
  "peripheral/add",
  async (loanData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/peripherals", loanData);
      return data.peripheral;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add peripheral");
    }
  }
);

// ✏️ Update an existing peripheral loan
export const updatePeripheralLoan = createAsyncThunk(
  "peripheral/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/peripherals/${id}`, data);
      return response.data.peripheral;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update peripheral");
    }
  }
);

// 🗑️ Delete a peripheral loan
export const deletePeripheralLoan = createAsyncThunk(
  "peripheral/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/peripherals/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete peripheral");
    }
  }
);

const peripheralSlice = createSlice({
  name: "peripheral",
  initialState: {
    peripherals: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearPeripheralMessage: (state) => {
      state.message = null;
    },
    clearPeripheralError: (state) => {
      state.error = null;
    },
    resetPeripheralSlice: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch all
      .addCase(fetchAllPeripheralLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchAllPeripheralLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.peripherals = action.payload;
      })
      .addCase(fetchAllPeripheralLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add peripheral
      .addCase(addPeripheralLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addPeripheralLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.peripherals.push(action.payload);
        state.message = "Peripheral loan recorded successfully";
      })
      .addCase(addPeripheralLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ Update peripheral
      .addCase(updatePeripheralLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePeripheralLoan.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.peripherals = state.peripherals.map(p =>
          p._id === updated._id ? updated : p
        );
        state.message = "Peripheral updated successfully";
      })
      .addCase(updatePeripheralLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Delete peripheral
      .addCase(deletePeripheralLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePeripheralLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.peripherals = state.peripherals.filter(p => p._id !== action.payload);
        state.message = "Peripheral deleted successfully";
      })
      .addCase(deletePeripheralLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearPeripheralMessage,
  clearPeripheralError,
  resetPeripheralSlice,
} = peripheralSlice.actions;

export default peripheralSlice.reducer;
