import React, { useState } from "react";
import "../styles/AdminProfile.css";
import PersonCircle from "../assets/PersonCircle.png";
import PencilSquare from "../assets/pencilsquare.png"; // Edit icon
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import EnvelopeCheck from "../assets/envelopecheck.png"; // Tech Requests icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminProfile = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { phoneNumber: profile?.phoneNumber, username: profile?.username };
      await updateProfile(payload);
      // refetch
      const res = await fetchProfile();
      if (res && res.user) setProfile(res.user);
    } catch (err) {
      console.error('Save profile failed', err);
    } finally {
      setSaving(false);
    }
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
          <span className="profile-role">Admin</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a 
                href="/dashboard-admin" 
                className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/dashboard-admin');
                }}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-technicians" 
                className={`sidebar-link ${activeLink === "/admin-technicians" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-technicians');
                }}
              >
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-profile" 
                className={`sidebar-link ${activeLink === "/admin-profile" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-profile');
                }}
              >
                <img src={GearFill} className="menu-icon" alt="Account Setting" />
                <span>Account Setting</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-tech-requests" 
                className={`sidebar-link ${activeLink === "/admin-tech-requests" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-tech-requests');
                }}
              >
                <img src={EnvelopeCheck} className="menu-icon" alt="Tech Requests" />
                <span>Tech Requests</span>
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
                  <p className="user-name">Kresner Leonardo</p>
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
                    <input type="text" value={profile?.username?.split(' ')[0] || ''} onChange={(e) => setProfile((p) => ({ ...p, username: `${e.target.value} ${p?.username?.split(' ')[1] || ''}` }))} />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.username?.split(' ')[1] || ''} onChange={(e) => setProfile((p) => ({ ...p, username: `${p?.username?.split(' ')[0] || ''} ${e.target.value}` }))} />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>
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
                    <input type="text" value={profile?.phoneNumber || ''} onChange={(e) => setProfile((p) => ({ ...p, phoneNumber: e.target.value }))} />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.address || ''} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Password</h3>
              <div className="form-row password-row">
                <div className="form-group">
                  <div className="input-with-icon">
                    <input type="password" value="........." readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>LOGOUT</button>
                <button className="signup-button" style={{ marginLeft: 12 }} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;

