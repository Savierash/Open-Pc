// src/pages/TotalUnits.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const TotalUnits = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
  }, []);

  useEffect(() => {
  console.log('selectedLabId changed ->', selectedLabId);
  if (selectedLabId) fetchUnits(selectedLabId);
  else setUnits([]);
}, [selectedLabId]);


  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  async function fetchLabs() {
  setLoadingLabs(true);
  try {
    // <-- FIX: use "labs" (plural), not "lab"
    console.log('TotalUnits: API_BASE =', API_BASE);
    const res = await axios.get(`${API_BASE}/lab`);
    setLabs(res.data || []);
    if (res.data && res.data.length > 0 && !selectedLabId) {
      setSelectedLabId(res.data[0]._id);
    }
  } catch (err) {
    console.error('fetchLabs err - full error:', err);
    console.error('fetchLabs err - response data:', err?.response?.data);
    alert('Failed to load labs (see console).');
  } finally {
    setLoadingLabs(false);
  }
}


  async function fetchUnits(labId) {
  setLoadingUnits(true);
  try {
    const res = await axios.get(`${API_BASE}/units`, { params: { labId } });
    setUnits(res.data || []);
  } catch (err) {
    console.error('fetchUnits err - full error:', err);
    if (err.response) {
      console.error('fetchUnits - status:', err.response.status);
      console.error('fetchUnits - data:', err.response.data);
      alert(`Failed to load units: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      console.error('fetchUnits - no response (request):', err.request);
      alert('No response from server. Is backend running?');
    } else {
      alert('Error fetching units (see console).');
    }
  } finally {
    setLoadingUnits(false);
  }
}


  async function handleAddUnit() {
    if (!selectedLabId) return alert('Select a lab first');
    const name = window.prompt('Enter unit name (e.g. IT-PC-01):');
    if (!name) return;
    try {
      const res = await axios.post(`${API_BASE}/units`, { name: name.trim(), lab: selectedLabId });
      setUnits(prev => [...prev, res.data]);
    } catch (err) {
      console.error('add unit err', err?.response ?? err);
      const msg = err?.response?.data?.message || 'Failed to add unit';
      alert(msg);
    }
  }

  async function handleDeleteUnit(unitId) {
    const ok = window.confirm('Delete this unit?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/units/${unitId}`);
      setUnits(prev => prev.filter(u => u._id !== unitId));
    } catch (err) {
      console.error('delete unit err', err?.response ?? err);
      alert('Failed to delete unit (see console)');
    }
  }

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Total Units</span>
        </div>
        <div className="nav-actions"><img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" /></div>
      </header>

      <div className="main-layout">
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

        <main className="main-content">
          <div className="page-header-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Total Units</h2>
            {/* Removed placeholder div */}
          </div>

          <div className="new-layout-content">
            <div className="horizontal-card">
              <h3>Laboratories</h3>
              <div className="lab-filter-grid">
                {loadingLabs ? <div>Loading labs...</div> : labs.map(l => (
                  <div
                    key={l._id}
                    className={`lab-filter-card ${selectedLabId === l._id ? 'active' : ''}`}
                    onClick={() => setSelectedLabId(l._id)}
                    title="Click to select lab"
                  >
                    {l.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="horizontal-card">
              <h3>Unit Counts</h3>
              {labs.map(l => (
                <div key={l._id} className="unit-summary-item">
                  <span><img src={PcDisplayLogo} alt="PC Icon" className="menu-icon" /> {l.name}</span>
                  <span className="count">{l.unitCount}</span>
                </div>
              ))}
              <p className="total-units-text" style={{ marginTop: 'auto' }}>Total Units: {labs.reduce((acc, l) => acc + (l.unitCount || 0), 0)}</p>
            </div>

            <div className="horizontal-card" style={{ flex: '2' }}>
              <h3>TOTAL UNITS</h3>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TotalUnits;
