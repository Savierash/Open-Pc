import React, { useState, useEffect } from 'react';
import '../styles/Services.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import ServicesBackground from '../assets/services_background.png';
import UserManagementIcon from '../assets/icon_1.png';
import ComputerStatusIcon from '../assets/icon_2.png';
import InventoryIcon from '../assets/icon_3.png';
import MaintenanceIcon from '../assets/icon_4.png';
import ReportGenerationIcon from '../assets/icon_5.png';
import DashboardOverviewIcon from '../assets/icon_6.png';

const Services = () => {
  const [activeLink, setActiveLink] = useState('/services');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; 
  };

  return (
    <div className="services">
      <header className="top-bar-services">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-services">
            <a 
              href="/" 
              className={`nav-link-services ${activeLink === '/' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`nav-link-services ${activeLink === '/about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>
            <a 
              href="/services" 
              className={`nav-link-services ${activeLink === '/services' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/services');
              }}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>
      <div className="services-hero" style={{ backgroundImage: `url(${ServicesBackground})` }}>
        <div className="services-hero-content">
          <h1 className="services-hero-title">Our Services</h1>
          <p className="services-hero-description">
            At OpenPC One, we provide a smarter and more efficient way to manage computer laboratories.
            Our web-based system is designed to assist auditors, administrators, and IT staff in monitoring,
            maintaining, and organizing computer units all in one centralized platform.
          </p>
          <button className="btn-get-started">Get Started</button>
        </div>
      </div>
      <main className="services-main-content">
        <section className="services-text-section">
          <div className="services-text-block-left">
            <p>
              OpenPC One offers a robust suite of services designed for highly efficient computer laboratory
              monitoring and management, beginning with Centralized Inventory Management to organize, store,
              and update the detailed records of every computer unit, including specifications, location, and assigned
              laboratory. This core system feeds into the Real-Time Status Tracking feature, which allows auditors to
              immediately mark units as either Functional, Under Maintenance, or Out of Order during audits, ensuring
              the operational status is always current and accurate. All this operational data is instantly
              reflected in the Dashboard Overview, which provides a visual summary of the laboratory's condition,
              highlighting total computers, working units, and defective units for quick decision-making.
            </p>
          </div>
          <div className="services-text-block-right">
            <p>
              To maintain transparency and accountability, the system employs Activity Logging, which records
              every operation, the user who updated the status, the timestamp, and the specific reason for the change.
              Furthermore, administrators can utilize the Report Generation service to produce valuable summaries
              regarding computer availability, usage, and maintenance history for administrative reference
              and resource planning. Finally, access to all these powerful features is secured through User
              Authentication, which enforces a role-based access model for auditors, technicians, and administrators.
            </p>
          </div>
        </section>
      </main>
      <section className="service-cards-section">
        <div className="service-card">
          <img src={UserManagementIcon} alt="User Management Icon" className="service-icon" />
          <h3 className="service-card-title">User Management Service</h3>
          <p className="service-card-description">
            Ensure secure access for every user. The system provides role-based login for auditors,
            technicians, and administrators, granting each role specific permissions and functionalities
            to maintain data integrity and accountability.
          </p>
        </div>

        <div className="service-card">
          <img src={ComputerStatusIcon} alt="Computer Status Monitoring Icon" className="service-icon" />
          <h3 className="service-card-title">Computer Status Monitoring Service</h3>
          <p className="service-card-description">
            Provides a centralized and real-time overview of all computer units within
            the laboratory. Through this service, auditors can easily identify the
            operational status of each workstation, whether it is functional,
            under maintenance, or out of order.
          </p>
        </div>

        <div className="service-card">
          <img src={InventoryIcon} alt="Inventory Management Icon" className="service-icon" />
          <h3 className="service-card-title">Inventory Management Service</h3>
          <p className="service-card-description">
            Serves as a digital inventory database, storing essential
            information such as the computer ID, laboratory location, hardware
            specifications, operating system, and current status of each unit.
          </p>
        </div>

        <div className="service-card">
          <img src={MaintenanceIcon} alt="Maintenance Request Icon" className="service-icon" />
          <h3 className="service-card-title">Maintenance Request Service</h3>
          <p className="service-card-description">
            Allows submission of maintenance requests whenever a computer unit
            encounters problems, such as hardware malfunctions, software
            errors, or connectivity issues.
          </p>
        </div>

        <div className="service-card">
          <img src={ReportGenerationIcon} alt="Report Generation Icon" className="service-icon" />
          <h3 className="service-card-title">Report Generation Service</h3>
          <p className="service-card-description">
            This service consolidates all recorded data from monitoring and
            maintenance modules into structured, easy-to-understand reports.
          </p>
        </div>

        <div className="service-card">
          <img src={DashboardOverviewIcon} alt="Dashboard Overview Icon" className="service-icon" />
          <h3 className="service-card-title">Dashboard Overview Service</h3>
          <p className="service-card-description">
            Visual summary of laboratory status such as total computers, working
            units, and defective units.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;