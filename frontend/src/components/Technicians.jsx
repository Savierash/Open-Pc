// src/pages/Technicians.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/icon_6.png';
import ToolsLogo from '../assets/tools_logo.png';
import CopyIcon from '../assets/copypaste.png';
import MenuButtonWide from '../assets/menubuttonwide.png';
import ClipboardX from '../assets/clipboardx.png';

const Technicians = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname || '/technicians');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname || '/technicians');
  }, []);

  useEffect(() => {
    loadTechnicians();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tryFetch(url, opts = {}) {
    try {
      const res = await api.get(url, opts);
      if (res && res.data) return res.data;
    } catch (err) {
      // return null so caller will try next option
      return null;
    }
    return null;
  }

  async function loadTechnicians() {
    setLoading(true);
    setError('');
    try {
      // Try a variety of likely endpoint shapes. The first that returns data wins.
      // Order: query param, nested role path, dedicated technicians endpoint, plural users path
      const candidates = [
        { url: '/users', opts: { params: { role: 'technician' } } }, // /users?role=technician
        { url: '/users/role/technician' },                            // /users/role/technician
        { url: '/technicians' },                                      // /technicians
        { url: '/users/technicians' },                                // /users/technicians
        { url: '/users', opts: { params: { role: 'tech' } } },        // /users?role=tech (alternate)
      ];

      let data = null;
      for (const c of candidates) {
        try {
          const res = await api.get(c.url, c.opts);
          if (res && Array.isArray(res.data) && res.data.length >= 0) {
            data = res.data;
            console.info('[Technicians] fetched from', c.url, c.opts ?? '');
            break;
          }
          // some servers wrap results: { users: [...] } or { data: [...] }
          if (res && res.data && Array.isArray(res.data.users)) {
            data = res.data.users;
            console.info('[Technicians] fetched from', c.url, '-> res.data.users');
            break;
          }
          if (res && res.data && Array.isArray(res.data.data)) {
            data = res.data.data;
            console.info('[Technicians] fetched from', c.url, '-> res.data.data');
            break;
          }
        } catch (e) {
          // continue to next candidate
          console.debug('[Technicians] endpoint failed:', c.url, e?.message || e);
        }
      }

      if (!data) {
        // Last-ditch: try calling /users and filter locally for role
        try {
          const resAll = await api.get('/users');
          const all = resAll?.data || [];
          if (Array.isArray(all)) {
            data = all.filter(u => {
              const r = (u.role || u.roleKey || u.roleName || '').toString().toLowerCase();
              if (r.includes('technician') || r.includes('tech')) return true;
              // check roles array shapes
              if (Array.isArray(u.roles)) {
                return u.roles.some(rr => (rr?.toString?.() || '').toLowerCase().includes('tech') || (rr?.key || '').toLowerCase().includes('tech'));
              }
              return false;
            });
            if (data.length) console.info('[Technicians] filtered from /users');
          }
        } catch (err) {
          console.debug('[Technicians] fallback /users failed', err?.message || err);
        }
      }

      if (!data) {
        setTechnicians([]);
        setError('No technicians endpoint found on API (404). Check backend routes.');
      } else {
        setTechnicians(data);
        setSelectedTech(data.length > 0 ? data[0] : null);
      }
    } catch (err) {
      console.error('Failed to load technicians', err);
      setError('Failed to load technicians — check console.');
    } finally {
      setLoading(false);
    }
  }

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Technicians</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{user?.username || 'John Paul'}</span>
          <span className="profile-role">{user?.role?.name || user?.role || 'Auditor'}</span>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={() => setActiveLink('/dashboard')}>
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/inventory" className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`} onClick={() => setActiveLink('/inventory')}>
                <img src={StackLogo} alt="Inventory Icon" className="menu-icon" />
                <span>Inventory</span>
              </Link>
            </li>

            <li>
              <Link to="/unit-status-auditor" className={`sidebar-link ${activeLink === '/unit-status-auditor' ? 'active' : ''}`} onClick={() => setActiveLink('/unit-status-auditor')}>
                <img src={MenuButtonWide} alt="Unit Status Icon" className="menu-icon" />
                <span>Unit Status</span>
              </Link>
            </li>

            <li>
              <Link to="/reports-auditor" className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`} onClick={() => setActiveLink('/reports-auditor')}>
                <img src={ClipboardX} alt="Reports Icon" className="menu-icon" />
                <span>Reports</span>
              </Link>
            </li>

            <li>
              <Link to="/technicians" className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`} onClick={() => setActiveLink('/technicians')}>
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </Link>
            </li>

            <li>
              <Link to="/auditor-profile" className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`} onClick={() => setActiveLink('/auditor-profile')}>
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </Link>
            </li>
          </ul>
        </aside>

        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search A Technician</div>
            <div className="search-input-wrapper">
              <input type="text" placeholder="Search A Technician" className="search-input" />
              <img src={PersonLogo} alt="Search Icon" className="search-icon" />
            </div>
            <h2 className="page-title">Technicians</h2>
          </div>

          <div className="technicians-page-content">
            <div className="technicians-search-panel">
              <div className="technicians-list">
                {loading ? (
                  <div style={{ padding: 12, color: '#ccc' }}>Loading technicians...</div>
                ) : error ? (
                  <div style={{ padding: 12, color: 'salmon' }}>{error}</div>
                ) : technicians.length === 0 ? (
                  <div style={{ padding: 12, color: '#ccc' }}>No technicians found</div>
                ) : (
                  technicians.map((t) => (
                    <div
                      key={t._id}
                      className={`technician-list-item ${selectedTech && selectedTech._id === t._id ? 'selected' : ''}`}
                      onClick={() => setSelectedTech(t)}
                    >
                      <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                      <div className="technician-name-and-id">
                        <span>{t.username || `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email || 'Unnamed'}</span>
                        <span className="technician-id">{String(t._id || '').slice(-5)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="technicians-info-panel">
              <h2>Technician's Information</h2>
              <div className="technician-detail-card">
                <div className="technician-profile-header">
                  <img src={PersonLogo} alt="Profile Icon" className="profile-detail-icon" />
                  <h3>{selectedTech ? (selectedTech.username || `${selectedTech.firstName || ''} ${selectedTech.lastName || ''}`.trim()) : 'Select a technician'}</h3>
                </div>
              </div>

              <label className="detail-label">Full name</label>
              <div className="detail-row-name">
                <input type="text" value={(selectedTech?.firstName) || (selectedTech?.username?.split(' ')[0]) || ''} readOnly className="detail-input" />
                <input type="text" value={(selectedTech?.lastName) || (selectedTech?.username?.split(' ')[1]) || ''} readOnly className="detail-input" />
              </div>

              <label className="detail-label contact-email-label">Contact Information</label>
              <label className="detail-label">Email</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value={selectedTech?.email || ''} readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>

              <label className="detail-label">Contact No.</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value={selectedTech?.phoneNumber || selectedTech?.phone || ''} readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>

              <label className="detail-label">Address</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value={selectedTech?.address || ''} readOnly className="detail-input" />
                </div>
              </div>

              <label className="detail-label">Tech ID:</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value={selectedTech?._id?.slice(-5) || ''} readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Technicians;
