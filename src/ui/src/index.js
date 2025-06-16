import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import HomePage from './HomePage';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals(console.log);
