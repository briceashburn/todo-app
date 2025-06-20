import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import ThemeToggle from './components/ThemeToggle';
import './css/HomePage.css';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './security/ProtectedRoute';

function HomePage({ setIsAuthenticated }) {
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

    let body = { username, password };
    if (!isLogin && email) {
      body.email = email;
    }

    try {
      let data;
      if (isLogin) {
        data = await authService.login(body);
      } else {
        data = await authService.register(body);
      }

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
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response) {
        // Handle validation errors from the server
        const data = error.response.data;
        if (data.message) {
          setMessage(data.message);
        } else if (error.response.status === 400 && data.errors) {
          // Handle detailed validation errors
          const errorMessages = data.errors.map(error => error.defaultMessage).join(', ');
          setMessage(errorMessages);
        } else {
          setMessage(isLogin ? 'Invalid credentials' : 'Account creation failed');
        }
      } else {
        setMessage('Error connecting to server');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="brand-title">MinimaList</h1>
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join MinimaList'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to your workspace' : 'Create your productivity workspace'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
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
              className="auth-input"
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="primary-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="auth-toggle">
          <button
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setUsername('');
              setPassword('');
              setEmail('');
            }}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
        {message && (
          <div className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`}>
            {message}
          </div>
        )}
      </div>
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