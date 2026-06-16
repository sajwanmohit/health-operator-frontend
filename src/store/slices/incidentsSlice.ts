import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { incidentApi } from "../../services/api";
import { Incident } from "../../types";

interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
};

export const fetchIncidents = createAsyncThunk("incidents/fetchAll", async () => {
  const response = await incidentApi.list();
  return response.data as Incident[];
});

export const fetchIncidentStats = createAsyncThunk("incidents/fetchStats", async () => {
  const response = await incidentApi.getStats();
  return response.data;
});

const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    addIncident(state, action) {
      state.incidents.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => { state.loading = true; })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch incidents";
      });
  },
});

export const { addIncident } = incidentsSlice.actions;
export default incidentsSlice.reducer;
