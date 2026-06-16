import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scalingApi } from '../../services/api';
import { ScalingDecision } from '../../types';

interface ScalingState {
  decisions: ScalingDecision[];
  stats: { totalDecisions: number; scaleUpCount: number; scaleDownCount: number; averageHealthScore: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: ScalingState = {
  decisions: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchScalingDecisions = createAsyncThunk('scaling/fetchDecisions', async () => {
  const response = await scalingApi.list(0, 100);
  return response.data.content || response.data;
});

export const fetchScalingStats = createAsyncThunk('scaling/fetchStats', async () => {
  const response = await scalingApi.getStats();
  return response.data;
});

const scalingSlice = createSlice({
  name: 'scaling',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScalingDecisions.pending, (state) => { state.loading = true; })
      .addCase(fetchScalingDecisions.fulfilled, (state, action) => {
        state.loading = false;
        state.decisions = action.payload;
      })
      .addCase(fetchScalingDecisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch scaling decisions";
      })
      .addCase(fetchScalingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default scalingSlice.reducer;
