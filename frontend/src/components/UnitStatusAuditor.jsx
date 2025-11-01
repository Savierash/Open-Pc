// src/pages/unit-status/UnitStatusAuditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/UnitStatusAuditor.css';
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/icon_6.png"; // Inventory icon
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon
import PersonLogo from "../assets/Person.png";
import XOctagonFill from "../assets/XOctagonFill.png";
import GraphUp from "../assets/GraphUp.png";
import ShieldLockFill from "../assets/ShieldLockFill.png";
import PcDisplayIcon from "../assets/pcdisplay.png"; // PC card icon

// API base (Vite)
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

const UnitStatusAuditor = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [filter, setFilter] = useState('Functional');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // backend-driven state
  const [labs, setLabs] = useState([]);               // [{ _id, name }]
  const [selectedLab, setSelectedLab] = useState(null); // { _id, name }
  const [units, setUnits] = useState([]);             // [{ _id, name, status, ... }]
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedLab && selectedLab._id) {
      fetchUnits(selectedLab._id);
    } else {
      setUnits([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLab]);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLabSelect = (labName) => {
    const lab = labs.find(l => l.name === labName) || null;
    setSelectedLab(lab);
    setIsDropdownOpen(false);
  };

  // ---------- API ----------
  async function fetchLabs() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      const list = Array.isArray(res.data) ? res.data : [];
      setLabs(list);
      // prefer 'ITS 300' if present
      const prefer = list.find(l => String(l.name).toLowerCase().includes('its 300')) || list[0] || null;
      setSelectedLab(prefer);
    } catch (err) {
      console.error('fetchLabs error', err);
      alert('Failed to load labs. Check backend or console.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUnits(labId) {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/units?labId=${labId}`);
      // backend returns array of units
      const list = Array.isArray(res.data) ? res.data : [];
      // normalize to { id, status } shape for UI compatibility
      setUnits(list.map(u => ({
        _id: u._id,
        id: u.name || u._id,
        status: u.status || 'Functional',
        raw: u
      })));
    } catch (err) {
      console.error('fetchUnits error', err);
      alert('Failed to load units. Check backend or console.');
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }

  // ---------- derived UI ----------
  const unitData = units.length > 0 ? units : []; // fallback to empty if none
  const filteredUnits = unitData.filter(unit =>
    (filter ? unit.status === filter : true) &&
    unit.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
            <span className="logo-text">Unit Status</span>
          </div>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span>
          <span className="profile-role">Auditor</span>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === "/reports-auditor" ? "active" : ""}`}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technicians" className={`sidebar-link ${activeLink === "/technicians" ? "active" : ""}`}><img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className={`sidebar-link ${activeLink === "/auditor-profile" ? "active" : ""}`}><img src={AccountSettingLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content unit-status-auditor-main-content">
          <div className="auditor-main-content-header">
            <div className="auditor-status-filters-and-search">
              <div className="auditor-status-filters">
                <button
                  className={`auditor-status-button ${filter === 'Functional' ? 'auditor-functional-button active' : ''}`}
                  onClick={() => setFilter('Functional')}
                >
                  Functional
                </button>
                <button
                  className={`auditor-status-button ${filter === 'Out Of Order' ? 'auditor-out-of-order-button active' : ''}`}
                  onClick={() => setFilter('Out Of Order')}
                >
                  Out Of Order
                </button>
                <button
                  className={`auditor-status-button ${filter === 'Maintenance' ? 'auditor-maintenance-button active' : ''}`}
                  onClick={() => setFilter('Maintenance')}
                >
                  Maintenance
                </button>
              </div>
              <div className="auditor-search-bar-unit-status">
                <div className="auditor-search-input-wrapper-unit-status">
                  <img src={PersonLogo} alt="Search Icon" className="auditor-search-icon-unit-status" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="auditor-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="change-lab-container">
              <h2 className="auditor-panel-title">{selectedLab ? selectedLab.name : 'Select a lab'}</h2>
              <span className="change-lab-dropdown-toggle" onClick={toggleDropdown}>Change Lab</span>
              {isDropdownOpen && (
                <div className="lab-dropdown-menu">
                  {loading && labs.length === 0 ? (
                    <div style={{ padding: 10 }}>Loading labs...</div>
                  ) : (
                    labs.map(lab => (
                      <div className="lab-dropdown-item" key={lab._id}>
                        <span className="lab-name">{lab.name}</span>
                        <button
                          className="lab-open-button"
                          onClick={() => handleLabSelect(lab.name)}
                        >
                          Open
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="auditor-pc-cards-container">
            <div className="auditor-unit-cards-grid">
              {filteredUnits.length === 0 ? (
                <div className="placeholder" style={{ padding: 16 }}>{loading ? 'Loading units...' : 'No units'}</div>
              ) : (
                filteredUnits.map(unit => (
                  <div className="auditor-pc-card" key={unit._id}>
                    <img src={PcDisplayLogo} alt="PC Icon" className="auditor-pc-card-icon" />
                    <span>{unit.id}</span>
                    <span className={unit.status.toLowerCase().replace(/ /g, '-')}>
                      {unit.status} &#x25cf;
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnitStatusAuditor;
