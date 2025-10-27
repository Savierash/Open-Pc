import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';
import ComputerLogo from '../assets/LOGO.png';
import ComputerLogo1 from '../assets/LOGO1.png';
import SideDesign from '../assets/side_design.png';
import MissionLogo from '../assets/mission_logo.png';
import VisionLogo from '../assets/vision_logo.png';
import ValueLogo from '../assets/value_logo.png';

function About() {
  const [activeLink, setActiveLink] = useState('/about');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  return (
    <div className="about">
      <header className="top-bar-about">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-about">
            <a 
              href="/" 
              className={`nav-link-about ${activeLink === '/' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`nav-link-about ${activeLink === '/about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>
            <a 
              href="/services" 
              className={`nav-link-about ${activeLink === '/services' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/services');
              }}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-signup" onClick={() => navigate('/role')}>Sign Up</button>
        </div>
      </header>
      <main className="main-container-about">
        <section className="hero-section-about">
          <div className="hero-content-about">
            <img src={SideDesign} alt="OpenPC Dashboard" className="hero-image-about" />
            <div className="hero-text-about">
              <h1 className="hero-title-about">OpenPC</h1>
              <p className="hero-description-about">
                A web-based computer monitoring and management system designed to assist computer laboratory
                auditors in efficiently tracking and maintaining computer units. Our platform provides a
                smarter, faster, and more reliable way to monitor the operational status of each computer
                within a lab environment. We aim to eliminate manual record keeping and provide real-time
                visibility of computer conditions whether a unit is functional, requires maintenance, or is out of order.
              </p>
            </div>
          </div>
        </section>
        <section className="what-we-do-section-about">
          <h2 className="what-we-do-title-about">What we do</h2>
          <p className="what-we-do-description-about">
            OpenPC One solves the challenges of manual, fragmented computer monitoring with a centralized platform
            for recording, updating, and reporting computer conditions.
          </p>
        </section>
        <section className="mission-vision-values-section-about">
          <div className="card-about mission">
            <img src={MissionLogo} alt="Mission Logo" className="card-icon-about" />
            <h2 className="card-title-about">Mission</h2>
            <p className="card-description-about">
              Our mission is to revolutionize computer laboratory management by providing an intelligent,
              user-friendly, and fully integrated system designed to optimize every aspect of operations.
              Through advanced monitoring capabilities, real-time status reporting, and automated maintenance
              tracking, we aim to enhance accuracy, minimize downtime, and ensure timely issue resolution.
            </p>
          </div>
          <div className="card-about vision">
            <img src={VisionLogo} alt="Vision Logo" className="card-icon-about" />
            <h2 className="card-title-about">Vision</h2>
            <p className="card-description-about">
              We envision a future where every computer laboratory operates seamlessly through the
              integration of intelligent automation, real-time monitoring, and comprehensive digital
              management systems. This tool will not only enhance operational efficiency and minimize
              downtime but also promote transparency, accountability, and informed decision-making.
            </p>
          </div>
          <div className="card-about values">
            <img src={ValueLogo} alt="Values Logo" className="card-icon-about" />
            <h2 className="card-title-about">Values</h2>
            <p className="card-description-about">
              Innovation: We strive to develop creative, driven technology solutions.
            </p>
            <p className="card-description-about">
              Efficiency: We value accuracy, speed, and simplicity in every function.
            </p>
            <p className="card-description-about">
              Integrity: We ensure secure and transparent data handling.
            </p>
            <p className="card-description-about">
              Collaboration: We believe great solutions come from teamwork and shared goals.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;