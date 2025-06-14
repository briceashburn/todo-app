import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  }, [setIsAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Client-side validation for username
    if (!isLogin && username.includes(' ')) {
      setMessage('Username cannot contain spaces');
      return;
    }

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

      const data = await response.json();

      if (response.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
        if (isLogin) {
          localStorage.setItem('token', data.token);
          setIsAuthenticated(true);
          navigate('/dashboard');
        } else {
          // After successful registration, switch to login view
          setIsLogin(true);
          setUsername('');
          setPassword('');
          setEmail('');
          setMessage('Account created successfully! Please log in.');
        }
      } else {
        // Handle validation errors from the server
        if (data.message) {
          setMessage(data.message);
        } else if (response.status === 400 && data.errors) {
          // Handle detailed validation errors
          const errorMessages = data.errors.map(error => error.defaultMessage).join(', ');
          setMessage(errorMessages);
        } else {
          setMessage(isLogin ? 'Invalid credentials' : 'Account creation failed');
        }
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
            onChange={(e) => {
              setUsername(e.target.value);
              if (!isLogin && e.target.value.includes(' ')) {
                setMessage('Username cannot contain spaces');
              } else {
                setMessage('');
              }
            }}
            pattern="\S+"
            title="Username cannot contain spaces"
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
            setUsername('');
            setPassword('');
            setEmail('');
          }}
        >
          {isLogin ? 'Create an account' : 'Back to login'}
        </button>
        {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      </header>
    </div>
  );
}

export default function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}