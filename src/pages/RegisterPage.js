import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'consumer'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = 'Name is required';
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Map data to match API field names
    const payload = {
      userName: userData.name.split(' ').join('_').toLowerCase(),
      firstName: userData.name.split(' ')[0],
      lastName: userData.name.split(' ')[1] || '',
      email: userData.email,
      password: userData.password,
      mobileNo: '9999999999', // optional hardcoded or another input
      address: 'Unknown',     // optional hardcoded or another input
      role: userData.userType === 'business' ? 'retailer' : 'customer'
    };

    try {
      const response = await axios.post('http://localhost:7001/quick_deals/authenticate/register', payload);
      console.log(response.data);

      if (response.status === 201) {
        alert('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Registration failed";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create Your Account</h1>
        <p>Join Quick-Deals to start saving money and reducing food waste</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} className={errors.name ? 'error' : ''} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'error' : ''} />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label>I am a:</label>
            <div className="user-type-options">
              <label>
                <input type="radio" name="userType" value="consumer" checked={userData.userType === 'consumer'} onChange={handleChange} />
                Consumer
              </label>
              <label>
                <input type="radio" name="userType" value="business" checked={userData.userType === 'business'} onChange={handleChange} />
                Business
              </label>
            </div>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></label>
          </div>

          <button type="submit" className="register-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
