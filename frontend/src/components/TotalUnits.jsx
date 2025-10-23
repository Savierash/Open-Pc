// src/pages/TotalUnits.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo

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


  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
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
          <nav className="nav-links-dashboard">
            <a href="/" className={`nav-link-dashboard ${activeLink === '/' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>Home</a>
            <a href="/about" className={`nav-link-dashboard ${activeLink === '/about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}>About</a>
            <a href="/services" className={`nav-link-dashboard ${activeLink === '/services' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/services'); }}>Services</a>
            <a href="/dashboard" className="nav-link-dashboard active" onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard'); }}>Dashboard</a>
          </nav>
        </div>
        <div className="nav-actions"><img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" /></div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard'); }}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/inventory'); }}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/total-units" className={`sidebar-link ${activeLink === '/total-units' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/total-units'); }}><img src={PcDisplayLogo} className="menu-icon" alt="Units" /><span>Total Units</span></a></li>
            <li><a href="/functional" className={`sidebar-link ${activeLink === '/functional' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/functional');}}><img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" /><span>Functional</span></a></li>
            <li><a href="/maintenance" className={`sidebar-link ${activeLink === '/maintenance' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/maintenance');}}><img src={GearLogo} alt="Gear Icon" className="menu-icon" /><span>Maintenance</span></a></li>
            <li><a href="/out-of-order" className={`sidebar-link ${activeLink === '/out-of-order' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/out-of-order');}}><img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" /><span>Out of Order</span></a></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="two-column-layout">
            <div className="labs-container">
              <div className="lab-list">
                {loadingLabs ? <div>Loading labs...</div> : labs.map(l => (
                  <div
                    key={l._id}
                    className={`lab-card-new ${selectedLabId === l._id ? 'active' : ''}`}
                    onClick={() => setSelectedLabId(l._id)}
                    title="Click to select lab"
                  >
                    {l.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="pcs-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <button className="add-unit-button" onClick={handleAddUnit} disabled={!selectedLabId}>Add Unit</button>
                <div>{loadingUnits ? 'Loading units...' : `${units.length} units`}</div>
              </div>

              <div className="pc-grid">
                {units.map(u => (
                  <div key={u._id} className="pc-card" style={{ position: 'relative' }}>
                    <img src={PcDisplayLogo} alt="PC Icon" />
                    <span>{u.name}</span>
                    <button onClick={() => handleDeleteUnit(u._id)} style={{ position: 'absolute', top: 6, right: 6 }}>✕</button>
                  </div>
                ))}

                {!units.length && <div style={{ padding: 12, color: '#666' }}>No units for this lab yet.</div>}
                <div className="add-pc-card" onClick={handleAddUnit}>+</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TotalUnits;
