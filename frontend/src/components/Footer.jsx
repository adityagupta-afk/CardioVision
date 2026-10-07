import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="heart-icon">❤️</span> CardioVision
        </div>
        <p className="footer-disclaimer">
          This tool is for educational purposes only. Not a medical diagnostic tool.
        </p>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} CardioVision. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
