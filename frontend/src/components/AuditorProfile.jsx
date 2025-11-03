// src/pages/AuditorProfile.jsx
import React, { useState, useEffect } from "react";
import "../styles/AuditorProfile.css";
import PersonCircle from "../assets/PersonCircle.png";
import Lock from "../assets/Lock.png";
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/icon_6.png";
import ToolsLogo from "../assets/tools_logo.png";
import MenuButtonWide from "../assets/menubuttonwide.png";
import ClipboardX from "../assets/clipboardx.png";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuditorProfile = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState({ contactNumber: "", address: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchUserData();
  }, []);

  // ✅ Fetch auditor data (with gender)
  const fetchUserData = async () => {
    try {
      const res = await api.get("/users/me");
      const userData = res.data.user || res.data;

      const formattedGender = userData.gender
        ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
        : "Not specified";

      setUser({
        ...userData,
        gender: formattedGender,
      });

      setEditing({
        contactNumber: userData.contactNumber || "",
        address: userData.address || "",
      });
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // ✅ Update contact or address
  const handleUpdate = async (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }));
    try {
      await api.put("/users/update", { [field]: value });
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  // ✅ Upload profile image
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.post("/users/upload-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.user?.avatar || res.data.imageUrl || res.data.path;
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    } catch (error) {
      console.error("❌ Image upload failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };

  if (!user) return <p>Loading profile...</p>;

  const avatarUrl = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `http://localhost:5000${user.avatar}`
    : PersonCircle;

  const PencilIcon = ({ width = 18, height = 18 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="dashboard">
      {/* === HEADER === */}
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
          <span className="profile-name">{user.username || "Auditor"}</span>
          <span className="profile-role">{user?.role?.name || "Auditor"}</span>
        </div>
      </header>

      {/* === SIDEBAR + MAIN === */}
      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard"
                className={`sidebar-link ${activeLink === "/dashboard" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/inventory"
                className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/inventory");
                }}
              >
                <img src={StackLogo} className="menu-icon" alt="Inventory" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a
                href="/unit-status-auditor"
                className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/unit-status-auditor");
                }}
              >
                <img src={MenuButtonWide} className="menu-icon" alt="Unit Status" />
                <span>Unit Status</span>
              </a>
            </li>
            <li>
              <a
                href="/reports-auditor"
                className={`sidebar-link ${activeLink === "/reports-auditor" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/reports-auditor");
                }}
              >
                <img src={ClipboardX} className="menu-icon" alt="Reports" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a
                href="/technicians"
                className={`sidebar-link ${activeLink === "/technicians" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/technicians");
                }}
              >
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a
                href="/auditor-profile"
                className={`sidebar-link ${activeLink === "/auditor-profile" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auditor-profile");
                }}
              >
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
                  <p className="user-name">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </p>
                  <p className="user-detail">{user.gender || "Gender not set"}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{editing.address || "—"}</p>
                <p>{editing.contactNumber || "—"}</p>
              </div>
              <div className="profile-actions">
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
                    <input type="text" value={user.firstName || ""} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={user.lastName || ""} readOnly />
                    <img src={Lock} alt="Lock Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={user.email || ""} readOnly />
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
                    <span className="input-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                      <PencilIcon width={18} height={18} />
                    </span>
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
