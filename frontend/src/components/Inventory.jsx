import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import ComputerLabImage from '../assets/BACKGROUND 2.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo

// Use Vite env style
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
console.log('Inventory: API_BASE =', API_BASE); 


const Inventory = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]); // array of { _id, name }
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    // fetch on mount
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

 const fetchLabs = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE}/lab`);
    setLabs(res.data);
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

  setAdding(true);
  try {
    const res = await axios.post(`${API_BASE}/lab`, { name: trimmed });
    setLabs(prev => [...prev, res.data]);
  } catch (err) {
    console.error('Failed to add lab', err);
    console.error('err.response:', err?.response?.data ?? err?.message);
    const message = err?.response?.data?.message || 'Failed to add lab';
    window.alert(message);
  } finally {
    setAdding(false);
  }
};

  // Remove a lab by index (with confirmation)
  const removeLab = async (index) => {
    const lab = labs[index];
    if (!lab) return;
    const confirmed = window.confirm(`Remove lab "${lab.name}"?`);
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/lab/${lab._id}`);
      setLabs(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete lab', err);
      window.alert('Failed to delete lab. See console for details.');
    }
  };

  const handleLabDoubleClick = (index) => {
    removeLab(index);
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
          <div className="inventory-content">
            <button
              className="add-lab-button"
              onClick={addLab}
              disabled={adding}
              title="Add new lab"
            >
              {adding ? 'ADDING...' : 'ADD LAB'}
            </button>

            <div className="lab-cards-container">
              {loading ? (
                <div>Loading labs...</div>
              ) : (
                <>
                  {labs.map((lab, index) => (
                    <div
                      key={lab._id}
                      className="lab-card"
                      onDoubleClick={() => handleLabDoubleClick(index)}
                      title="Double-click to delete"
                    >
                      <span className="lab-card-text">{lab.name}</span>
                    </div>
                  ))}

                  {/* + card to quickly add */}
                  <div className="add-lab-card" onClick={addLab} title="Add lab">
                    <span className="add-lab-plus">+</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
