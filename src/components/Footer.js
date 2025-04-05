import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Load Font Awesome

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col">
            <h3>Quick-Deals</h3>
            <p>
              Reducing food waste by connecting businesses with surplus food to consumers looking for great deals.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/deals">Current Deals</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Businesses</h4>
            <ul>
              <li><Link to="/business/signup">Business Sign Up</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Quick-Deals. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/accessibility">Accessibility</Link>
            <span>|</span>
            <Link to="/sustainability">Sustainability</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
