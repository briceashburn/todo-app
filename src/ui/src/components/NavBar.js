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
        <nav className="navbar">
            <div className="navbar-brand">ToDoApp</div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default NavBar;
