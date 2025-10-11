import React, { useState } from 'react';
import ComputerLogo from '../assets/LOGO.png';
import LockLogo from '../assets/Lock.png';
import PersonLogo from '../assets/Person.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeLink, setActiveLink] = useState('/');

  const handleNavClick = (path) => {
    setActiveLink(path);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="login">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={ComputerLogo} alt="PC LOGO" className="logo-image" />
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
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </nav>

      {/* Login Form */}
      <main className="main">
        <div className="login-container">
          <h1 className="welcome-title">
            Good to see you again
          </h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
              <img src={PersonLogo} alt="User" className="input-icon" />
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock" className="input-icon" />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <div className="links-container">
            <a href="#" className="link">
              Don't have an account?
            </a>
            <a href="#" className="link">
              Forgot Password?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;