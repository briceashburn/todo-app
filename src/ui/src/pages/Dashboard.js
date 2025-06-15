import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { todoService } from '../services/todoService';
import '../css/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({
    new: [],
    inProgress: [],
    done: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load todos from backend when component mounts
  useEffect(() => {
    const initLoadTodos = async () => {
      try {
        setLoading(true);
        const response = await todoService.getTodos();
        if (response.status === 'success') {
          // Group todos by status
          const groupedTodos = {
            new: [],
            inProgress: [],
            done: []
          };
          
          response.todos.forEach(todo => {
            if (groupedTodos[todo.status]) {
              groupedTodos[todo.status].push({
                id: todo.id,
                text: todo.title
              });
            }
          });
          
          setTodos(groupedTodos);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
        if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initLoadTodos();
  }, [setIsAuthenticated]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const response = await todoService.createTodo({
        title: newTodo,
        status: 'new',
        positionOrder: 0
      });

      if (response.status === 'success') {
        const todo = {
          id: response.todo.id,
          text: response.todo.title,
        };
        
        setTodos(prev => ({
          ...prev,
          new: [...prev.new, todo]
        }));
        setNewTodo('');
        setError(null);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to create todo');
      }
    }
  };

  const handleDragStart = (e, todoId, sourceColumn) => {
    e.dataTransfer.setData('todoId', todoId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const todoId = parseInt(e.dataTransfer.getData('todoId'));
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetColumn) return;

    try {
      // Find the todo in the source column
      const todo = todos[sourceColumn].find(t => t.id === todoId);
      if (!todo) return;

      // Update the todo's status in the backend
      const response = await todoService.updateTodo(todoId, {
        title: todo.text,
        status: targetColumn,
        positionOrder: 0
      });

      if (response.status === 'success') {
        // Update the local state only if backend update succeeds
        setTodos(prev => ({
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter(t => t.id !== todoId),
          [targetColumn]: [...prev[targetColumn], todo]
        }));
        setError(null);
      }
    } catch (error) {
      console.error('Error updating todo status:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to update todo status');
      }
    }
  };

  const deleteTodo = async (id, column) => {
    try {
      const response = await todoService.deleteTodo(id);
      
      if (response.status === 'success') {
        setTodos(prev => ({
          ...prev,
          [column]: prev[column].filter(todo => todo.id !== id)
        }));
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to delete todo');
      }
    }
  };

  const renderColumn = (title, columnKey) => (
    <div 
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, columnKey)}
    >
      <h2>{title}</h2>
      <div className="todo-list">
        {todos[columnKey].map(todo => (
          <div
            key={todo.id}
            className="todo-item"
            draggable
            onDragStart={(e) => handleDragStart(e, todo.id, columnKey)}
          >
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id, columnKey)}
              className="delete-todo-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="dashboard-container">
        <h1>My Kanban Board</h1>
        
        {error && (
          <div className="error-message" style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
            disabled={loading}
          />
          <button type="submit" className="add-todo-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {loading ? (
          <div className="loading-message" style={{
            textAlign: 'center',
            padding: '20px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading todos...
          </div>
        ) : (
          <div className="kanban-board">
            {renderColumn('New', 'new')}
            {renderColumn('In Progress', 'inProgress')}
            {renderColumn('Done', 'done')}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;