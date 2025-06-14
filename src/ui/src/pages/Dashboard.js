import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../css/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({
    new: [],
    inProgress: [],
    done: []
  });

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now(),
      text: newTodo,
    };
    
    setTodos(prev => ({
      ...prev,
      new: [...prev.new, todo]
    }));
    setNewTodo('');
  };

  const handleDragStart = (e, todoId, sourceColumn) => {
    e.dataTransfer.setData('todoId', todoId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const todoId = parseInt(e.dataTransfer.getData('todoId'));
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetColumn) return;

    setTodos(prev => {
      const todo = prev[sourceColumn].find(t => t.id === todoId);
      return {
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter(t => t.id !== todoId),
        [targetColumn]: [...prev[targetColumn], todo]
      };
    });
  };

  const deleteTodo = (id, column) => {
    setTodos(prev => ({
      ...prev,
      [column]: prev[column].filter(todo => todo.id !== id)
    }));
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
        
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-todo-btn">Add Task</button>
        </form>

        <div className="kanban-board">
          {renderColumn('New', 'new')}
          {renderColumn('In Progress', 'inProgress')}
          {renderColumn('Done', 'done')}
        </div>
      </div>
    </>
  );
}

export default Dashboard;