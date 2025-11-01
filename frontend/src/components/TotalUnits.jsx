// src/pages/TotalUnits.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/icon_6.png'; // Inventory icon
import MenuButtonWide from '../assets/menubuttonwide.png'; // Unit Status icon
import ClipboardX from '../assets/clipboardx.png'; // Reports icon
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo
import AccountSettingLogo from '../assets/GearFill.png'; // Account Setting icon

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// centralized api client handles base URL and auth

const TotalUnits = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const navigate = useNavigate();

  // Load labs once on mount
  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch units whenever lab selection changes
  useEffect(() => {
    if (selectedLabId) fetchUnits(selectedLabId);
    else setUnits([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabId]);

  // 📦 Fetch all labs from backend using centralized api
  async function fetchLabs() {
    setLoadingLabs(true);
    try {
      console.log('Fetching labs from api /labs');
      const res = await api.get('/labs');
      setLabs(res.data || []);
      // auto-select first lab
      if (res.data && res.data.length > 0 && !selectedLabId) {
        setSelectedLabId(res.data[0]._id);
      }
    } catch (err) {
      console.error('fetchLabs error:', err);
      window.alert('Failed to load labs — check console or backend server.');
    } finally {
      setLoadingLabs(false);
    }
  }

  // 💻 Fetch units for selected lab via centralized api
  async function fetchUnits(labId) {
    setLoadingUnits(true);
    try {
      console.log('Fetching units for lab:', labId);
      // server may support /labs/:id/units — prefer that if available.
      // try that endpoint first, fallback to /units?labId=...
      let res;
      try {
        res = await api.get(`/labs/${labId}/units`);
      } catch (e) {
        // fallback
        res = await api.get('/units', { params: { labId } });
      }
      setUnits(res.data || []);
    } catch (err) {
      console.error('fetchUnits error:', err);
      window.alert('Failed to load units — see console.');
    } finally {
      setLoadingUnits(false);
    }
  }

  // ➕ Add new unit to selected lab
  async function handleAddUnit() {
    if (!selectedLabId) return window.alert('Select a lab first');
    const name = window.prompt('Enter unit name (e.g. IT-PC-01):');
    if (!name) return;
    try {
      const res = await api.post('/units', { name: name.trim(), lab: selectedLabId });
      // server returns created unit
      if (res?.data) {
        setUnits(prev => [...prev, res.data]);
      }
      // refresh labs to update unitCount if server stores it
      fetchLabs();
    } catch (err) {
      console.error('addUnit error:', err?.response ?? err);
      window.alert(err?.response?.data?.message || 'Failed to add unit');
    }
  }

  // 🗑️ Delete unit
  async function handleDeleteUnit(unitId) {
    const ok = window.confirm('Delete this unit?');
    if (!ok) return;
    try {
      await api.delete(`/units/${unitId}`);
      setUnits(prev => prev.filter(u => u._id !== unitId));
      fetchLabs();
    } catch (err) {
      console.error('deleteUnit error:', err?.response ?? err);
      window.alert('Failed to delete unit');
    }
  }

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const totalUnits = labs.reduce((acc, l) => acc + (Number(l.unitCount) || 0), 0);

  return (
    <div className="dashboard">
      {/* --- HEADER --- */}
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-dashboard">
            <a
              href="/dashboard"
              className="nav-link-dashboard active"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Dashboard
            </a>
          </nav>
          <span className="page-title">Total Units</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
        </div>
      </header>

      {/* --- LAYOUT --- */}
      <div className="main-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard'); }}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/inventory'); }}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className={`sidebar-link ${activeLink === '/unit-status-auditor' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/unit-status-auditor'); }}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/reports-auditor'); }}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technicians" className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/technicians'); }}><img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/auditor-profile'); }}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="page-header-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Total Units</h2>
          </div>

          <div className="new-layout-content" style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
            {/* LAB LIST (narrow) */}
            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Laboratories</h3>
              <div className="lab-filter-grid" style={{ maxHeight: 340 }}>
                {loadingLabs ? (
                  <div>Loading labs...</div>
                ) : (
                  labs.map(l => (
                    <div
                      key={l._id}
                      className={`lab-filter-card ${selectedLabId === l._id ? 'active' : ''}`}
                      onClick={() => setSelectedLabId(l._id)}
                      title="Click to select lab"
                    >
                      {l.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* UNIT COUNTS (narrow) */}
            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Unit Counts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {labs.length === 0 ? <p>No labs data yet.</p> : labs.map(l => (
                  <div key={l._id} className="unit-summary-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={PcDisplayLogo} alt="PC Icon" className="menu-icon" />
                      <span style={{ fontSize: 14 }}>{l.name}</span>
                    </span>
                    <span className="count" style={{ fontWeight: 700 }}>{l.unitCount ?? 0}</span>
                  </div>
                ))}
                <p className="total-units-text" style={{ marginTop: 'auto', fontWeight: 700 }}>
                  Total Units: {totalUnits}
                </p>
              </div>
            </div>

            {/* TOTAL UNITS (chart) - takes remaining space */}
            <div className="horizontal-card" style={{ flex: 1 }}>
              <h3>Total Units</h3>
              {labs.length === 0 ? (
                <p>No labs data yet.</p>
              ) : (
                <div style={{ width: '100%', height: 340, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={labs.map(l => ({ name: l.name, value: l.unitCount || 0 }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}`}
                        labelLine={false}
                      >
                        {labs.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#64d6f0', '#3fb4d6', '#1f91c0', '#1976a5', '#144f73'][index % 5]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center text overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#fff',
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>TOTAL</div>
                    <div style={{ fontWeight: 900, fontSize: 22 }}>{totalUnits}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>UNITS</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TotalUnits;
