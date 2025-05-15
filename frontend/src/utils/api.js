import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Adjust if your backend URL/port differs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register a new user
export const register = async (userData) => {
  const response = await api.post('user/register/', userData);
  return response.data;
};

// Login a user
export const login = async (credentials) => {
  const response = await api.post('user/login/', credentials);
  return response.data;
};

// Logout a user
export const logout = async (refreshToken) => {
  const response = await api.post('user/logout/', { refresh: refreshToken });
  return response.data;
};