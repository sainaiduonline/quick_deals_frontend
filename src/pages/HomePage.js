import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Reduce Food Waste, Save Money</h1>
        <p>Discover amazing deals on surplus and near-expiration food items from local businesses</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn primary">Sign Up</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>For Consumers</h3>
          <p>Get high-quality food at discounted prices while helping reduce waste</p>
        </div>
        <div className="feature-card">
          <h3>For Businesses</h3>
          <p>Sell surplus inventory and recover costs instead of throwing food away</p>
        </div>
        <div className="feature-card">
          <h3>For The Planet</h3>
          <p>Join our mission to reduce greenhouse gas emissions from food waste</p>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;