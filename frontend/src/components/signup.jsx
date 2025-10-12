import React, { useState } from 'react';
import '../styles/Signup.css';
import ComputerLogo1 from '../assets/LOGO1.png';

const Signup = () => {
  const [email, setEmail] = useState('eg.username23@gmail.com');
  const [username, setUsername] = useState('eg.username23');
  const [password, setPassword] = useState('eg.lovewedding123');
  const [confirmPassword, setConfirmPassword] = useState('eg.lovewedding123');
  const [activeLink, setActiveLink] = useState('/signup'); // Fix 1

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation here, e.g., if (password !== confirmPassword) return;
    console.log('Signup submitted:', { email, username, password, confirmPassword });
  };

  const handleNavClick = (path) => { // Fix 2
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="signup">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="logo-image" />
          <span>OpenPC</span>
        </div>
        <ul className="nav-menu">
          <li>
            <a 
              href="/" 
              className={activeLink === '/' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              className={activeLink === '/about' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="/services" 
              className={activeLink === '/services' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/services');
              }}
            >
              Services
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn-signup" onClick={() => window.location.href = '/login'}>
            Login {/* Fix 3 */}
          </button>
        </div>
      </nav>  

      {/* Main Content */}
      <div className="main-container">
        <h1 className="title">Get started with your account</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              id="email" // Accessibility improvement
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="eg.username23@gmail.com"
            />
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="eg.username23"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="eg.lovewedding123"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="eg.lovewedding123"
            />
          </div>

          {/* Signup Button */}
          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;