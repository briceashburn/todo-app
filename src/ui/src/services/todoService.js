const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null && token !== undefined && token.trim() !== '';
};

// Common headers for API requests
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle authentication errors
const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    // Clear invalid token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Authentication failed. Please log in again.');
  }
};

// Validate authentication before API calls
const validateAuth = () => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated. Please log in.');
  }
};

export const todoService = {
  // Create a new todo
  createTodo: async (todoData) => {
    try {
      validateAuth();
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        handleAuthError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Get all todos for the current user
  getTodos: async () => {
    try {
      validateAuth();
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        handleAuthError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
    try {
      validateAuth();
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        handleAuthError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    try {
      validateAuth();
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        handleAuthError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
};
