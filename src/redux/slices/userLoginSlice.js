import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../services/api';

const API = 'http://localhost:8000/api';

export const loginUser = createAsyncThunk('users/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  }
});

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        // You might want to decode the token to get user info
        // state.user = decodeToken(action.payload.token);
        state.user = action.payload.user; // Assuming your backend returns user info along with the token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userLoginSlice.actions;
export default userLoginSlice.reducer;
