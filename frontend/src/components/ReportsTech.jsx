// src/pages/ReportsTech.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ NEW: To make API calls
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
  
  // ✅ NEW: Dynamic states
  const [labs, setLabs] = useState([]);
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // ✅ NEW: Fetch all labs on mount
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/labs");
        setLabs(res.data);
        setSelectedLab(res.data[0]?._id || null);
      } catch (err) {
        setError("Unable to fetch labs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // ✅ NEW: Fetch units when selectedLab changes
  useEffect(() => {
    if (!selectedLab) return;

    const fetchUnits = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/units/by-lab/${selectedLab}`);
        setUnits(res.data);
        setSelectedUnit(res.data[0]?._id || null); // Auto-select first unit in the lab
      } catch (err) {
        setError("Unable to fetch units");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [selectedLab]);

  // ✅ NEW: Fetch reports when selectedUnit changes
  useEffect(() => {
    if (!selectedUnit) return;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/reports/technician/unit/${selectedUnit}`);
        setReports(res.data);
        setSelectedReport(res.data[0] || null);
      } catch (err) {
        setError("Unable to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [selectedUnit]);

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
            <a href="/dashboard" className={`nav-link-dashboard`}>
              Dashboard
            </a>
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
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">
            
            {/* ✅ UPDATED: Lab List (Left Container) */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports">ADD LAB</button>
              <div className="lab-list-container-reports">
                {labs.map((lab) => (
                  <div key={lab._id} className={`lab-card-reports ${lab._id === selectedLab ? 'active' : ''}`}
                    onClick={() => setSelectedLab(lab._id)}
                  >
                    {lab.name}
                  </div>
                ))}
                <div className="lab-card-reports add-lab-card-reports">+</div>
              </div>
            </div>

            {/* ✅ UPDATED: Units List (Middle Container) */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">
                  {labs.find(l => l._id === selectedLab)?.name || "Loading..."}
                </h2>
                <div className="search-bar-reports">
                  <div className="search-input-wrapper-reports">
                    <img src={PersonLogo} alt="Search Icon" className="search-icon-reports" />
                    <input type="text" placeholder="Search units..." className="search-input" />
                  </div>
                </div>
              </div>
              <div className="report-cards-grid">
                {units.map((unit) => (
                  <div key={unit._id} className={`report-card ${unit._id === selectedUnit ? 'selected' : ''}`}
                    onClick={() => setSelectedUnit(unit._id)}
                  >
                    <span>{unit.name}</span>
                    <span className={`status-tag ${unit.status === 'out-of-order' ? 'out-of-order' : 'functional'}`}>
                      {unit.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ UPDATED: Report Details (Right Container) */}
            <div className="reports-tech-info-panel">
              <h2 className="panel-title">REPORTS</h2>
              {selectedReport ? (
                <>
                  <div className="report-detail-card-header">
                    <span>{selectedReport.unit.name}</span>
                    <span className={`status-tag ${selectedReport.unit.status === 'out-of-order' ? 'out-of-order' : 'functional'}`}>
                      {selectedReport.unit.status}
                    </span>
                  </div>
                  <div className="info-item-reports">
                    <span>Technician: {selectedReport.technician?.username || "N/A"}</span>
                  </div>
                  <div className="info-item-reports">
                    <span>Date Issued: {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item-reports">
                    <span>Status: {selectedReport.status}</span>
                  </div>
                  <div className="issues-checkbox-grid">
                    {Object.entries(selectedReport.issues).map(([key, value]) => (
                      <div key={key}>
                        <input type="checkbox" checked={value} disabled />
                        <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                      </div>
                    ))}
                  </div>
                  <div className="other-issues-textarea">
                    <textarea value={selectedReport.otherIssues || "No other issues"} readOnly />
                  </div>
                </>
              ) : (
                <p>Select a report to view details</p>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsTech;
