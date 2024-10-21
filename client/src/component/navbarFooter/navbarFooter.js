import React from "react";
import { Link } from "react-router-dom";
import "./navbarFooter.css";
import dwellexLogo from "../../logo/dwellexLogo.png";

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo'>
          <img src={dwellexLogo} alt='Company Logo' />
        </Link>
        <ul className='nav-menu'>
          <li className='nav-item'>
            <Link to='/features' className='nav-link'>
              Features
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/pricing' className='nav-link'>
              Pricing
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/about' className='nav-link'>
              About Us
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/contact' className='nav-link'>
              Contact
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/client' className='client-button'>
              Client
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className='navbar-footer'>
      <div className='footer-container'>
        <div className='footer-logo'>
          <Link to='/'>
            <img src={dwellexLogo} alt='Company Logo' />
          </Link>
        </div>
        <div className='footer-links'>
          <div className='footer-section'>
            <h4>Product</h4>
            <ul>
              <li>
                <Link to='/features'>Features</Link>
              </li>
              <li>
                <Link to='/pricing'>Pricing</Link>
              </li>
              <li>
                <Link to='/demo'>Demo</Link>
              </li>
            </ul>
          </div>
          <div className='footer-section'>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to='/about'>About Us</Link>
              </li>
              <li>
                <Link to='/careers'>Careers</Link>
              </li>
              <li>
                <Link to='/contact'>Contact</Link>
              </li>
            </ul>
          </div>
          <div className='footer-section'>
            <h4>Resources</h4>
            <ul>
              <li>
                <Link to='/blog'>Blog</Link>
              </li>
              <li>
                <Link to='/help'>Help Center</Link>
              </li>
              <li>
                <Link to='/api'>API Documentation</Link>
              </li>
            </ul>
          </div>
          <div className='footer-section'>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to='/privacy'>Privacy Policy</Link>
              </li>
              <li>
                <Link to='/terms'>Terms of Service</Link>
              </li>
              <li>
                <Link to='/cookies'>Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <p>&copy; 2024 Dwellex. All rights reserved.</p>
        <div className='social-links'>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            Facebook
          </a>
          <a href='https://x.com' target='_blank' rel='noopener noreferrer'>
            X
          </a>
          <a
            href='https://linkedin.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
