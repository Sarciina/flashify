// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User-related API calls
export const register = async (userData) => {
  const response = await api.post('user/register/', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('user/login/', credentials);
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post('user/logout/', { refresh: refreshToken });
  return response.data;
};

// Flashcard-related API calls
export const getFlashcards = async () => {
  const response = await api.get('flashcards/');
  console.log("this is get flashcard", response.data); // Log the actual response data
  return response.data;
};

export const createFlashcard = async (flashcardData) => {
  const response = await api.post('flashcards/', flashcardData);
  console.log("created flashcard:", response.data); // Log the actual response data
  return response.data;
};

export const updateFlashcard = async (id, flashcardData) => {
  const response = await api.put(`flashcards/${id}/`, flashcardData);
  return response.data;
};

export const deleteFlashcard = async (id) => {
  const response = await api.delete(`flashcards/${id}/`);
  return response.data;
};