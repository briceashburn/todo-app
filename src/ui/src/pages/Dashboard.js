import React from 'react';
import NavBar from '../components/NavBar';
import '../css/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  return (
    <>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard!</h1>
        <p>This is the dashboard page.</p>
      </div>
    </>
  );
}

export default Dashboard;