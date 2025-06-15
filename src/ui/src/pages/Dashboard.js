import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { todoService } from '../services/todoService';
import '../css/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from backend when component mounts
  useEffect(() => {
    const initLoadTasks = async () => {
      try {
        setLoading(true);
        const response = await todoService.getTodos();
        if (response.status === 'success') {
          // Group tasks by status
          const groupedTasks = {
            todo: [],
            inProgress: [],
            completed: []
          };
          
          response.todos.forEach(todo => {
            let status = todo.status;
            // Map backend status to frontend status
            if (status === 'new') status = 'todo';
            // Backend now uses 'completed' directly
            
            if (groupedTasks[status]) {
              groupedTasks[status].push({
                id: todo.id,
                text: todo.title
              });
            }
          });
          
          setTasks(groupedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
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

    initLoadTasks();
  }, [setIsAuthenticated]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    try {
      const response = await todoService.createTodo({
        title: newTask,
        status: 'new',
        positionOrder: 0
      });

      if (response.status === 'success') {
        const task = {
          id: response.todo.id,
          text: response.todo.title,
        };
        
        setTasks(prev => ({
          ...prev,
          todo: [...prev.todo, task]
        }));
        setNewTask('');
        setError(null);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to create task');
      }
    }
  };

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetColumn) return;

    try {
      // Find the task in the source column
      const task = tasks[sourceColumn].find(t => t.id === taskId);
      if (!task) return;

      // Map frontend status to backend status
      let backendStatus = targetColumn;
      if (targetColumn === 'todo') backendStatus = 'new';
      // Frontend 'completed' maps directly to backend 'completed'

      // Update the task's status in the backend
      const response = await todoService.updateTodo(taskId, {
        title: task.text,
        status: backendStatus,
        positionOrder: 0
      });

      if (response.status === 'success') {
        // Update the local state only if backend update succeeds
        setTasks(prev => ({
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
          [targetColumn]: [...prev[targetColumn], task]
        }));
        setError(null);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to update task status');
      }
    }
  };

  const deleteTask = async (id, column) => {
    try {
      const response = await todoService.deleteTodo(id);
      
      if (response.status === 'success') {
        setTasks(prev => ({
          ...prev,
          [column]: prev[column].filter(task => task.id !== id)
        }));
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('User not authenticated')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        setError('Failed to delete task');
      }
    }
  };

  const renderColumn = (title, columnKey, icon) => (
    <div 
      className={`board-column ${columnKey}-column`}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, columnKey)}
    >
      <div className="column-header">
        <span className="column-icon">{icon}</span>
        <h3 className="column-title">{title}</h3>
        <span className="task-count">{tasks[columnKey].length}</span>
      </div>
      <div className="task-list">
        {tasks[columnKey].map(task => (
          <div
            key={task.id}
            className="task-card"
            draggable
            onDragStart={(e) => handleDragStart(e, task.id, columnKey)}
          >
            <span className="task-text">{task.text}</span>
            <button
              onClick={() => deleteTask(task.id, columnKey)}
              className="delete-task-btn"
              title="Delete task"
            >
              ×
            </button>
          </div>
        ))}
        {tasks[columnKey].length === 0 && (
          <div className="empty-column">
            <p>No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="workspace-container">
        <div className="workspace-header">
          <h1 className="workspace-title">My Workspace</h1>
          <p className="workspace-subtitle">Organize your tasks and boost productivity</p>
        </div>
        
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
        
        <form className="task-form" onSubmit={addTask}>
          <div className="task-input-container">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="task-input"
              disabled={loading}
            />
            <button type="submit" className="add-task-btn" disabled={loading}>
              {loading ? '...' : '+ Add Task'}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your workspace...</p>
          </div>
        ) : (
          <div className="task-board">
            {renderColumn('To Do', 'todo', '📝')}
            {renderColumn('In Progress', 'inProgress', '⚡')}
            {renderColumn('Completed', 'completed', '✅')}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;