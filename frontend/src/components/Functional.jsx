// src/pages/Functional.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // centralized API client
import { useAuth } from '../context/AuthContext'; // import your auth hook
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
import ToolsLogo from '../assets/tools_logo.png';
import AccountSettingLogo from '../assets/GearFill.png'; // Account Setting icon

// Recharts (donut)
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#64d6f0', '#3fb4d6', '#1f91c0', '#1976a5', '#144f73', '#0f3f55', '#2a9d8f'];

const Functional = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  const [labs, setLabs] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [functionalUnits, setFunctionalUnits] = useState([]); // all functional units
  const [unitsForLab, setUnitsForLab] = useState([]); // units displayed for selected lab
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  // useAuth may provide user info; guard in case context isn't wired
  let user = null;
  try {
    const auth = useAuth?.();
    user = auth?.user ?? null;
  } catch (e) {
    // If useAuth isn't available at runtime, continue without user
    user = null;
  }

  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    fetchFunctionalUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedLabId) {
      const filtered = functionalUnits.filter(u => {
        if (!u.lab) return false;
        if (typeof u.lab === 'object') return String(u.lab._id || u.lab.id) === String(selectedLabId);
        return String(u.lab) === String(selectedLabId);
      });
      setUnitsForLab(filtered);
    } else {
      setUnitsForLab([]);
    }
  }, [selectedLabId, functionalUnits]);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // Fetch labs using centralized api client
  async function fetchLabs() {
    setLoadingLabs(true);
    try {
      const res = await api.get('/labs');
      const labsData = res.data || [];
      setLabs(labsData);
      if (labsData.length > 0 && !selectedLabId) {
        setSelectedLabId(labsData[0]._id);
      }
    } catch (err) {
      console.error('fetchLabs error', err);
      window.alert('Failed to load labs — check console / backend.');
    } finally {
      setLoadingLabs(false);
    }
  }

  // Fetch all functional units (server should support status param)
  async function fetchFunctionalUnits() {
    setLoadingUnits(true);
    try {
      const res = await api.get('/units', { params: { status: 'Functional' } });
      const units = res.data || [];
      setFunctionalUnits(units);

      // ensure a lab is selected if not set
      if (!selectedLabId && labs.length > 0) {
        setSelectedLabId(labs[0]._id);
      }
    } catch (err) {
      console.error('fetchFunctionalUnits error', err);
      setFunctionalUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  }

  // Add a functional unit (client flow)
  async function handleAddUnit() {
    if (!selectedLabId) return window.alert('Select a lab first');
    const name = window.prompt('Enter unit name (e.g. IT-PC-01):');
    if (!name) return;
    try {
      const payload = { name: name.trim(), lab: selectedLabId, status: 'Functional' };
      const res = await api.post('/units', payload);
      if (res.data) {
        setFunctionalUnits(prev => [...prev, res.data]);
        // if added in current selectedLab, update unitsForLab too
        if (String(res.data.lab) === String(selectedLabId) || (res.data.lab && res.data.lab._id && String(res.data.lab._id) === String(selectedLabId))) {
          setUnitsForLab(prev => [...prev, res.data]);
        }
      }
      // optionally refresh labs counts
      fetchLabs();
    } catch (err) {
      console.error('add unit error', err);
      window.alert(err?.response?.data?.message || 'Failed to add unit');
    }
  }

  // Delete a unit
  async function handleDeleteUnit(unitId) {
    const ok = window.confirm('Delete this unit?');
    if (!ok) return;
    try {
      await api.delete(`/units/${unitId}`);
      setFunctionalUnits(prev => prev.filter(u => u._id !== unitId));
      setUnitsForLab(prev => prev.filter(u => u._id !== unitId));
      fetchLabs();
    } catch (err) {
      console.error('delete unit error', err);
      window.alert('Failed to delete unit — see console.');
    }
  }

  // Build chart data: counts per lab
  const countsByLab = labs.reduce((acc, lab) => {
    acc[lab._id] = 0;
    return acc;
  }, {});

  functionalUnits.forEach(u => {
    const labId = u.lab && (typeof u.lab === 'object' ? (u.lab._id || u.lab.id) : u.lab);
    if (labId) countsByLab[labId] = (countsByLab[labId] || 0) + 1;
  });

  // Chart and total
  const chartData = labs.map((l) => ({
    id: l._id,
    name: l.name,
    value: countsByLab[l._id] || 0
  })).filter(d => d.value > 0); // omit zero-slices if desired

  const totalFunctional = chartData.reduce((s, d) => s + d.value, 0);

  // tooltip for donut
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    const p = payload[0];
    const percent = totalFunctional ? ((p.value / totalFunctional) * 100).toFixed(1) : '0.0';
    return (
      <div style={{ background: '#111', color: '#fff', padding: 8, borderRadius: 6 }}>
        <div style={{ fontWeight: 700 }}>{p.name}</div>
        <div>{p.value} unit(s)</div>
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
              className={`nav-link-dashboard active`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Dashboard
            </a>
          </nav>
          <span className="page-title">Functional Units</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          {/* show username if available */}
          {user && <span style={{ marginLeft: 8, color: '#ccc' }}>{user.name || user.email}</span>}
        </div>
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
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Functional Units</h2>
          </div>

          <div className="new-layout-content" style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
            {/* LAB LIST (left) */}
            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Laboratories</h3>
              <div className="lab-filter-grid" style={{ maxHeight: 420 }}>
                {loadingLabs ? (
                  <div>Loading labs...</div>
                ) : (
                  labs.map(l => (
                    <div
                      key={l._id}
                      className={`lab-filter-card ${selectedLabId === l._id ? 'active' : ''}`}
                      onClick={() => setSelectedLabId(l._id)}
                      title="Click to select lab"
                      style={{ cursor: 'pointer' }}
                    >
                      {l.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* UNIT COUNTS (middle) */}
            <div className="horizontal-card" style={{ flex: '0 0 220px', minWidth: 180, maxWidth: 260 }}>
              <h3>Unit Counts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {labs.length === 0 ? <p>No labs</p> : labs.map(l => (
                  <div key={l._id} className="unit-summary-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={PcDisplayLogo} alt="PC Icon" className="menu-icon" />
                      <span style={{ fontSize: 14 }}>{l.name}</span>
                    </span>
                    <span className="count" style={{ fontWeight: 700 }}>{countsByLabValue(l._id, countsByLab)}</span>
                  </div>
                ))}
                <p className="total-units-text" style={{ marginTop: 'auto', fontWeight: 700 }}>
                  Total Functional: {totalFunctional}
                </p>
              </div>
            </div>

            {/* Donut chart (right) */}
            <div className="horizontal-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>TOTAL FUNCTIONAL UNITS (Donut)</h3>
                <div style={{ fontSize: 13, color: '#999' }}>{totalFunctional} units</div>
              </div>

              <div style={{ marginTop: 12 }}>
                {chartData.length === 0 ? (
                  <p style={{ color: '#999' }}>No functional units available.</p>
                ) : (
                  <div style={{ width: '100%', height: 340, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}`}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
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
                      color: '#fff',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>TOTAL</div>
                      <div style={{ fontWeight: 900, fontSize: 28 }}>{totalFunctional}</div>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>FUNCTIONAL</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// small helper to safely read countsByLab values
function countsByLabValue(labId, countsByLab) {
  return (countsByLab && countsByLab[labId]) ? countsByLab[labId] : 0;
}

export default Functional;
