import api from './api';
import type { AuthResponse, LoginRequest, SignupRequest, User } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  signup: (data: SignupRequest) =>
    api.post<AuthResponse>('/auth/signup', data),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: (refreshToken?: string) =>
    api.post('/auth/logout', refreshToken ? { refreshToken } : {}),

  me: () =>
    api.get<User>('/auth/me'),
};
