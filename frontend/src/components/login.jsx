import React, { useState } from 'react';
import '../styles/Login.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';
import PersonLogo from '../assets/Person.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeLink, setActiveLink] = useState('/login'); // Updated initial state for login page

  const handleNavClick = (path) => {
    setActiveLink(path);
    // Enable navigation for better UX
    window.location.href = path;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  const handleSignupClick = () => {
    window.location.href = '/signup';
  };

  const handleForgotPasswordClick = () => {
    window.location.href = '/forgot-password'; // Assuming a forgot password route
  };

  return (
    <div className="login">
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
          <button className="btn-signup" onClick={handleSignupClick}>Sign Up</button>
        </div>
      </nav>

      {/* Login Form */}
      <main className="main">
        <h1 className="welcome-title">Good to see you again</h1>
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
              <img src={PersonLogo} alt="User icon" className="input-icon" />
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock icon" className="input-icon" />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <div className="links-container">
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); handleSignupClick(); }}>
              Don't have an account? Sign up
            </a>
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); handleForgotPasswordClick(); }}>
              Forgot Password?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;