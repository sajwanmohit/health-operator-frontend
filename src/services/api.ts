import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const clusterApi = {
  list: () => api.get('/clusters'),
  getHealth: (clusterId: string) => api.get(`/clusters/${clusterId}/health`),
  getNodes: (clusterId: string) => api.get(`/clusters/${clusterId}/nodes`),
};

export const podApi = {
  list: (namespace?: string, status?: string, page?: number, size?: number) =>
    api.get('/pods', {
      params: { namespace: namespace || undefined, status: status || undefined, page, size },
    }),
  get: (namespace: string, podName: string) => api.get(`/pods/${namespace}/${podName}`),
  getHealth: (namespace: string, podName: string) => api.get(`/pods/${namespace}/${podName}/health`),
  getMetrics: (namespace: string, podName: string, from?: string, to?: string) =>
    api.get(`/pods/${namespace}/${podName}/metrics`, { params: { from, to } }),
};

export const scalingApi = {
  list: (page?: number, size?: number) => api.get('/scaling', { params: { page, size } }),
  getStats: () => api.get('/scaling/stats'),
};

export const incidentApi = {
  list: (namespace?: string) => api.get('/incidents', { params: { namespace } }),
  get: (id: string) => api.get(`/incidents/${id}`),
  getStats: () => api.get('/incidents/stats'),
};

export const healthApi = {
  getClusterOverview: () => api.get('/health/cluster'),
};

export default api;
