// materialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  materials: [],
  status: 'idle',
  error: null,
};

// Define async thunk for fetching materials
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/materials/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define async thunk for deleting a material
export const deleteMaterial = createAsyncThunk(
  'materials/deleteMaterial',
  async (materialId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/materials/${materialId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create material slice
const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for fetchMaterials
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Add reducers for deleteMaterial
    builder
      .addCase(deleteMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update materials state after deletion (if needed)
        state.materials = state.materials.filter(material => material._id !== action.payload._id);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const selectAllMaterials = (state) => state.materials.materials;
export const selectMaterialStatus = (state) => state.materials.status;
export const selectMaterialError = (state) => state.materials.error;

export default materialSlice.reducer;
