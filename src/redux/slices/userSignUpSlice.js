import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export const registerUser = createAsyncThunk('users/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API}/users/register`, { name, email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  }
});

const userSignUpSlice = createSlice({
  name: 'userSignUp',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSignUpSlice.reducer;
