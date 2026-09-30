import api from '../api/axiosInstance';
export interface LoginRequest {
  username: string;
  passwordHash: string; 
}

export interface LoginResponse {
  token: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');