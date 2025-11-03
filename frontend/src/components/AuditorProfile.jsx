// src/pages/AuditorProfile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import "../styles/AuditorProfile.css";
import PersonCircle from "../assets/PersonCircle.png";
import PencilSquare from "../assets/pencilsquare.png"; // Edit icon
import GearFill from "../assets/GearFill.png";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/icon_6.png"; // Inventory icon
import ToolsLogo from "../assets/tools_logo.png";
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuditorProfile = () => {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user: ctxUser, fetchProfile: ctxFetchProfile, updateProfile: ctxUpdateProfile, logout: ctxLogout } = auth;

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ====== HELPER FUNCTIONS ======
  const fetchProfileLocal = async () => {
    if (typeof ctxFetchProfile === "function") {
      try {
        const res = await ctxFetchProfile();
        if (res?.user) return res;
      } catch {}
    }

    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { user: res.data?.user ?? res.data };
  };

  const updateProfileLocal = async (payload) => {
    if (typeof ctxUpdateProfile === "function") {
      return ctxUpdateProfile(payload);
    }
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_BASE}/users/update`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  };

  // ====== LOAD PROFILE ======
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfileLocal();
        if (res && res.user) {
          setProfile(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        } else if (ctxUser) {
          setProfile(ctxUser);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        if (ctxUser) setProfile(ctxUser);
      }
    };
    load();
  }, []);

  // ====== LOGOUT ======
  const handleLogout = () => {
    if (typeof ctxLogout === "function") {
      ctxLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/");
  };

  // ====== SAVE PROFILE ======
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        username: profile?.username,
        phoneNumber: profile?.phoneNumber,
        address: profile?.address,
      };
      await updateProfileLocal(payload);
      const res = await fetchProfileLocal();
      if (res && res.user) {
        setProfile(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Save profile failed", err);
      alert("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ====== UPLOAD NEW PICTURE ======
  const handleUploadPicture = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${API_BASE}/users/upload-avatar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (res.data?.user) {
          setProfile(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          alert("✅ Profile picture updated!");
        } else {
          alert("✅ Picture uploaded!");
        }
      } catch (err) {
        console.error("Upload picture failed", err);
        alert("❌ Failed to upload picture");
      } finally {
        setUploading(false);
      }
    };
  };

  // ====== DELETE ACCOUNT ======
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/users/delete`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      alert("🗑️ Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Delete account failed", err);
      alert("❌ Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  // ====== RENDER ======
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
          <span className="profile-name">{profile?.username || "User"}</span>
          <span className="profile-role">{localStorage.getItem("userRole") || "Role"}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className="sidebar-link"><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className="sidebar-link"><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className="sidebar-link"><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className="sidebar-link"><img src={ClipboardX} className="menu-icon" alt="Reports" /><span>Reports</span></a></li>
            <li><a href="/technicians" className="sidebar-link"><img src={ToolsLogo} className="menu-icon" alt="Technicians" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className="sidebar-link active"><img src={GearFill} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="profile-container">
            <h2>Personal Information</h2>
            <p>Update your profile, contact details, and preferences to personalize your experience</p>

            <div className="profile-card">
              <div className="profile-avatar">
                <img src={profile?.avatarUrl || PersonCircle} alt="User Avatar" />
                <div className="user-info">
                  <p className="user-name">{profile?.username || "—"}</p>
                  <p className="user-detail">{profile?.email || "—"}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{profile?.address || "—"}</p>
                <p>{profile?.phoneNumber || "—"}</p>
              </div>
              <div className="profile-actions">
                <button className="delete-button" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </button>
                <button className="upload-button" onClick={handleUploadPicture} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload new picture"}
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>Full Name</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.firstName || "John"} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.lastName || "Paul"} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={profile?.email || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.phoneNumber || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile?.address || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
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
                <button className="logout-button" onClick={handleLogout}>
                  LOGOUT
                </button>
                <button
                  className="signup-button"
                  style={{ marginLeft: 12 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditorProfile;
