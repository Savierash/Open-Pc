import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Import dashboard styles
import '../styles/ReportsTech.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import AccountSettingLogo from "../assets/GearFill.png"; 

const ReportsTech = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [reportIssues, setReportIssues] = useState({
    ramIssue: true,
    osIssue: true,
    cpuIssue: false,
    noInternet: true,
    storageIssue: false,
    virus: false,
  });

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const handleIssueChange = (issueName) => {
    setReportIssues(prevIssues => ({
      ...prevIssues,
      [issueName]: !prevIssues[issueName]
    }));
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
              className={`nav-link-dashboard`}
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
          <span className="profile-name">Kresner Leonardo</span>
          <span className="profile-role">Technician</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">
            {/* Left Container: Lab List */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports">ADD LAB</button>
              <div className="lab-list-container-reports">
                <div className="lab-card-reports">PTC 201</div>
                <div className="lab-card-reports">MCLAB</div>
                <div className="lab-card-reports active">ITS 300</div>
                <div className="lab-card-reports add-lab-card-reports">+</div>
              </div>
            </div>

            {/* Middle Container: PC Reports List */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">ITS 300</h2>
                <div className="search-bar-reports">
                  <div className="search-input-wrapper-reports">
                    <img src={PersonLogo} alt="Search Icon" className="search-icon-reports" />
                    <input type="text" placeholder="" className="search-input" />
                  </div>
                </div>
              </div>
              <div className="report-cards-grid">
                <div className="report-card">
                  <span>ITS300-PC-002</span>
                  <span className="status-tag out-of-order">Out Of Order</span>
                </div>
                <div className="report-card">
                  <span>ITS300-PC-010</span>
                  <span className="status-tag out-of-order">Out Of Order</span>
                </div>
              </div>
            </div>

            {/* Right Container: Report Details */}
            <div className="reports-tech-info-panel">
              <h2 className="panel-title">REPORTS</h2>
              <div className="report-detail-card-header">
                <span>ITS300-PC-002</span>
                <span className="status-tag out-of-order">Out Of Order</span>
              </div>
              <div className="info-item-reports">
                <span>Technician ID: 01593</span>
              </div>
              <div className="info-item-reports">
                <span>Date Issued: October 22, 2025</span>
              </div>
              <div className="info-item-reports">
                <span>Last Issued: September 1, 2025</span>
              </div>
              <div className="issues-checkbox-grid">
                <label><input type="checkbox" checked={reportIssues.ramIssue} onChange={() => handleIssueChange('ramIssue')} disabled /> Ram Issue</label>
                <label><input type="checkbox" checked={reportIssues.osIssue} onChange={() => handleIssueChange('osIssue')} disabled /> OS Issue</label>
                <label><input type="checkbox" checked={reportIssues.cpuIssue} onChange={() => handleIssueChange('cpuIssue')} disabled /> CPU Issue</label>
                <label><input type="checkbox" checked={reportIssues.noInternet} onChange={() => handleIssueChange('noInternet')} disabled /> No Internet</label>
                <label><input type="checkbox" checked={reportIssues.storageIssue} onChange={() => handleIssueChange('storageIssue')} disabled /> Storage Issue</label>
                <label><input type="checkbox" checked={reportIssues.virus} onChange={() => handleIssueChange('virus')} disabled /> Virus</label>
              </div>
              <div className="other-issues-textarea">
                <textarea placeholder="Other Issues: No Signal on the monitor"></textarea>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsTech;
