import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
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
                    <span className="brand-name">MinimaList</span>
                </div>
                <div className="navbar-actions">
                    <ThemeToggle />
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="logout-icon">👋</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
