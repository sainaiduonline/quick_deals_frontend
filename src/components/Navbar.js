import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Re-run effect on location changes to update login status and role
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    const storedRole = localStorage.getItem('role');
    setRole(storedRole ? JSON.parse(storedRole) : null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🍏</span>
            <span className="logo-text">Quick-Deals</span>
          </Link>
        </div>

        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  {role === 'admin' ? (
                    <NavLink to="/dashboard" onClick={toggleMenu}>
                      Dashboard
                    </NavLink>
                  ) : (
                    <NavLink to="/deals" onClick={toggleMenu}>
                      Deals
                    </NavLink>
                  )}
                </li>
                <li className="auth-buttons">
                  <button className="btn logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/" onClick={toggleMenu}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={toggleMenu}>
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" onClick={toggleMenu}>
                    Contact
                  </NavLink>
                </li>
                <li className="auth-buttons">
                  <Link to="/login" className="btn login-btn" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn register-btn" onClick={toggleMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
