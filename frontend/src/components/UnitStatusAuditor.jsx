import React, { useState } from 'react';
import '../styles/Dashboard.css';
import '../styles/UnitStatusAuditor.css';
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import PersonLogo from "../assets/Person.png";
import XOctagonFill from "../assets/XOctagonFill.png";
import GraphUp from "../assets/GraphUp.png";
import ShieldLockFill from "../assets/ShieldLockFill.png";

const UnitStatusAuditor = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [filter, setFilter] = useState('Functional');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState('ITS 300');

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLabSelect = (lab) => {
    setSelectedLab(lab);
    setIsDropdownOpen(false);
  };

  const labData = [
    { id: 'MCLAB', name: 'MCLAB' },
    { id: 'PTC 201', name: 'PTC 201' },
    { id: 'ITS 300', name: 'ITS 300' },
  ];

  const unitData = [
    { id: 'ITS300-PC-001', status: 'Functional' },
    { id: 'ITS300-PC-002', status: 'Out Of Order' },
    { id: 'ITS300-PC-003', status: 'Maintenance' },
    { id: 'ITS300-PC-004', status: 'Functional' },
    { id: 'ITS300-PC-005', status: 'Functional' },
    { id: 'ITS300-PC-006', status: 'Functional' },
    { id: 'ITS300-PC-007', status: 'Functional' },
    { id: 'ITS300-PC-008', status: 'Maintenance' },
    { id: 'ITS300-PC-009', status: 'Maintenance' },
    { id: 'ITS300-PC-010', status: 'Out Of Order' },
    { id: 'ITS300-PC-011', status: 'Functional' },
    { id: 'ITS300-PC-012', status: 'Functional' },
    { id: 'ITS300-PC-013', status: 'Functional' },
    { id: 'ITS300-PC-014', status: 'Functional' },
    { id: 'ITS300-PC-015', status: 'Out Of Order' },
    { id: 'ITS300-PC-016', status: 'Functional' },
    { id: 'ITS300-PC-017', status: 'Functional' },
    { id: 'ITS300-PC-018', status: 'Functional' },
    { id: 'ITS300-PC-019', status: 'Functional' },
    { id: 'ITS300-PC-020', status: 'Maintenance' },
  ];

  const filteredUnits = unitData.filter(unit =>
    unit.status === filter && unit.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
            <span className="logo-text">Unit Status</span>
          </div>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span>
          <span className="profile-role">Auditor</span>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === "/reports-auditor" ? "active" : ""}`}><img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technicians" className={`sidebar-link ${activeLink === "/technicians" ? "active" : ""}`}><img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className={`sidebar-link ${activeLink === "/auditor-profile" ? "active" : ""}`}><img src={AccountSettingLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content unit-status-auditor-main-content">
          <div className="auditor-main-content-header">
            <div className="auditor-status-filters-and-search">
              <div className="auditor-status-filters">
                <button
                  className={`auditor-status-button ${filter === 'Functional' ? 'auditor-functional-button active' : ''}`}
                  onClick={() => setFilter('Functional')}
                >
                  Functional
                </button>
                <button
                  className={`auditor-status-button ${filter === 'Out Of Order' ? 'auditor-out-of-order-button active' : ''}`}
                  onClick={() => setFilter('Out Of Order')}
                >
                  Out Of Order
                </button>
                <button
                  className={`auditor-status-button ${filter === 'Maintenance' ? 'auditor-maintenance-button active' : ''}`}
                  onClick={() => setFilter('Maintenance')}
                >
                  Maintenance
                </button>
              </div>
              <div className="auditor-search-bar-unit-status">
                  <div className="auditor-search-input-wrapper-unit-status">
                      <img src={PersonLogo} alt="Search Icon" className="auditor-search-icon-unit-status" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="auditor-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
            </div>
            <div className="change-lab-container">
              <h2 className="auditor-panel-title">{selectedLab}</h2>
              <span className="change-lab-dropdown-toggle" onClick={toggleDropdown}>Change Lab</span>
              {isDropdownOpen && (
                <div className="lab-dropdown-menu">
                  {labData.map(lab => (
                    <div className="lab-dropdown-item" key={lab.id}>
                      <span className="lab-name">{lab.name}</span>
                      <button 
                        className="lab-open-button"
                        onClick={() => handleLabSelect(lab.name)}
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="auditor-pc-cards-container">
            <div className="auditor-unit-cards-grid">
              {filteredUnits.map(unit => (
                <div className="auditor-pc-card" key={unit.id}>
                  <img src={PcDisplayLogo} alt="PC Icon" className="auditor-pc-card-icon" />
                  <div className="auditor-pc-card-content">
                    <span>{unit.id}</span>
                    <div className="status-indicator">
                      <span>{unit.status}</span>
                      <span className={`status-dot ${unit.status.toLowerCase().replace(/ /g, '-')}`}></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnitStatusAuditor;
