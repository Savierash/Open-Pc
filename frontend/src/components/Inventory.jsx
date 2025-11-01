// src/pages/inventory/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add this import
import api from '../services/api';
import '../styles/Inventory.css'; // Changed from Dashboard.css
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/icon_6.png'; // Inventory icon
import ComputerLabImage from '../assets/BACKGROUND 2.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png';
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png"; // Added for unit cards
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon

// Use Vite env style and ensure no trailing slash
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, ''); // remove trailing slash if any
console.log('Inventory: API_BASE =', API_BASE);

const Inventory = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]); // array of { _id, name }
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [units, setUnits] = useState([]); // Added for units in selected lab
  const [selectedLab, setSelectedLab] = useState(null); // Added to track selected lab
  const [searchQuery, setSearchQuery] = useState(''); // Added for search functionality
  const [selectedUnit, setSelectedUnit] = useState(null); // Added for selected unit details
  const [unitStatuses, setUnitStatuses] = useState([]); // Added for filtering units

  // New state for modal / add-lab form
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [newLabName, setNewLabName] = useState('');
  const [newLabLocation, setNewLabLocation] = useState('');
  const [newLabTotalUnits, setNewLabTotalUnits] = useState(0);
  const [creatingLab, setCreatingLab] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // ----- Labs -----
  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      setLabs(res.data || []);
      if (res.data && res.data.length > 0 && !selectedLab) {
        setSelectedLab(res.data[0]); // Select the first lab by default
        fetchUnitsByLab(res.data[0]._id); // Fetch units for the first lab
      }
    } catch (err) {
      console.error('Failed to fetch labs', err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      window.alert('Failed to load labs. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  // open modal instead of prompt
  const openAddLabModal = () => {
    setNewLabName('');
    setNewLabLocation('');
    setNewLabTotalUnits(0);
    setShowAddLabModal(true);
  };

  const closeAddLabModal = () => {
    setShowAddLabModal(false);
  };

  // helper to create a safe short prefix from lab name (for unit naming)
  function labShortFromName(name) {
    if (!name) return 'LAB';
    // remove non-alphanum, collapse spaces, uppercase
    const keep = String(name).replace(/[^0-9A-Za-z]/g, '');
    return (keep || 'LAB').toUpperCase();
  }

  // submit handler for modal
  const submitAddLab = async (e) => {
    e?.preventDefault?.();
    const trimmed = (newLabName || '').trim();
    if (!trimmed) return window.alert('Lab name cannot be empty.');
    let total = Number(newLabTotalUnits) || 0;
    if (total < 0) total = 0;
    if (!Number.isInteger(total) || total < 0) return window.alert('Total units must be a whole number (0 or greater).');
    if (total > 200) {
      const ok = window.confirm('You requested more than 200 units. Continue?');
      if (!ok) return;
    }

    if (labs.some(l => l.name && l.name.toLowerCase() === trimmed.toLowerCase())) {
      return window.alert('This lab already exists.');
    }

    setCreatingLab(true);
    try {
      // create lab (includes location in body; server may ignore additional fields)
      const res = await axios.post(`${API_BASE}/labs`, { name: trimmed, location: newLabLocation || '' });
      const createdLab = res.data;
      // create units if requested
      if (total > 0) {
        const prefix = labShortFromName(trimmed); // e.g., ITS300 -> ITS300
        // create units sequentially (you could parallelize, but sequential keeps server-friendly)
        const createdUnits = [];
        for (let i = 1; i <= total; i++) {
          const num = String(i).padStart(3, '0'); // 001
          const unitName = `${prefix}-PC-${num}`; // e.g., ITS300-PC-001
          try {
            const ures = await axios.post(`${API_BASE}/units`, { name: unitName, lab: createdLab._id, status: 'Functional' });
            createdUnits.push(ures.data);
          } catch (uerr) {
            // log and continue - maybe unit exists already
            console.warn(`Failed to create unit ${unitName}`, uerr?.response?.data ?? uerr?.message ?? uerr);
            // continue creating remaining units
          }
        }
        // option: setUnits([...createdUnits]) - but we'll refetch units below
      }

      // refresh labs list and select new lab
      await fetchLabs();
      // select created lab (by id) to ensure it's selected
      if (createdLab && createdLab._id) {
        const found = (await axios.get(`${API_BASE}/labs`)).data || [];
        const picked = found.find(l => String(l._id) === String(createdLab._id));
        if (picked) {
          setSelectedLab(picked);
          fetchUnitsByLab(picked._id);
        } else {
          // fallback: select first
          if (found.length > 0) {
            setSelectedLab(found[0]);
            fetchUnitsByLab(found[0]._id);
          }
        }
      }

      setShowAddLabModal(false);
      window.alert('Lab created' + (total > 0 ? ` (attempted to create ${total} units)` : ''));
    } catch (err) {
      console.error('Failed to add lab', err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      const message = err?.response?.data?.message || 'Failed to add lab';
      window.alert(message);
    } finally {
      setCreatingLab(false);
    }
  };

  const removeLab = async (index) => {
    const lab = labs[index];
    if (!lab) return;
    const confirmed = window.confirm(`Remove lab "${lab.name}"?`);
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/labs/${lab._id}`);
      const newLabs = labs.filter((_, i) => i !== index);
      setLabs(newLabs);
      if (selectedLab?._id === lab._id) {
        setSelectedLab(newLabs.length > 0 ? newLabs[0] : null);
        setUnits([]);
        if (newLabs.length > 0) {
          fetchUnitsByLab(newLabs[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to delete lab', err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      window.alert('Failed to delete lab. See console for details.');
    }
  };

  // ----- Units -----
  const fetchUnitsByLab = async (labId) => {
    if (!labId) return;
    setLoading(true);
    try {
      // Prefer nested path that server handles: /api/labs/:labId/units
      const res = await axios.get(`${API_BASE}/labs/${labId}/units`);
      setUnits(res.data || []);
      if (res.data && res.data.length > 0 && !selectedUnit) {
        setSelectedUnit(res.data[0]);
      } else if (!res.data || res.data.length === 0) {
        setSelectedUnit(null);
      }
    } catch (err) {
      console.error(`Failed to fetch units for lab ${labId}`, err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      window.alert('Failed to load units. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  const addUnit = async () => {
    if (!selectedLab) return window.alert('Please select a lab first.');
    const newUnitName = window.prompt('Enter new unit name (e.g., ITS300-PC-001):');
    if (!newUnitName) return;
    const trimmed = newUnitName.trim();
    if (trimmed === '') return window.alert('Unit name cannot be empty.');

    try {
      const res = await axios.post(`${API_BASE}/units`, { name: trimmed, lab: selectedLab._id });
      setUnits(prev => [...prev, res.data]);
      setSelectedUnit(res.data);
    } catch (err) {
      console.error('Failed to add unit', err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      window.alert('Failed to add unit. See console for details.');
    }
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  const handleLabClick = (lab) => {
    setSelectedLab(lab);
    fetchUnitsByLab(lab._id);
  };

  // Filtered units for display
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = unitStatuses.length === 0 || unitStatuses.includes(unit.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Inventory</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span>
          <span className="profile-role">Auditor</span>
        </div>
      </header>

      <div className="inventory-main-layout">
        <aside className="sidebar inventory-sidebar">
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
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="inventory-main-content">
          <div className="inventory-page-content">
            {/* Left Container: Lab List */}
            <div className="inventory-lab-panel">
              <button
                className="inventory-add-lab-button"
                onClick={openAddLabModal}
                disabled={adding || creatingLab}
              >
                {(adding || creatingLab) ? 'ADDING...' : 'ADD LAB'}
              </button>
              <div className="inventory-lab-list-container">
                {loading ? (
                  <div>Loading labs...</div>
                ) : (
                  <>
                    {labs.map((lab) => (
                      <div
                        key={lab._id}
                        className={`inventory-lab-card ${selectedLab?._id === lab._id ? 'active' : ''}`}
                        onClick={() => handleLabClick(lab)}
                        onDoubleClick={() => removeLab(labs.indexOf(lab))}
                        title="Double-click to delete"
                      >
                        {lab.name}
                      </div>
                    ))}
                    <div
                      className={`inventory-lab-card inventory-add-lab-card ${selectedLab ? 'active' : ''}`}
                      onClick={openAddLabModal}
                      title="Add new lab"
                    >
                      +
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Middle Container: Unit Status with Filters and PC Cards */}
            <div className="inventory-middle-panel">
              <div className="inventory-middle-panel-header">
                <h2 className="inventory-panel-title">{selectedLab ? selectedLab.name : 'Select a Lab'}</h2>
                <button className="inventory-add-unit-button" onClick={addUnit} disabled={!selectedLab}>
                  ADD UNIT
                </button>
                <div className="inventory-search-bar">
                  <div className="inventory-search-input-wrapper">
                    <img src={PersonLogo} alt="Search Icon" className="inventory-search-icon" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="inventory-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="inventory-unit-cards-grid">
                {loading ? (
                  <div>Loading units...</div>
                ) : (
                  filteredUnits.map(unit => (
                    <div
                      key={unit._id}
                      className={`inventory-pc-card ${selectedUnit?._id === unit._id ? 'active' : ''}`}
                      onClick={() => handleUnitClick(unit)}
                    >
                      <img src={PcDisplayLogo} alt="PC Icon" className="inventory-pc-card-icon" />
                      <span className="inventory-pc-name">{unit.name}</span>
                      <span className="inventory-pc-status">{unit.status} &#x25cf;</span>
                    </div>
                  ))
                )}
                
              </div>
            </div>

            {/* Right Container: Information Panel */}
            <div className="inventory-info-panel">
              <h2 className="inventory-panel-title">INFORMATION</h2>
              {selectedUnit ? (
                <>
                  <div className="inventory-info-item">
                    <input
                      type="text"
                      value={selectedUnit.name || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, name: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Operating System:</span>
                    <input
                      type="text"
                      value={selectedUnit.os || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, os: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Ram:</span>
                    <input
                      type="text"
                      value={selectedUnit.ram || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, ram: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Storage:</span>
                    <input
                      type="text"
                      value={selectedUnit.storage || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, storage: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">CPU:</span>
                    <input
                      type="text"
                      value={selectedUnit.cpu || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, cpu: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Last Issued:</span>
                    <input
                      type="text"
                      value={selectedUnit.lastIssued || ''}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, lastIssued: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-set-status-section">
                    <span>SET STATUS:</span>
                    <select
                      className="inventory-status-dropdown"
                      value={selectedUnit.status || 'Functional'}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, status: e.target.value })}
                    >
                      <option value="Functional">Functional</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out Of Order">Out Of Order</option>
                    </select>
                  </div>
                  <button
                    className="inventory-save-button"
                    onClick={async () => {
                      // Optional: implement save to backend
                      try {
                        const payload = { ...selectedUnit };
                        // send to API (assumes PUT /units/:id exists)
                        if (selectedUnit._id) {
                          await axios.put(`${API_BASE}/units/${selectedUnit._id}`, payload);
                          // update units list locally
                          setUnits(prev => prev.map(u => (u._id === selectedUnit._id ? selectedUnit : u)));
                          window.alert('Unit saved');
                        }
                      } catch (err) {
                        console.error('Failed to save unit', err);
                        console.error('err.response:', err?.response?.data ?? err?.message);
                        window.alert('Failed to save unit. See console.');
                      }
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <div>Select a unit to view details</div>
              )}
            </div>
          </div>
        </main>
      </div>
      

      {/* Add Lab Modal */}
      {showAddLabModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0, color: '#000' }}>Add New Lab</h3>
            <form onSubmit={submitAddLab}>
              <div style={rowStyle}>
                <label style={labelStyle}>Lab Name</label>
                <input
                  style={inputStyle}
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  placeholder="e.g., ITS 300"
                  required
                />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Location</label>
                <input
                  style={inputStyle}
                  value={newLabLocation}
                  onChange={(e) => setNewLabLocation(e.target.value)}
                  placeholder="e.g., Block A, Building 1"
                />
              </div>
              <div style={rowStyle}>
                <label style={labelStyle}>Total Units</label>
                <input
                  style={inputStyle}
                  type="number"
                  min={0}
                  max={2000}
                  value={newLabTotalUnits}
                  onChange={(e) => setNewLabTotalUnits(Number(e.target.value))}
                />
                <small style={{ color: '#666' }}>How many unit records to create (0 = none)</small>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={closeAddLabModal} style={btnSecondaryStyle} disabled={creatingLab}>Cancel</button>
                <button type="submit" style={btnPrimaryStyle} disabled={creatingLab}>
                  {creatingLab ? 'CREATING...' : 'Create Lab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


/* Inline minimal styles for modal (you may move them to Inventory.css) */
const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000
};
const modalStyle = {
  width: 420,
  maxWidth: '95%',
  background: '#fff',
  padding: 18,
  borderRadius: 8,
  boxShadow: '0 6px 18px rgba(0,0,0,0.16)'
};
const rowStyle = { display: 'flex', flexDirection: 'column', marginBottom: 10 };
const labelStyle = { fontSize: 13, marginBottom: 6, color: '#333' };
const inputStyle = { padding: '8px 10px', fontSize: 14, borderRadius: 6, border: '1px solid #ddd' };
const btnPrimaryStyle = { background: '#1f7aed', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' };
const btnSecondaryStyle = { background: '#f1f1f1', color: '#222', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' };

export default Inventory;


