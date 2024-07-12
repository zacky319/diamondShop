// diamondSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  diamonds: [],
  status: 'idle',
  error: null,
};

// Define thunks for async operations
export const fetchDiamonds = createAsyncThunk('diamonds/fetchDiamonds', async () => {
  const response = await axios.get('/api/diamonds');
  return response.data;
});

export const addDiamond = createAsyncThunk('diamonds/addDiamond', async (diamondData) => {
  const response = await axios.post('/api/diamonds', diamondData);
  return response.data;
});

export const deleteDiamond = createAsyncThunk('diamonds/deleteDiamond', async (diamondId) => {
  const response = await axios.delete(`/api/diamonds/delete/${diamondId}`);
  return diamondId; // Return the diamondId instead of response.data for delete operation
});

const diamondSlice = createSlice({
  name: 'diamonds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiamonds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiamonds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.diamonds = action.payload;
      })
      .addCase(fetchDiamonds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDiamond.fulfilled, (state, action) => {
        state.diamonds.push(action.payload);
      })
      .addCase(deleteDiamond.fulfilled, (state, action) => {
        state.diamonds = state.diamonds.filter(diamond => diamond._id !== action.payload);
      });
  },
});

export default diamondSlice.reducer;
