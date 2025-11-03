// src/pages/AdminProfile.jsx
import React, { useState, useEffect } from "react";
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base (Vite env or default)
const API_BASE_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, '');
const API_BASE = API_BASE_ROOT + "/api"; // keep prior convention, adapt to your backend

// local axios instance (so exported functions can reuse)
const api = axios.create({
  baseURL: API_BASE.replace(/\/+$/, ''),
  timeout: 10000,
});
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  return cfg;
}, (err) => Promise.reject(err));

/**
 * fetchAdminProfile(apiClient)
 * - Tries common endpoints to fetch the current admin user.
 * - Returns a normalized profile object or throws an error.
 */
export async function fetchAdminProfile(apiClient = api) {
  // Candidate endpoints to try
  const candidates = [
    '/users/me',
    '/auth/me',
    '/users/profile',
    '/profile',
    '/admin/me',
  ];

  for (const url of candidates) {
    try {
      const res = await apiClient.get(url);
      const payload = res?.data;
      // if backend returns { user: {...} }
      const user = payload?.user ?? payload;
      if (user) {
        // normalize keys
        return {
          _id: user._id || user.id || '',
          username: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '',
          firstName: user.firstName || user.givenName || '',
          lastName: user.lastName || user.familyName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || user.contactNumber || user.phone || '',
          address: user.address || user.location || '',
          gender: user.gender || '',
          avatar: user.avatar || user.avatarUrl || user.image || '',
          role: user.role || user.roles || null,
          raw: user,
        };
      }
    } catch (err) {
      // try next candidate
      // console.debug('fetchAdminProfile candidate failed', url, err?.message || err);
    }
  }

  // As a last resort, try to read localStorage user copy
  try {
    const local = localStorage.getItem('user');
    if (local) {
      const parsed = JSON.parse(local);
      return {
        _id: parsed._id || parsed.id || '',
        username: parsed.username || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.email || '',
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        email: parsed.email || '',
        phoneNumber: parsed.phoneNumber || parsed.contactNumber || parsed.phone || '',
        address: parsed.address || '',
        gender: parsed.gender || '',
        avatar: parsed.avatar || '',
        role: parsed.role || parsed.roles || null,
        raw: parsed,
      };
    }
  } catch (err) {
    /* ignore */
  }

  // nothing found — throw so caller can fallback
  throw new Error('Could not fetch profile from API or localStorage.');
}

/**
 * updateAdminProfile(apiClient, payload)
 * - Tries common update endpoints to modify the current user's profile.
 * - Returns the backend response (normalized user) or throws an error.
 * - payload example: { username, phoneNumber, address, avatar, role }
 */
export async function updateAdminProfile(apiClient = api, payload = {}) {
  if (!payload || typeof payload !== 'object') throw new Error('payload required');

  // candidate update endpoints (PATCH/PUT)
  const patterns = [
    { method: 'patch', url: '/users/me', data: payload },
    { method: 'put', url: '/users/me', data: payload },
    { method: 'patch', url: '/users/update', data: payload },
    { method: 'put', url: '/users/update', data: payload },
    { method: 'patch', url: '/profile', data: payload },
    { method: 'put', url: '/profile', data: payload },
  ];

  let lastErr = null;
  for (const p of patterns) {
    try {
      const res = await apiClient.request({ method: p.method, url: p.url, data: p.data || {} });
      // Accept both direct user object or { user: {} } wrapped
      const data = res?.data;
      const user = data?.user ?? data;
      if (user) return user;
      // if res.status is 204 or 200 without body treat as success
      if (res && (res.status === 204 || (res.status >= 200 && res.status < 300))) return data || { success: true };
    } catch (err) {
      lastErr = err;
      // try next pattern
    }
  }
  // none succeeded
  throw lastErr || new Error('Failed to update profile');
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // states
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
    (async () => {
      try {
        const p = await fetchAdminProfile();
        setProfile(p);
      } catch (err) {
        // fallback data when backend not available
        console.warn('fetchAdminProfile failed, using fallback', err);
        setProfile({
          username: 'kresner',
          firstName: 'Kresner',
          lastName: 'Leonardo',
          phoneNumber: '0918453982',
          address: 'Dagupan USA Chicago',
          gender: 'Male',
          avatar: '',
          role: 'admin',
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        username: profile.username,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        // include other editable fields as needed
      };
      const updated = await updateAdminProfile(api, payload);
      // If backend returned user object, normalize it into our state
      const user = updated?.user ?? updated;
      setProfile(prev => ({ ...prev, ...user }));
      // also update localStorage copy if present
      try { localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user') || '{}')), ...user })); } catch (e) {}
    } catch (err) {
      console.error('Save profile failed', err);
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="dashboard">
        <main className="main-content">
          <p style={{ padding: 20 }}>Loading profile...</p>
        </main>
      </div>
    );
  }

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
          <img src={profile.avatar || PersonCircle} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{localStorage.getItem('username') || 'User'}</span>
          <span className="profile-role">{localStorage.getItem('userRole') || 'Role'}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard-admin"
                className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard-admin'); }}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-technicians"
                className={`sidebar-link ${activeLink === "/admin-technicians" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('/admin-technicians'); }}
              >
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-profile"
                className={`sidebar-link ${activeLink === "/admin-profile" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('/admin-profile'); }}
              >
                <img src={GearFill} className="menu-icon" alt="Account Setting" />
                <span>Account Setting</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-tech-requests"
                className={`sidebar-link ${activeLink === "/admin-tech-requests" ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('/admin-tech-requests'); }}
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
                <img src={profile.avatar || PersonCircle} alt="User Avatar" />
                <div className="user-info">
                  <p className="user-name">{profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.username}</p>
                  <p className="user-detail">{profile.gender || "Male"}</p>
                </div>
              </div>
              <div className="contact-info">
                <p>{profile.address || "Dagupan USA Chicago"}</p>
                <p>{profile.phoneNumber || profile.contactNumber || "0918453982"}</p>
              </div>
              <div className="profile-actions">
                <button className="delete-button" onClick={() => alert('Account deletion not implemented')}>Delete</button>
                <button className="upload-button" onClick={() => alert('Upload not implemented')}>Upload new picture</button>
              </div>
            </div>

            <div className="form-section">
              <h3>Full Name</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile.firstName || profile.username || ''} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile.lastName || ''} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
              </div>

              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" value={profile.email || ''} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile.phoneNumber || profile.contactNumber || ''} readOnly />
                    <img src={PencilSquare} alt="Edit Icon" className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <input type="text" value={profile.address || ''} readOnly />
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
                <button className="logout-button" onClick={handleLogout}>LOGOUT</button>
                <button
                  className="signup-button"
                  style={{ marginLeft: 12 }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {error && <div style={{ color: 'salmon', marginTop: 8 }}>{error}</div>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
