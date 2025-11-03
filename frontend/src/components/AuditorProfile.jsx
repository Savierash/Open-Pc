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

// src/pages/AuditorProfile.jsx (top)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');


const AuditorProfile = () => {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { user: ctxUser, fetchProfile: ctxFetchProfile, updateProfile: ctxUpdateProfile, logout: ctxLogout } = auth;

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Try a list of candidate endpoints to find the correct one on the server.
  // This avoids hard-failing when server mounts routes at /api or /auth.
  const tryEndpoints = async (candidates, token) => {
    for (const url of candidates) {
      try {
        const res = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          validateStatus: (s) => s >= 200 && s < 500, // let us inspect 4xx too
        });
        // Accept 200 responses with user data
        if (res.status >= 200 && res.status < 300) {
          // normalize to { user: ... } or user directly
          const data = res.data;
          if (data && (data.user || data.username || data.email)) {
            return { user: data.user ?? data };
          }
        }
        // If 404/401/403, try next candidate
      } catch (err) {
        // network error: try next candidate
        console.debug('[AuditorProfile] endpoint try failed', url, err?.message || err);
      }
    }
    return null;
  };

  const fetchProfileLocal = async () => {
    // 1) prefer context.fetchProfile if available
    if (typeof ctxFetchProfile === "function") {
      try {
        const res = await ctxFetchProfile();
        if (res?.user) return res;
        if (res && res.username) return { user: res };
      } catch (err) {
        console.warn('ctxFetchProfile failed', err);
      }
    }

    // 2) try candidate API endpoints (common variants)
     const token = localStorage.getItem("token");
    const candidates = [
   `${API_BASE}/users/me`,
   `${API_BASE}/auth/me`,
   `${API_BASE}/users/me/profile`,    // some apps use /profile suffix
   `${API_BASE}/auth/profile`,
   `${API_BASE}/users`,               // fallback: list users
    ];


    const found = await tryEndpoints(candidates, token);
    if (found) return found;

    // 3) try generic /users (then pick current user by token if server returns that)
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        validateStatus: (s) => s >= 200 && s < 500,
      });
      if (res.status >= 200 && res.status < 300) {
        const body = res.data;
        if (Array.isArray(body) && body.length === 1) return { user: body[0] };
        // maybe server returned object containing 'user' or 'users'
        if (body && body.user) return { user: body.user };
        if (body && Array.isArray(body.users)) {
          // try to find user matching token/email in localStorage
          const localUser = (() => {
            try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
          })();
          if (localUser && localUser.email) {
            const match = body.users.find(u => (u.email || '').toLowerCase() === (localUser.email || '').toLowerCase());
            if (match) return { user: match };
          }
          return { user: body.users[0] };
        }
      }
    } catch (err) {
      console.debug('fallback /users failed', err?.message || err);
    }

    // 4) localStorage fallback
    try {
      const raw = localStorage.getItem('user');
      if (raw) return { user: JSON.parse(raw) };
    } catch (e) {
      /* ignore */
    }

    // not found
    throw new Error('Profile endpoint not found — check backend routes (try /api/users/me or /auth/me) and ensure server is running');
  };

  const updateProfileLocal = async (payload) => {
    if (typeof ctxUpdateProfile === "function") {
      try { return await ctxUpdateProfile(payload); } catch (e) { console.warn('ctxUpdateProfile failed', e); }
    }
    const token = localStorage.getItem("token");
    // try likely update endpoints
    const candidates = [
      `${API_BASE}/users/update`,
      `${API_BASE}/api/users/update`,
      `${API_BASE}/users/${payload._id || payload.id || ''}`,
      `${API_BASE}/api/users/${payload._id || payload.id || ''}`
    ].filter(Boolean);

    for (const url of candidates) {
      try {
        const res = await axios.put(url, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          validateStatus: s => s >= 200 && s < 500,
        });
        if (res.status >= 200 && res.status < 300) return res.data;
      } catch (err) {
        console.debug('update candidate failed', url, err?.message || err);
      }
    }
    // final attempt: generic patch
    const res = await axios.patch(`${API_BASE}/users`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  };

  // load
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchProfileLocal();
        if (!mounted) return;
        if (res && res.user) {
          setProfile(res.user);
          try { localStorage.setItem('user', JSON.stringify(res.user)); } catch {}
          return;
        }
        if (ctxUser) setProfile(ctxUser);
      } catch (err) {
        console.error("Failed to load profile", err);
        if (ctxUser) setProfile(ctxUser);
      }
    };
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== LOGOUT ======
  const handleLogout = () => {
    if (typeof ctxLogout === "function") {
      try { ctxLogout(); } catch (err) { console.warn('ctxLogout failed', err); }
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
        try { localStorage.setItem('user', JSON.stringify(res.user)); } catch {}
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Save profile failed", err);
      alert("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

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
          try { localStorage.setItem('user', JSON.stringify(res.data.user)); } catch {}
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

  const displayUser = profile || ctxUser || {};

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
          <img src={displayUser.avatar || PersonCircle} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{displayUser.username || `${displayUser.firstName || ""} ${displayUser.lastName || ""}`.trim() || "User"}</span>
          <span className="profile-role">{localStorage.getItem("userRole") || displayUser.role?.name || displayUser.role || "Role"}</span>
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
                <img src={displayUser.avatar || PersonCircle} alt="User Avatar" />
                <div className="user-info">
                  <p className="user-name">{displayUser.username || `${displayUser.firstName || ""} ${displayUser.lastName || ""}`.trim() || "—"}</p>
                  <p className="user-detail">{displayUser.email || "—"}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{displayUser.address || "—"}</p>
                <p>{displayUser.phoneNumber || displayUser.contactNumber || "—"}</p>
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
                    <input type="text" value={displayUser.firstName || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={displayUser.lastName || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={displayUser.email || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input type="text" value={displayUser.phoneNumber || displayUser.contactNumber || ""} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value={displayUser.address || ""} readOnly />
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
