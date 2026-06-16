import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
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

export const adminApi = {
  listUsers: (search?: string) => api.get('/admin/users', { params: search ? { search } : {} }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deactivateUser: (id: string) => api.put(`/admin/users/${id}/deactivate`),
  activateUser: (id: string) => api.put(`/admin/users/${id}/activate`),
};

export default api;
