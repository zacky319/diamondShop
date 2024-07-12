
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
  shells: [], // Initial state as an empty array
  status: 'idle', // Initial status
  error: null, // Initial error state
};
export const fetchShells = createAsyncThunk('shells/fetchShells', async () => {
    try {
      const response = await axios.get('/api/shells'); // Adjust URL as per your API
      return response.data; // Assuming response.data is an array of shells
    } catch (error) {
      throw new Error('Failed to fetch shells'); // Handle error appropriately
    }
  });

  // Async Thunk Action Creator for deleting a shell
export const deleteShell = (shellId) => async (dispatch) => {
    dispatch(deleteShellStart());
    try {
      const response = await axios.delete(`http://localhost:8000/api/shells/${shellId}`);
      dispatch(deleteShellSuccess(response.data));
      // Optionally dispatch fetchShells() to update the list after deletion
      dispatch(fetchShells());
      message.success('Shell deleted successfully');
    } catch (error) {
      dispatch(deleteShellFailure(error.message));
      message.error('Failed to delete shell');
    }
  };
  const shellSlice = createSlice({
    name: 'shells',
    initialState: {
      shells: [],
      status: 'idle',
      error: null,
    },
    reducers: {
      // Reducers here
    },
    extraReducers: builder => {
      builder
        .addCase(fetchShells.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchShells.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.shells = action.payload;
        })
        .addCase(fetchShells.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
export default shellSlice.reducer;
