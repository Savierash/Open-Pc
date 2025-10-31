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
import StackLogo from '../assets/Stack.png';
import PersonLogo from '../assets/Person.png';

// Recharts imports for donut chart
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Change this line from the original blue colors
const COLORS = ['#4CAF50', '#388E3C', '#2E7D32', '#1B5E20', '#145214', '#0A290A'];

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

  // Fetch labs
  async function fetchLabs() {
    setLoadingLabs(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      setLabs(res.data || []);
      if (res.data && res.data.length > 0 && !selectedLabId) {
        setSelectedLabId(res.data[0]._id);
      }
    } catch (err) {
      console.error('fetchLabs error:', err);
      alert('Failed to load labs — check console or backend server.');
    } finally {
      setLoadingLabs(false);
    }
  }

  // Fetch units for a selected lab
  async function fetchUnits(labId) {
    setLoadingUnits(true);
    try {
      const res = await axios.get(`${API_BASE}/units`, { params: { labId } });
      setUnits(res.data || []);
    } catch (err) {
      console.error('fetchUnits error:', err);
      alert('Failed to load units — see console.');
    } finally {
      setLoadingUnits(false);
    }
  }

  // Add unit
  async function handleAddUnit() {
    if (!selectedLabId) return alert('Select a lab first');
    const name = window.prompt('Enter unit name (e.g. IT-PC-01):');
    if (!name) return;
    try {
      const res = await axios.post(`${API_BASE}/units`, { name: name.trim(), lab: selectedLabId });
      setUnits(prev => [...prev, res.data]);
      fetchLabs(); // refresh lab counts if server stores them
    } catch (err) {
      console.error('addUnit error:', err?.response ?? err);
      alert(err?.response?.data?.message || 'Failed to add unit');
    }
  }

  // Delete unit
  async function handleDeleteUnit(unitId) {
    const ok = window.confirm('Delete this unit?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/units/${unitId}`);
      setUnits(prev => prev.filter(u => u._id !== unitId));
      fetchLabs();
    } catch (err) {
      console.error('deleteUnit error:', err?.response ?? err);
      alert('Failed to delete unit');
    }
  }

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // Build data for the chart: name + value (unit count)
  const chartData = labs.map(l => ({
    name: l.name,
    value: Number(l.unitCount || 0),
    id: l._id,
  })).filter(d => !Number.isNaN(d.value));

  const totalUnits = chartData.reduce((a, b) => a + b.value, 0);

  // custom tooltip to show percentage
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    const percent = totalUnits > 0 ? ((p.value / totalUnits) * 100).toFixed(1) : '0.0';
    return (
      <div style={{ background: '#111', color: '#fff', padding: 8, borderRadius: 6, fontSize: 13 }}>
        <div style={{ fontWeight: 700 }}>{p.name}</div>
        <div>{p.value} units</div>
        <div style={{ opacity: 0.85 }}>{percent}%</div>
      </div>
    );
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
        </div>
        <div className="nav-actions"><img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" /></div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard" className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard'); }}>
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/inventory" className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/inventory'); }}>
                <img src={StackLogo} className="menu-icon" alt="Inventory" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/total-units" className={`sidebar-link ${activeLink === '/total-units' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/total-units'); }}>
                <img src={PcDisplayLogo} className="menu-icon" alt="Units" />
                <span>Total Units</span>
              </a>
            </li>
            <li>
              <a href="/functional" className={`sidebar-link ${activeLink === '/functional' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/functional'); }}>
                <img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" />
                <span>Functional</span>
              </a>
            </li>
            <li>
              <a href="/maintenance" className={`sidebar-link ${activeLink === '/maintenance' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/maintenance'); }}>
                <img src={GearLogo} alt="Gear Icon" className="menu-icon" />
                <span>Maintenance</span>
              </a>
            </li>
            <li>
              <a href="/out-of-order" className={`sidebar-link ${activeLink === '/out-of-order' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/out-of-order'); }}>
                <img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" />
                <span>Out of Order</span>
              </a>
            </li>
          </ul>
        </aside>

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
                {labs.length === 0 ? <p>No labs data yet.</p> : labs.map((l) => (
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

            {/* TOTAL UNITS (donut chart) - takes remaining space */}
            <div className="horizontal-card" style={{ flex: 1 }}>
              <h3>Total Units</h3>
              {labs.length === 0 ? (
                <p>No labs data yet.</p>
              ) : (
                <div style={{ width: '100%', height: 340, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart aria-label="Total units donut chart">
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}`}
                        labelLine={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center overlay with total */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#fff',
                    pointerEvents: 'none'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>TOTAL</div>
                    <div style={{ fontWeight: 900, fontSize: 26 }}>{totalUnits}</div>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>UNITS</div>
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
