// src/pages/unit-status/UnitStatusTechnician.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/UnitStatusTechnician.css';
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import PersonLogo from "../assets/Person.png";

// API base (Vite)
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

const UnitStatusTechnician = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // data
  const [labs, setLabs] = useState([]); // { _id, name }
  const [selectedLab, setSelectedLab] = useState(null); // lab object
  const [units, setUnits] = useState([]); // units of selected lab
  const [filteredUnits, setFilteredUnits] = useState([]);

  // selected unit form
  const [selectedUnit, setSelectedUnitState] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  // load labs on mount
  useEffect(() => {
    fetchLabs();
  }, []);

  // when selectedLab changes, fetch units
  useEffect(() => {
    if (selectedLab && selectedLab._id) {
      fetchUnits(selectedLab._id);
    }
  }, [selectedLab]);

  // filter units by search
  useEffect(() => {
    if (!searchQ) return setFilteredUnits(units);
    const q = searchQ.toLowerCase();
    setFilteredUnits(units.filter(u => (u.name || '').toLowerCase().includes(q)));
  }, [searchQ, units]);

  // ---------- API calls ----------
  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      setLabs(res.data || []);
      if (res.data && res.data.length > 0) {
        // pick ITS 300 if present, otherwise first
        const prefer = res.data.find(l => l.name && l.name.toLowerCase().includes('its 300')) || res.data[0];
        setSelectedLab(prefer);
      }
    } catch (err) {
      console.error('fetchLabs error', err);
      window.alert('Failed to load labs — check backend. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (labId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/units?labId=${labId}`);
      const list = res.data || [];
      setUnits(list);
      setFilteredUnits(list);
      // auto-select first unit if none selected
      if (list.length > 0 && (!selectedUnit || selectedUnit.lab?._id !== labId)) {
        setSelectedUnitState(list[0]);
      } else if (list.length === 0) {
        setSelectedUnitState(null);
      }
    } catch (err) {
      console.error('fetchUnits error', err);
      window.alert('Failed to load units — check backend. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitById = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/units/${id}`);
      return res.data;
    } catch (err) {
      console.error('fetchUnitById error', err);
      return null;
    }
  };

  const saveUnit = async () => {
    if (!selectedUnit || !selectedUnit._id) return window.alert('No unit selected');
    setSaving(true);
    try {
      // prepare payload: match backend unit schema keys
      const payload = {
        name: selectedUnit.name,
        os: selectedUnit.os,
        ram: selectedUnit.ram,
        storage: selectedUnit.storage,
        cpu: selectedUnit.cpu,
        lastIssued: selectedUnit.lastIssued,
        status: selectedUnit.status
      };
      const res = await axios.put(`${API_BASE}/units/${selectedUnit._id}`, payload);
      // update local list with returned unit
      const updated = res.data;
      setUnits(prev => prev.map(u => (String(u._id) === String(updated._id) ? updated : u)));
      setFilteredUnits(prev => prev.map(u => (String(u._id) === String(updated._id) ? updated : u)));
      setSelectedUnitState(updated);
      window.alert('Saved');
    } catch (err) {
      console.error('saveUnit error', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to save';
      window.alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // ---------- helpers ----------
  const handleUnitClick = async (unit) => {
    // ensure full unit data (if list is partial)
    if (!unit.os && unit._id) {
      const full = await fetchUnitById(unit._id);
      if (full) {
        setSelectedUnitState(full);
        return;
      }
    }
    setSelectedUnitState(unit);
  };

  const handleUnitDetailChange = (field, value) => {
    setSelectedUnitState(prev => ({ ...prev, [field]: value }));
  };

  // ---------- render ----------
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
            <a href="/dashboard" className={`nav-link-dashboard`}>Dashboard</a>
          </nav>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">Kresner Leonardo</span>
          <span className="profile-role">Technician</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}>
                <img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status" ? "active" : ""}`}>
                <img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span>
              </a>
            </li>
            <li>
              <a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/reports-tech'); }}>
                <img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/technician-profile'); }}>
                <img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content unit-status-main-content">
          <div className="unit-status-page-content">
            {/* Left: lab list */}
            <div className="unit-status-lab-panel">
              <h2 className="panel-title">Lab</h2>
              <div className="lab-list-container">
                {loading ? <div>Loading labs...</div> : (
                  <>
                    {labs.map(l => (
                      <div
                        key={l._id}
                        className={`lab-card-new ${selectedLab && selectedLab._id === l._id ? 'active' : ''}`}
                        onClick={() => { setSelectedLab(l); }}
                      >
                        {l.name}
                      </div>
                    ))}
                    <div
                      className="lab-card-new add-lab-card-unit-status"
                      onClick={async () => {
                        const name = window.prompt('New lab name');
                        if (!name) return;
                        try {
                          setLoading(true);
                          const res = await axios.post(`${API_BASE}/labs`, { name: name.trim() });
                          setLabs(prev => [...prev, res.data]);
                          setSelectedLab(res.data);
                        } catch (err) {
                          console.error('create lab err', err);
                          window.alert(err?.response?.data?.message || 'Failed to create lab');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      +
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Middle: units */}
            <div className="unit-status-middle-panel">
              <div className="middle-panel-header">
                <h2 className="panel-title">{selectedLab ? selectedLab.name : 'Select a lab'}</h2>
                <div className="status-filters">
                  <button className="status-button functional-button" onClick={() => setFilteredUnits(units.filter(u => u.status === 'Functional'))}>Functional</button>
                  <button className="status-button out-of-order-button" onClick={() => setFilteredUnits(units.filter(u => u.status === 'Out Of Order'))}>Out Of Order</button>
                  <button className="status-button maintenance-button" onClick={() => setFilteredUnits(units.filter(u => u.status === 'Maintenance'))}>Maintenance</button>
                  <button className="status-button" onClick={() => setFilteredUnits(units)}>All</button>
                </div>
              </div>

              <div className="search-bar-unit-status">
                <div className="search-input-wrapper-unit-status">
                  <img src={PersonLogo} alt="Search Icon" className="search-icon-unit-status" />
                  <input type="text" placeholder="Search..." className="search-input" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                </div>
              </div>

              <div className="unit-cards-grid">
                {filteredUnits.length === 0 ? <div className="placeholder">No units</div> : (
                  filteredUnits.map(unit => (
                    <div key={unit._id} className="pc-card" onClick={() => handleUnitClick(unit)} style={{ cursor: 'pointer', border: selectedUnit && selectedUnit._id === unit._id ? '2px solid #2B6CB0' : undefined }}>
                      <img src={PcDisplayLogo} alt="PC Icon" className="pc-card-icon" />
                      <span>{unit.name}</span>
                      <span>{unit.status} &#x25cf;</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: info panel */}
            <div className="unit-status-info-panel">
              <h2 className="panel-title">INFORMATION</h2>

              {!selectedUnit ? (
                <div>Select a unit to view details</div>
              ) : (
                <>
                  <div className="info-item">
                    <input type="text" value={selectedUnit.name || ''} onChange={(e) => handleUnitDetailChange('name', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="info-item">
                    <input type="text" value={selectedUnit.os || ''} onChange={(e) => handleUnitDetailChange('os', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="info-item">
                    <input type="text" value={selectedUnit.ram || ''} onChange={(e) => handleUnitDetailChange('ram', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="info-item">
                    <input type="text" value={selectedUnit.storage || ''} onChange={(e) => handleUnitDetailChange('storage', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="info-item">
                    <input type="text" value={selectedUnit.cpu || ''} onChange={(e) => handleUnitDetailChange('cpu', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="info-item">
                    <input type="text" value={selectedUnit.lastIssued || ''} onChange={(e) => handleUnitDetailChange('lastIssued', e.target.value)} className="info-input" />
                    <img src={ClipboardLogo} alt="Edit Icon" className="edit-icon" />
                  </div>

                  <div className="set-status-section">
                    <span>SET STATUS:</span>
                    <select className="status-dropdown" value={selectedUnit.status || ''} onChange={(e) => handleUnitDetailChange('status', e.target.value)}>
                      <option>Maintenance</option>
                      <option>Functional</option>
                      <option>Out Of Order</option>
                    </select>
                  </div>

                  <button className="save-button" onClick={saveUnit} disabled={saving}>
                    {saving ? 'SAVING...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnitStatusTechnician;
