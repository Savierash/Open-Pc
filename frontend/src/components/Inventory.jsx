import React, { useState, useEffect } from 'react';
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

const Inventory = () => {
  // nav active link
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // labs state (initial example labs)
  const [labs, setLabs] = useState(["ITS 300", "PTC 201"]);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  // Add a new lab (uses prompt for quick implementation)
  const addLab = () => {
    const newLabName = window.prompt("Enter new lab name:");
    if (newLabName && newLabName.trim() !== "") {
      const trimmed = newLabName.trim();
      // avoid exact duplicates
      if (labs.includes(trimmed)) {
        window.alert("This lab already exists.");
        return;
      }
      setLabs((prev) => [...prev, trimmed]);
    }
  };

  // Remove a lab by index (with confirmation)
  const removeLab = (index) => {
    const labName = labs[index];
    const confirmed = window.confirm(`Remove lab "${labName}"?`);
    if (!confirmed) return;
    setLabs((prev) => prev.filter((_, i) => i !== index));
  };

  // Optional: double-click handler is already used in JSX; kept for clarity
  const handleLabDoubleClick = (index) => {
    removeLab(index);
  };

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-dashboard">
          <a
            href="/"
            className={`nav-link-dashboard ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a
            href="/about"
            className={`nav-link-dashboard ${activeLink === '/about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/about');
            }}
          >
            About
          </a>
          <a
            href="/services"
            className={`nav-link-dashboard ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
        </nav>
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
          </ul>
        </aside>

        <main className="main-content">
          <div className="inventory-content">
            <button className="add-lab-button" onClick={addLab}>
              ADD LAB
            </button>

            <div className="lab-cards-container">
              {labs.map((lab, index) => (
                <div
                  key={index}
                  className="lab-card"
                  onDoubleClick={() => handleLabDoubleClick(index)}
                  title="Double-click to delete"
                >
                  <span className="lab-card-text">{lab}</span>
                </div>
              ))}

              {/* + card to quickly add */}
              <div className="add-lab-card" onClick={addLab} title="Add lab">
                <span className="add-lab-plus">+</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
