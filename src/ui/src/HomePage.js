import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './security/ProtectedRoute';

function HomePage({ setIsAuthenticated }) {
  const API_BASE_URL = 'http://localhost:8080';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    let body = { username, password };
    if (!isLogin && email) {
      body.email = email;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();

      if (response.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
        if (isLogin) {
          setIsAuthenticated(true); // Update authentication status
          navigate('/dashboard'); // Redirect to the dashboard
        }
      } else {
        setMessage(responseText || (isLogin ? 'Invalid credentials' : 'Account creation failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
        </form>
        <button
          className="toggle"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
        >
          {isLogin ? 'Create an account' : 'Back to login'}
        </button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication globally

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}