import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

function NavBar({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="top-navbar">
            <div className="navbar-content">
                <div className="brand-section">
                    <div className="brand-logo">📋</div>
                    <span className="brand-name">TaskFlow</span>
                </div>
                <div className="navbar-actions">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="logout-icon">👋</span>
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
