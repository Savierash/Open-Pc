// src/pages/Maintenance.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; 
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/icon_6.png'; // Inventory icon
import MenuButtonWide from '../assets/menubuttonwide.png'; // Unit Status icon
import ClipboardX from '../assets/clipboardx.png'; // Reports icon
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png';

import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const COLORS = ['#FFF59D', '#FFEB3B', '#FFD54F', '#FFC107', '#FFB300', '#FFA000'];

import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo
import AccountSettingLogo from '../assets/GearFill.png'; // Account Setting icon

const Maintenance = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]); // { _id, name, unitCount, maintenanceCount }
  const [loading, setLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabsWithMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchLabs() {
      setLoadingLabs(true);
      try {
        const res = await api.get('/lab');
        if (!mounted) return;
        setLabs(res.data || []);
        if (res.data && res.data.length) setSelectedLab(res.data[0]._id);
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

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // fetch labs with aggregated maintenance counts
  const fetchLabsWithMaintenance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs/with-maintenance-count`);
      // expecting [{ _id, name, unitCount, maintenanceCount }, ...]
      setLabs(res.data || []);
    } catch (err) {
      console.error('fetchLabsWithMaintenance error', err);
      // keep UI intact: show alert and empty data
      window.alert('Failed to load maintenance data — check console for details.');
      setLabs([]);
    } finally {
      setLoading(false);
    }
  };

  // build chart data and totals from labs (safe defaults)
  const chartData = labs.map(l => ({ name: l.name || 'Unknown', value: Number(l.maintenanceCount || 0) }));
  const totalMaintenance = chartData.reduce((s, d) => s + (d.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    const percent = totalMaintenance ? ((p.value / totalMaintenance) * 100).toFixed(1) : 0;
    return (
      <div style={{ background: '#111', color: '#fff', padding: 8, borderRadius: 6 }}>
        <div style={{ fontWeight: 700 }}>{p.name}</div>
        <div>{p.value} maintenance unit(s)</div>
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
          <span className="page-title">Under Maintenance</span>
        </div>
        <div className="nav-actions">
          <img 
            src={PersonLogo} 
            alt="Profile Icon" 
            className="profile-icon-dashboard"
          />
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
                href="/unit-status-auditor" 
                className={`sidebar-link ${activeLink === '/unit-status-auditor' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/unit-status-auditor');
                }}
              >
                <img src={MenuButtonWide} alt="Unit Status Icon" className="menu-icon" />
                <span>Unit Status</span>
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
                <img src={ClipboardX} alt="Reports Icon" className="menu-icon" />
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
            <li>
              <a 
                href="/auditor-profile" 
                className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/auditor-profile');
                }}
              >
                <img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="page-header-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Maintenance Units</h2>
          </div>

          <div className="new-layout-content" style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Laboratories</h3>
              <div className="lab-filter-grid">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  labs.map(l => (
                    <div key={l._id} className="lab-filter-card">{l.name}</div>
                  ))
                )}
              </div>
            </div>

            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Unit Counts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {labs.length === 0 ? <p>No data</p> : labs.map(l => (
                  <div key={l._id} className="unit-summary-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={PcDisplayLogo} alt="PC Icon" className="menu-icon" />
                      <span style={{ fontSize: 14 }}>{l.name}</span>
                    </span>
                    <span className="count" style={{ fontWeight: 700 }}>{l.maintenanceCount ?? 0}</span>
                  </div>
                ))}
                <p className="total-units-text" style={{ marginTop: 'auto', fontWeight: 700 }}>
                  Total Maintenance: {totalMaintenance}
                </p>
              </div>
            </div>

            <div className="horizontal-card" style={{ flex: 1 }}>
              <h3>TOTAL MAINTENANCE</h3>

              {chartData.length === 0 ? (
                <p style={{ marginTop: 12 }}>No maintenance data available.</p>
              ) : (
                <div style={{ width: '100%', height: 360, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={4}
                        label={({ name, value }) => `${name} ${value}`}
                        labelLine={false}
                      >
                        {chartData.map((entry, idx) => <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} /> 
                    </PieChart>
                  </ResponsiveContainer>

                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#fff'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>MAINTENANCE</div>
                    <div style={{ fontWeight: 900, fontSize: 26 }}>{totalMaintenance}</div>
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

export default Maintenance;
