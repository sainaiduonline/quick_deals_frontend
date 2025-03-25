import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Authentication logic would go here (API call, etc.)
    console.log('Login attempt with:', credentials);
    
    // For demo purposes, we'll simulate successful login
    setTimeout(() => {
      navigate('/dashboard'); // Redirect to dashboard after login
    }, 1000);
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