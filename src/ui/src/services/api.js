import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/';
      throw new Error('Authentication failed. Please log in again.');
    }
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

export default apiClient;
