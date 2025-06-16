import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create a basic axios instance for auth (no auth token needed)
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await authClient.post('/api/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await authClient.post('/api/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
