import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import '../styles/UnitStatusTechnician.css';
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import StackLogo from "../assets/Stack.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png"; 
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon
import PersonLogo from "../assets/Person.png";
import PcDisplayIcon from "../assets/pcdisplay.png"; // PC card icon

const UnitStatusTechnician = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [editingField, setEditingField] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState({
    name: 'ITS300-PC-002',
    os: 'Windows 11',
    ram: '16GB',
    storage: '128GB SSD',
    cpu: 'Core i3 10th Gen',
    lastIssued: 'September 12, 2025',
    status: 'Maintenance',
  });

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  const handleUnitDetailChange = (field, value) => {
    setSelectedUnit(prev => ({ ...prev, [field]: value }));
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
          <span className="page-title">Unit Status</span>
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
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status" ? "active" : ""}`}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content unit-status-main-content">
          <div className="unit-status-page-content">
            {/* Left Container: Lab List */}
            <div className="unit-status-lab-panel">
              <h2 className="panel-title">Lab</h2>
              <div className="lab-list-container">
                <div className="lab-card-new active">PTC 201</div>
                <div className="lab-card-new">MCLAB</div>
                <div className="lab-card-new">ITS 300</div>
                <div className="lab-card-new add-lab-card-unit-status">+</div>
              </div>
            </div>

            {/* Middle Container: Unit Status with Filters and PC Cards */}
            <div className="unit-status-middle-panel">
              <div className="middle-panel-header">
                <h2 className="panel-title">ITS 300</h2>
                <div className="status-filters">
                  <button className="status-button functional-button">Functional</button>
                  <button className="status-button out-of-order-button">Out Of Order</button>
                  <button className="status-button maintenance-button">Maintenance</button>
                </div>
              </div>
              <div className="search-bar-unit-status">
                <div className="search-input-wrapper-unit-status">
                  <img src={PersonLogo} alt="Search Icon" className="search-icon-unit-status" />
                  <input type="text" placeholder="Search..." className="search-input" />
                </div>
              </div>
              <div className="unit-cards-grid">
                <div className="pc-card">
                  <img src={PcDisplayIcon} alt="PC Icon" className="pc-card-icon" />
                  <span>ITS300-PC-002</span>
                  <div className="status-indicator">
                    <span>Out Of Order</span>
                    <span className="status-dot out-of-order"></span>
                  </div>
                </div>
                <div className="pc-card">
                  <img src={PcDisplayIcon} alt="PC Icon" className="pc-card-icon" />
                  <span>ITS300-PC-010</span>
                  <div className="status-indicator">
                    <span>Out Of Order</span>
                    <span className="status-dot out-of-order"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Container: Information Panel */}
            <div className="unit-status-info-panel">
              <h2 className="panel-title">INFORMATION</h2>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.name}
                  onChange={(e) => handleUnitDetailChange('name', e.target.value)}
                  className={`info-input ${editingField === 'name' ? 'editable' : ''}`}
                  readOnly={editingField !== 'name'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'name' ? null : 'name')}
                />
              </div>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.os}
                  onChange={(e) => handleUnitDetailChange('os', e.target.value)}
                  className={`info-input ${editingField === 'os' ? 'editable' : ''}`}
                  readOnly={editingField !== 'os'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'os' ? null : 'os')}
                />
              </div>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.ram}
                  onChange={(e) => handleUnitDetailChange('ram', e.target.value)}
                  className={`info-input ${editingField === 'ram' ? 'editable' : ''}`}
                  readOnly={editingField !== 'ram'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'ram' ? null : 'ram')}
                />
              </div>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.storage}
                  onChange={(e) => handleUnitDetailChange('storage', e.target.value)}
                  className={`info-input ${editingField === 'storage' ? 'editable' : ''}`}
                  readOnly={editingField !== 'storage'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'storage' ? null : 'storage')}
                />
              </div>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.cpu}
                  onChange={(e) => handleUnitDetailChange('cpu', e.target.value)}
                  className={`info-input ${editingField === 'cpu' ? 'editable' : ''}`}
                  readOnly={editingField !== 'cpu'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'cpu' ? null : 'cpu')}
                />
              </div>
              <div className="info-item">
                <input 
                  type="text" 
                  value={selectedUnit.lastIssued}
                  onChange={(e) => handleUnitDetailChange('lastIssued', e.target.value)}
                  className={`info-input ${editingField === 'lastIssued' ? 'editable' : ''}`}
                  readOnly={editingField !== 'lastIssued'}
                />
                <img 
                  src={ClipboardLogo} 
                  alt="Edit Icon" 
                  className="edit-icon" 
                  onClick={() => setEditingField(editingField === 'lastIssued' ? null : 'lastIssued')}
                />
              </div>
              <div className="set-status-section">
                <span>SET STATUS:</span>
                <select 
                  className="status-dropdown"
                  value={selectedUnit.status}
                  onChange={(e) => handleUnitDetailChange('status', e.target.value)}
                >
                  <option>Maintenance</option>
                  <option>Functional</option>
                  <option>Out Of Order</option>
                </select>
              </div>
              <button className="save-button">Save</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnitStatusTechnician;
