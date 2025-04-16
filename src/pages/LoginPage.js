import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7001/quick_deals/authenticate/login', {
        userEmail: credentials.email,
        Password: credentials.password
      });

      if (response.data.status === 200) {
        const { token, results } = response.data;

        // Store token and user info in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user_id', JSON.stringify(results.user_id));
        localStorage.setItem('role', JSON.stringify(results.role));

        // Redirect based on role and user_id
        if (results.role === 'admin' && results.user_id === 1) {
          navigate('/dashboard');
        } else {
          navigate('/deals');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login request failed';
      setError(msg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back</h1>
        <p>Login to access your account and find great deals</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              placeholder="Enter your password" 
            />
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
