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
import StackLogo from '../assets/Stack.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo

const Maintenance = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [units, setUnits] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setActiveLink(window.location.pathname);
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
          <div className="page-header-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Maintenance Units</h2>
          </div>

          <div className="new-layout-content">
            <div className="horizontal-card">
              <h3>Laboratories</h3>
              {/* Placeholder for laboratories content */}
              <div className="lab-filter-grid">
                {loadingLabs && <div>Loading labs...</div>}
                {!loadingLabs && labs.length === 0 && <div>No labs</div>}
                {!loadingLabs && labs.map((lab) => (
                  <div
                    key={lab._id}
                    className={`lab-filter-card ${selectedLab === lab._id ? 'active' : ''}`}
                    onClick={() => setSelectedLab(lab._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {lab.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="horizontal-card">
              <h3>Unit Counts</h3>
              {/* Placeholder for unit counts content */}
              {loadingUnits && <div>Loading units...</div>}
              {!loadingUnits && (
                <>
                  <div className="unit-summary-item">
                    <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                    <span>Functional Units</span>
                    <span className="count">{units.filter(u => u.status === 'functional').length}</span>
                  </div>
                  <div className="unit-summary-item">
                    <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                    <span>Maintenance</span>
                    <span className="count">{units.filter(u => u.status === 'maintenance').length}</span>
                  </div>
                  <div className="unit-summary-item">
                    <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                    <span>Out of Order</span>
                    <span className="count">{units.filter(u => u.status === 'out-of-order').length}</span>
                  </div>
                  <p className="total-units-text" style={{ marginTop: 'auto' }}>Total Units: {units.length}</p>
                </>
              )}
            </div>

            <div className="horizontal-card" style={{ flex: '2' }}>
              <h3>TOTAL UNITS</h3>
              <div className="pc-grid">
                <button className="add-unit-button" onClick={() => navigate('/inventory')}>Add Unit</button>
                {loadingUnits && <div>Loading units...</div>}
                {!loadingUnits && units.length === 0 && <div className="pc-card">No units</div>}
                {!loadingUnits && units.filter(u => u.status === 'maintenance').map((unit) => (
                  <div key={unit._id} className="pc-card">
                    <img src={PcDisplayLogo} alt="PC Icon" />
                    <span>{unit.name}</span>
                    <div style={{ fontSize: 12, color: '#666' }}>{unit.notes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Maintenance;
