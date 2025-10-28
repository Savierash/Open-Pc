import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import "../styles/TechnicianProfile.css";
import PersonCircle from "../assets/PersonCircle.png";
import Lock from "../assets/Lock.png";
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TechnicianProfile = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const { user, fetchProfile, updateProfile, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile();
        if (res && res.user) setProfile(res.user);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    load();
  }, []);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
            <span className="logo-text">Account Setting</span>
          </div>
        </div>
        <div className="nav-actions">
          <img src={PersonCircle} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">Kresner Leonardo</span>
          <span className="profile-role">Technician</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/dashboard-technician');}}>
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/unit-status-technician');}}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardLogo} className="menu-icon" alt="Reports Icon" /><span>Reports</span></a></li>
            <li>
              <a href="/technician-profile" className={`sidebar-link ${activeLink === "/technician-profile" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}>
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
                  <p className="user-name">{profile?.username || user?.username || '—'}</p>
                  <p className="user-detail">{profile?.email || user?.email || '—'}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{profile?.address || '—'}</p>
                <p>{profile?.phoneNumber || user?.phoneNumber || '—'}</p>
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
                    <input type="text" value={profile?.username?.split(' ')[0] || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.username?.split(' ')[1] || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Email</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={profile?.email || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.phoneNumber || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.address || ''} readOnly />
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

export default TechnicianProfile;
