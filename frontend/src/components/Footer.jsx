import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Chandan Kumar Thakur. All rights reserved.</p>
        <p>
          Visit my portfolio: <a href="https://chandankumarthakur.com.np/" target="_blank" rel="noopener noreferrer">chandankumarthakur.com.np</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
