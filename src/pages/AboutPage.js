import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="mission-section">
        <h1>Our Mission</h1>
        <p>
          Quick-Deals was founded with a simple goal: to reduce food waste by connecting businesses
          with surplus food to consumers looking for great deals. We believe that good food
          shouldn't go to waste, and everyone should have access to affordable, quality food.
        </p>
      </section>

      <section className="stats-section">
        <h2>The Food Waste Problem</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>1/3</h3>
            <p>of all food produced globally is wasted</p>
          </div>
          <div className="stat-card">
            <h3>8%</h3>
            <p>of greenhouse gas emissions come from food waste</p>
          </div>
          <div className="stat-card">
            <h3>$1T</h3>
            <p>worth of food is wasted annually worldwide</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How Quick-Deals Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-header">
              <div className="step-icon"><i className="fas fa-store"></i></div>
              <h3>1. Businesses List Surplus</h3>
            </div>
            <p>Restaurants and grocery stores list their surplus or near-expiration items on our platform.</p>
          </div>

          <div className="step">
            <div className="step-header">
              <div className="step-icon"><i className="fas fa-shopping-cart"></i></div>
              <h3>2. Consumers Find Deals</h3>
            </div>
            <p>Shoppers browse and purchase discounted food items through our website.</p>
          </div>

          <div className="step">
            <div className="step-header">
              <div className="step-icon"><i className="fas fa-seedling"></i></div>
              <h3>3. Food Gets Saved</h3>
            </div>
            <p>Food that would have been wasted finds a happy home, and everyone benefits.</p>
          </div>
        </div>

      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <p>
          We're a passionate group of environmentalists, technologists, and food lovers
          committed to making a difference in our communities.
        </p>
        {/* Team members would be listed here */}
      </section>
    </div>
  );
};

export default AboutPage;