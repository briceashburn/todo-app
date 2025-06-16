import apiClient from './api';

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined && token.trim() !== '';
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
      const response = await apiClient.post('/api/todos', todoData);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Get all todos for the current user
  getTodos: async () => {
    try {
      validateAuth();
      const response = await apiClient.get('/api/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
    try {
      validateAuth();
      const response = await apiClient.put(`/api/todos/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    try {
      validateAuth();
      const response = await apiClient.delete(`/api/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
};
