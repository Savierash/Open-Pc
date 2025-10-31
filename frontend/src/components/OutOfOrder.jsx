// src/pages/OutOfOrder.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; 
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const OutOfOrder = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const { user } = useAuth();

  // data
  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [units, setUnits] = useState([]);

  // loading / error
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (selectedLabId) {
      fetchUnits(selectedLabId);
    } else {
      setUnits([]);
    }
  }, [selectedLabId]);
=======
    // fetch labs on mount
    let mounted = true;
    async function fetchLabs() {
      setLoadingLabs(true);
      try {
        const res = await api.get('/lab');
        if (!mounted) return;
        setLabs(res.data || []);
        if (res.data && res.data.length) {
          setSelectedLab(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load labs', err);
      } finally {
        setLoadingLabs(false);
      }
    }
    fetchLabs();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedLab) return;
    let mounted = true;
    async function fetchUnits() {
      setLoadingUnits(true);
      try {
        const res = await api.get(`/units?labId=${selectedLab}`);
        if (!mounted) return;
        setUnits(res.data || []);
      } catch (err) {
        console.error('Failed to load units for lab', selectedLab, err);
        setUnits([]);
      } finally {
        setLoadingUnits(false);
      }
    }
    fetchUnits();
    return () => { mounted = false; };
  }, [selectedLab]);
>>>>>>> ed57e257b106bf09b2250133e25b52d6d62766a0

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  /* ------- API calls ------- */
  async function fetchLabs() {
    setLoadingLabs(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      const data = res.data || [];
      setLabs(data);
      if (data.length > 0 && !selectedLabId) {
        setSelectedLabId(data[0]._id);
      }
    } catch (err) {
      console.error('fetchLabs error', err);
      setError('Failed to load laboratories.');
    } finally {
      setLoadingLabs(false);
    }
  }

  async function fetchUnits(labId) {
    setLoadingUnits(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/units`, { params: { labId } });
      setUnits(res.data || []);
    } catch (err) {
      console.error('fetchUnits error', err);
      setError('Failed to load units.');
      setUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  }

  async function handleAddUnit() {
    if (!selectedLabId) {
      return alert('Please select a laboratory first.');
    }
    const name = window.prompt('Enter unit name (e.g. IT-PC-01):');
    if (!name) return;
    try {
      const res = await axios.post(`${API_BASE}/units`, { name: name.trim(), lab: selectedLabId, status: 'OutOfOrder' });
      // server returns created unit (populated)
      const created = res.data;
      setUnits(prev => [...prev, created]);
      // update labs list counts (optional)
      fetchLabs();
    } catch (err) {
      console.error('add unit error', err);
      alert(err?.response?.data?.message || 'Failed to add unit.');
    }
  }

  async function handleDeleteUnit(unitId) {
    const ok = window.confirm('Delete this unit?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/units/${unitId}`);
      setUnits(prev => prev.filter(u => u._id !== unitId));
      fetchLabs();
    } catch (err) {
      console.error('delete unit error', err);
      alert('Failed to delete unit.');
    }
  }

  /* ------- helpers ------- */
  const labCardClass = (labId) => `lab-card-new ${labId === selectedLabId ? 'active' : ''}`;

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
            <a
              href="/dashboard"
              className={`nav-link-dashboard active`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Dashboard
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard"
                className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/dashboard');
                }}
              >
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/inventory"
                className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/inventory');
                }}
              >
                <img src={StackLogo} alt="Inventory Icon" className="menu-icon" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a
                href="/total-units"
                className={`sidebar-link ${activeLink === '/total-units' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/total-units');
                }}
              >
                <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                <span>Total Units</span>
              </a>
            </li>
            <li>
              <a
                href="/functional"
                className={`sidebar-link ${activeLink === '/functional' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/functional');
                }}
              >
                <img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" />
                <span>Functional</span>
              </a>
            </li>
            <li>
              <a
                href="/maintenance"
                className={`sidebar-link ${activeLink === '/maintenance' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/maintenance');
                }}
              >
                <img src={GearLogo} alt="Gear Icon" className="menu-icon" />
                <span>Maintenance</span>
              </a>
            </li>
            <li>
              <a
                href="/out-of-order"
                className={`sidebar-link ${activeLink === '/out-of-order' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/out-of-order');
                }}
              >
                <img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" />
                <span>Out of Order</span>
              </a>
            </li>
            <li>
              <a
                href="/reports-auditor"
                className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/reports-auditor');
                }}
              >
                <img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a
                href="/technicians"
                className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/technicians');
                }}
              >
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="two-column-layout">
            <div className="labs-container">
              <div className="lab-list">
                {loadingLabs ? (
                  <div style={{ padding: 12, color: '#ddd' }}>Loading labs...</div>
                ) : error ? (
                  <div style={{ padding: 12, color: '#ffb4b4' }}>{error}</div>
                ) : labs.length === 0 ? (
                  <div style={{ padding: 12, color: '#ddd' }}>No labs yet. Add a lab from admin.</div>
                ) : (
                  labs.map(l => (
                    <div
                      key={l._id}
                      className={labCardClass(l._id)}
                      onClick={() => setSelectedLabId(l._id)}
                      title={`Select ${l.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedLabId(l._id); }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{l.name}</span>
                        <small style={{ opacity: 0.8 }}>{l.unitCount ?? 0}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pcs-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <button className="add-unit-button" onClick={handleAddUnit}>Add Unit</button>
                <div style={{ color: '#ccc', fontSize: 13 }}>
                  {selectedLabId ? `Showing units for ${labs.find(x => x._id === selectedLabId)?.name || ''}` : 'Select a lab'}
                </div>
              </div>

              <div className="pc-grid">
                {loadingUnits ? (
                  <div style={{ padding: 12, color: '#ddd' }}>Loading units...</div>
                ) : units.length === 0 ? (
                  <div style={{ padding: 12, color: '#ddd' }}>No units for this lab.</div>
                ) : (
                  units.map(u => (
                    <div key={u._id} className="pc-card" title={u.name}>
                      <img src={PcDisplayLogo} alt="PC Icon" />
                      <span style={{ display: 'block', marginTop: 6 }}>{u.name}</span>

                      {/* small actions (delete) */}
                      <button
                        onClick={() => handleDeleteUnit(u._id)}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          background: 'rgba(0,0,0,0.45)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '2px 6px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                        aria-label={`Delete ${u.name}`}
                      >
                        x
                      </button>
                    </div>
                  ))
                )}

                {/* add card at end for visual parity */}
                <div
                  className="add-pc-card"
                  title="Add unit"
                  onClick={handleAddUnit}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAddUnit(); }}
                  style={{ cursor: 'pointer' }}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OutOfOrder;
