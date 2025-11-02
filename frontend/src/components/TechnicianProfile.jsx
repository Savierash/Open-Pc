// src/pages/TechnicianProfile.jsx
import { PencilSquare } from "react-bootstrap-icons";

import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import "../styles/TechnicianProfile.css";
import PersonCircle from "../assets/PersonCircle.png"; // Fallback profile image
import Lock from "../assets/Lock.png";
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const TechnicianProfile = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState({ contactNumber: '', address: '' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const apiBaseUrl = "http://localhost:5000/api";

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditing({
        contactNumber: res.data.contactNumber || '',
        address: res.data.address || '',
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdate = async (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value }));
    try {
      await axios.put(`${apiBaseUrl}/users/update`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await axios.post(
        `${apiBaseUrl}/users/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(prev => ({ ...prev, avatar: res.data.imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  if (!user) return <p>Loading profile...</p>;
  const avatarUrl = user.avatar ? `${apiBaseUrl.replace("/api", "")}${user.avatar}` : PersonCircle;

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
          <img src={avatarUrl} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{user.username || "Technician"}</span>
          <span className="profile-role">{user?.role?.name || "Role"}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();navigate('/dashboard-technician');}}>
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();navigate('/unit-status-technician');}}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();navigate('/reports-tech');}}><img src={ClipboardLogo} className="menu-icon" alt="Reports Icon" /><span>Reports</span></a></li>
            <li>
              <a href="/technician-profile" className={`sidebar-link ${activeLink === "/technician-profile" ? "active" : ""}`} onClick={(e) => {e.preventDefault();navigate('/technician-profile');}}>
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
                <img src={avatarUrl} alt="User Avatar" />
                <div className="user-info">
                  <p className="user-name">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</p>
                  <p className="user-detail">{user.gender || "Gender not set"}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{editing.address || "—"}</p>
                <p>{editing.contactNumber || "—"}</p>
              </div>
              <div className="profile-actions">
                <button className="delete-button" onClick={() => alert('Account deletion not yet implemented')}>Delete</button>
                <label htmlFor="upload-input" className="upload-button">Upload new picture</label>
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileImageUpload}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Full Name</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={user.firstName || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={user.lastName || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tech ID</label>
                  <div className="input-with-icon">
                    <input type="text" value={user.techId || "—"} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={user.email || ''} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={editing.contactNumber}
                      onChange={(e) => handleUpdate("contactNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={editing.address}
                      onChange={(e) => handleUpdate("address", e.target.value)}
                    />
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechnicianProfile;
