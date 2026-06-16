import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clusterApi } from '../../services/api';
import { ClusterHealth } from '../../types';

interface ClusterState {
  overview: ClusterHealth | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClusterState = {
  overview: null,
  loading: false,
  error: null,
};

export const fetchClusterHealth = createAsyncThunk('cluster/fetchHealth', async () => {
  const response = await clusterApi.getHealth('default');
  return {
    totalPods: response.data.totalPods || 0,
    healthyPods: response.data.healthyPods || 0,
    unhealthyPods: response.data.unhealthyPods || 0,
    scalingEvents: response.data.scalingEvents || 0,
    activeAlerts: response.data.activeAlerts || 0,
  } as ClusterHealth;
});

const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClusterHealth.pending, (state) => { state.loading = true; })
      .addCase(fetchClusterHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchClusterHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cluster health';
      });
  },
});

export default clusterSlice.reducer;
