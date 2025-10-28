import React from "react";
import "../styles/AuditorProfile.css";
import PersonCircle from "../assets/PersonCircle.png";
import Lock from "../assets/Lock.png";
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png"; // Added PcDisplayLogo
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AuditorProfile = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // In a real application, you would clear user session/token here
    navigate('/'); // Redirect to homepage
  };

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
            <span className="logo-text">Accout Setting</span>
          </div>
        </div>
        <div className="nav-actions">
          <img src={PersonCircle} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span>
          <span className="profile-role">Auditor</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard" className="sidebar-link">
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/inventory" className="sidebar-link">
                <img src={StackLogo} className="menu-icon" alt="Inventory" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/unit-status-auditor" className="sidebar-link">
                <img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" />
                <span>Unit Status</span>
              </a>
            </li>
            <li>
              <a href="/reports-auditor" className="sidebar-link">
                <img src={ClipboardLogo} className="menu-icon" alt="Reports" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/technicians" className="sidebar-link">
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a href="/auditor-profile" className="sidebar-link active">
                <img src={GearFill} className="menu-icon" alt="Account Setting" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="profile-container">
            <h2>Personal Information</h2>
            <p>Update your profile, contact details, and preferences to personalize your experience</p>

            <div className="profile-card">
              <div className="profile-avatar">
                <img src={PersonCircle} alt="User Avatar" />
                <div className="user-info">
                  <p className="user-name">John Paul</p>
                  <p className="user-detail">Male</p>
                </div>
              </div>
              <div className="contact-info">
                <p>Dagupan USA Chicago</p>
                <p>0918453982</p>
              </div>
              <div className="profile-actions">
                <button className="delete-button">Delete</button>
                <button className="upload-button">Upload new picture</button>
              </div>
            </div>

            <div className="form-section">
              <h3>Full Name</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full name</label>
                  <div className="input-with-icon">
                    <input type="text" value="John" readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value="Paul" readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Email</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value="johnpaul@gmail.com" readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input type="text" value="0918453982" readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value="Dagupan USA Chicago" readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Password</h3>
              <div className="form-row password-row">
                <div className="form-group">
                  <div className="input-with-icon">
                    <input type="password" value="........." readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>LOGOUT</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditorProfile;
