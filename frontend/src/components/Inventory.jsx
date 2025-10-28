import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Inventory.css'; // Changed from Dashboard.css
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import ComputerLabImage from '../assets/BACKGROUND 2.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png';
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png"; // Added for unit cards

<<<<<<< Updated upstream
// Use Vite env style
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
console.log('Inventory: API_BASE =', API_BASE);
=======
// centralized api client
>>>>>>> Stashed changes


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

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

<<<<<<< Updated upstream
 const fetchLabs = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE}/lab`);
    setLabs(res.data);
    if (res.data.length > 0 && !selectedLab) {
      setSelectedLab(res.data[0]); // Select the first lab by default
      fetchUnitsByLab(res.data[0]._id); // Fetch units for the first lab
=======
  // ----- Labs -----
  const fetchLabs = async () => {
    setLoading(true);
    try {
  const res = await api.get('/lab');
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
>>>>>>> Stashed changes
    }
  } catch (err) {
    console.error('Failed to fetch labs', err);
    console.error('err.response:', err?.response?.data ?? err?.message);
    window.alert('Failed to load labs. See console for details.');
  } finally {
    setLoading(false);
  }
};

const addLab = async () => {
  const newLabName = window.prompt('Enter new lab name:');
  if (!newLabName) return;
  const trimmed = newLabName.trim();
  if (trimmed === '') return window.alert('Lab name cannot be empty.');

  if (labs.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) {
    return window.alert('This lab already exists.');
  }

<<<<<<< Updated upstream
  setAdding(true);
  try {
    const res = await axios.post(`${API_BASE}/lab`, { name: trimmed });
    setLabs(prev => [...prev, res.data]);
    setSelectedLab(res.data); // Select newly added lab
    setUnits([]); // Clear units for new lab
  } catch (err) {
    console.error('Failed to add lab', err);
    console.error('err.response:', err?.response?.data ?? err?.message);
    const message = err?.response?.data?.message || 'Failed to add lab';
    window.alert(message);
  } finally {
    setAdding(false);
  }
};
=======
    setAdding(true);
    try {
  const res = await api.post('/lab', { name: trimmed });
      setLabs(prev => [...prev, res.data]);
      setSelectedLab(res.data); // Select newly added lab
      setUnits([]); // Clear units for new lab
    } catch (err) {
      console.error('Failed to add lab', err);
      console.error('err.response:', err?.response?.data ?? err?.message);
      const message = err?.response?.data?.message || 'Failed to add lab';
      window.alert(message);
    } finally {
      setAdding(false);
    }
  };
>>>>>>> Stashed changes

  // Remove a lab by index (with confirmation)
  const removeLab = async (index) => {
    const lab = labs[index];
    if (!lab) return;
    const confirmed = window.confirm(`Remove lab "${lab.name}"?`);
    if (!confirmed) return;

    try {
<<<<<<< Updated upstream
      await axios.delete(`${API_BASE}/lab/${lab._id}`);
=======
  await api.delete(`/lab/${lab._id}`);
>>>>>>> Stashed changes
      const newLabs = labs.filter((_, i) => i !== index);
      setLabs(newLabs);
      if (selectedLab?._id === lab._id) {
        setSelectedLab(newLabs.length > 0 ? newLabs[0] : null); // Select first lab or none
        setUnits([]);
      }
    } catch (err) {
      console.error('Failed to delete lab', err);
      window.alert('Failed to delete lab. See console for details.');
    }
  };

  const handleLabDoubleClick = (index) => {
    removeLab(index);
  };

  // New functions for unit management
  const fetchUnitsByLab = async (labId) => {
    setLoading(true);
    try {
<<<<<<< Updated upstream
      const res = await axios.get(`${API_BASE}/unit/lab/${labId}`);
      setUnits(res.data);
      // Automatically select the first unit if units are fetched and no unit is selected
      if (res.data.length > 0 && !selectedUnit) {
=======
      // Prefer nested path that server handles: /api/labs/:labId/units
  const res = await api.get(`/lab/${labId}/units`);
      setUnits(res.data || []);
      if (res.data && res.data.length > 0 && !selectedUnit) {
>>>>>>> Stashed changes
        setSelectedUnit(res.data[0]);
      }
    } catch (err) {
      console.error(`Failed to fetch units for lab ${labId}`, err);
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
<<<<<<< Updated upstream
      const res = await axios.post(`${API_BASE}/unit`, { name: trimmed, lab: selectedLab._id });
=======
  const res = await api.post('/units', { name: trimmed, lab: selectedLab._id });
>>>>>>> Stashed changes
      setUnits(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add unit', err);
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
    const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
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
          <nav className="nav-links-dashboard">
            <a 
              href="/dashboard" 
              className={`nav-link-dashboard ${activeLink === '/dashboard-admin' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard-admin');
              }}
            >
              Dashboard
            </a>
            <a
              href="/inventory"
              className="nav-link-dashboard active"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/inventory');
              }}
            >
              Inventory
            </a>
          </nav>
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
                <img src={PcDisplayLogo} alt="Unit Status Icon" className="menu-icon" />
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
                onClick={addLab} 
                disabled={adding}
              >
                {adding ? 'ADDING...' : 'ADD LAB'}
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
                      onClick={addLab}
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
                      <span>{unit.name}</span>
                      <span>{unit.status} &#x25cf;</span>
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
                      value={selectedUnit.name}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, name: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Operating System:</span>
                    <input 
                      type="text" 
                      value={selectedUnit.os}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, os: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Ram:</span>
                    <input 
                      type="text" 
                      value={selectedUnit.ram}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, ram: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Storage:</span>
                    <input 
                      type="text" 
                      value={selectedUnit.storage}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, storage: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">CPU:</span>
                    <input 
                      type="text" 
                      value={selectedUnit.cpu}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, cpu: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-info-item">
                    <span className="inventory-info-label">Last Issued:</span>
                    <input 
                      type="text" 
                      value={selectedUnit.lastIssued}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, lastIssued: e.target.value })}
                      className="inventory-info-input"
                    />
                    <img src={ClipboardLogo} alt="Edit Icon" className="inventory-edit-icon" />
                  </div>
                  <div className="inventory-set-status-section">
                    <span>SET STATUS:</span>
<<<<<<< Updated upstream
                    <select 
                      className="inventory-status-dropdown"
                      value={selectedUnit.status}
                      onChange={(e) => setSelectedUnit({ ...selectedUnit, status: e.target.value })}
                    >
                      <option value="Functional">Functional</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out Of Order">Out Of Order</option>
                    </select>
                  </div>
                  <button className="inventory-save-button">Save</button>
=======
                      <select
                        className="inventory-status-dropdown"
                        value={selectedUnit.status || 'functional'}
                        onChange={(e) => setSelectedUnit({ ...selectedUnit, status: e.target.value })}
                      >
                        <option value="functional">Functional</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out-of-order">Out Of Order</option>
                      </select>
                  </div>
                  <button
                    className="inventory-save-button"
                    onClick={async () => {
                      // Optional: implement save to backend
                      try {
                        const normalizeStatus = (s) => {
                          if (!s) return 'functional';
                          const t = String(s).toLowerCase();
                          if (t.includes('out') && t.includes('order')) return 'out-of-order';
                          if (t.includes('maint')) return 'maintenance';
                          return 'functional';
                        };

                        const payload = { ...selectedUnit, status: normalizeStatus(selectedUnit.status) };
                        // send to API (assumes PUT /units/:id exists)
                        if (selectedUnit._id) {
                          await api.put(`/units/${selectedUnit._id}`, payload);
                          // update units list locally
                          setUnits(prev => prev.map(u => (u._id === selectedUnit._id ? { ...u, ...payload } : u)));
                          setSelectedUnit(prev => ({ ...prev, ...payload }));
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
>>>>>>> Stashed changes
                </>
              ) : (
                <div>Select a unit to view details</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
