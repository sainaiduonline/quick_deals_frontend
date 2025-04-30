// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    const storedRole = localStorage.getItem('role');
    setRole(storedRole ? JSON.parse(storedRole) : null);

    if (token && storedRole === 'customer') {
      const user = JSON.parse(localStorage.getItem('user'));
      fetch(`http://localhost:7001/cart/${user.user_id}`)
        .then(res => res.json())
        .then(json => setCartCount(json.data.length || 0))
        .catch(() => setCartCount(0));
    }
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(open => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <span className="logo-icon">🍏</span>
            <span className="logo-text">Quick-Deals</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span/>
          <span/>
          <span/>
        </button>

        {/* Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  {role === 'admin' ? (
                    <NavLink to="/dashboard" onClick={closeMenu}>
                      Dashboard
                    </NavLink>
                  ) : (
                    <NavLink to="/deals" onClick={closeMenu}>
                      Deals
                    </NavLink>
                  )}
                </li>

                {role === 'customer' && (
                  <li className="cart-link">
                    <Link to="/cart" onClick={closeMenu}>
                      Cart
                      {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                      )}
                    </Link>
                  </li>
                )}

                <li className="auth-buttons">
                  <button className="btn logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
                <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
                <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
                <li className="auth-buttons">
                  <Link to="/login" className="btn login-btn" onClick={closeMenu}>Login</Link>
                  <Link to="/register" className="btn register-btn" onClick={closeMenu}>Sign Up</Link>
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
