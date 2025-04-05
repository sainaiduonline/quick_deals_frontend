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

        // Optional: store token and user info
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(results));

        // Redirect on success
        navigate('/dashboard');
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
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>

        <div className="social-login">
          <p>Or login with</p>
          <div className="social-icons">
            <button type="button" className="social-btn google">Google</button>
            <button type="button" className="social-btn facebook">Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
