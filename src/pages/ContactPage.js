// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ContactPage.css';

const API_BASE = 'http://localhost:7001';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name:'', email:'', message:'' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/contact`, formData);
      if (res.status === 201) {
        setSuccess('Thank you! We’ll be in touch soon.');
        setFormData({ name:'', email:'', message:'' });
      } else {
        setError(res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? We'd love to hear from you!</p>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p><strong>Email:</strong> contact@quick-deals.com</p>
          <p><strong>Phone:</strong> (555) 123-4567</p>
          <p><strong>Address:</strong> 123 Green Street, Eco City, EC 12345</p>
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {error   && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name" name="name" type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message" name="message" rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
