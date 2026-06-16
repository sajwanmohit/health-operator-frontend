import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { podApi } from '../../services/api';
import { PodHealth, PodStatusEnum } from '../../types';

interface PodsState {
  pods: PodHealth[];
  selectedPod: PodHealth | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  filters: {
    namespace: string;
    status: string;
  };
}

const initialState: PodsState = {
  pods: [],
  selectedPod: null,
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    namespace: '',
    status: '',
  },
};

function mapBackendPod(raw: Record<string, any>): PodHealth {
  return {
    id: raw.name || raw.id || '',
    podName: raw.name || raw.podName || '',
    namespace: raw.namespace || '',
    clusterId: raw.clusterId || '',
    workloadName: raw.workloadName || '',
    workloadKind: raw.workloadKind || '',
    nodeName: raw.nodeName || '',
    score: {
      value: raw.healthScore ?? raw.score?.value ?? 0,
      cpuScore: raw.score?.cpuScore ?? 0,
      memoryScore: raw.score?.memoryScore ?? 0,
      restartScore: raw.score?.restartScore ?? 0,
      probeScore: raw.score?.probeScore ?? 0,
      errorRateScore: raw.score?.errorRateScore ?? 0,
      latencyScore: raw.score?.latencyScore ?? 0,
      nodeHealthScore: raw.score?.nodeHealthScore ?? 0,
      level: raw.healthLevel ?? raw.score?.level ?? 'UNHEALTHY',
    },
    metrics: {
      cpuUsagePercent: raw.cpuUsage ?? raw.metrics?.cpuUsagePercent ?? 0,
      memoryUsagePercent: raw.memoryUsage ?? raw.metrics?.memoryUsagePercent ?? 0,
      restartCount: raw.restartCount ?? raw.metrics?.restartCount ?? 0,
      readinessProbePassing: raw.ready ?? raw.metrics?.readinessProbePassing ?? false,
      livenessProbePassing: raw.metrics?.livenessProbePassing ?? false,
      errorLogCount: raw.metrics?.errorLogCount ?? 0,
      responseLatencyMs: raw.metrics?.responseLatencyMs ?? 0,
      requestSuccessRate: raw.metrics?.requestSuccessRate ?? 0,
      collectedAt: raw.metrics?.collectedAt ?? '',
    },
    status: raw.status ?? 'UNKNOWN',
    labels: raw.labels ?? {},
    observedAt: raw.observedAt ?? '',
  };
}

export const fetchPods = createAsyncThunk(
  'pods/fetchPods',
  async (params: { namespace?: string; status?: string; page?: number; size?: number }) => {
    const response = await podApi.list(params.namespace, params.status, params.page, params.size);
    return response.data;
  },
);

export const fetchPodHealth = createAsyncThunk(
  'pods/fetchPodHealth',
  async ({ namespace, podName }: { namespace: string; podName: string }) => {
    const response = await podApi.getHealth(namespace, podName);
    return response.data;
  },
);

const podsSlice = createSlice({
  name: 'pods',
  initialState,
  reducers: {
    setSelectedPod(state, action: PayloadAction<PodHealth | null>) {
      state.selectedPod = action.payload;
    },
    setFilters(state, action: PayloadAction<{ namespace?: string; status?: string }>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    updatePodHealth(state, action: PayloadAction<PodHealth>) {
      const index = state.pods.findIndex(p => p.podName === action.payload.podName && p.namespace === action.payload.namespace);
      if (index >= 0) {
        state.pods[index] = action.payload;
      } else {
        state.pods.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPods.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPods.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCount = action.payload.totalElements || action.payload.length || 0;
        const rawList = action.payload.content || action.payload || [];
        state.pods = Array.isArray(rawList) ? rawList.map(mapBackendPod) : [];
      })
      .addCase(fetchPods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pods';
      })
      .addCase(fetchPodHealth.fulfilled, (state, action) => {
        state.selectedPod = action.payload;
      });
  },
});

export const { setSelectedPod, setFilters, updatePodHealth } = podsSlice.actions;
export default podsSlice.reducer;
