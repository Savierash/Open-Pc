import React, { useState } from 'react';
import '../styles/Signup.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeLink, setActiveLink] = useState('/signup');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation here, e.g., if (password !== confirmPassword) return;
    console.log('Signup submitted:', { email, username, password, confirmPassword });
  };

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="signup">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="logo-image" />
          <span className='logo-text'>OpenPC</span>
          <span className="logo-line">|</span>
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
            Login
          </button>
        </div>
      </nav>  

      {/* Main Content */}
      <div className="main-container">
        <h1 className="title-signup">Get started with your account</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <img src={PersonLogo} alt="Email Icon" className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <img src={PersonLogo} alt="Username Icon" className="input-icon" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"  
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <img src={LockLogo} alt="Password Icon" className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <img src={LockLogo} alt="Confirm Password Icon" className="input-icon" />
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>
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