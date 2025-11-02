// src/pages/ReportsTech.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Added for authenticated API requests
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/ReportsTech.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import AccountSettingLogo from "../assets/GearFill.png";
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon 

const ReportsTech = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // ✅ Dynamic states
  const [labs, setLabs] = useState([]);
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const [error, setError] = useState(null); // ✅ Added error state
  const [searchTerm, setSearchTerm] = useState(''); // ✅ Added for search functionality
  const [profile, setProfile] = useState(null); // ✅ Stores dynamic technician profile
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Added for auth
  const config = { headers: { Authorization: `Bearer ${token}` } }; // ✅ Axios config

  // ✅ Capture active link on render
  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line
  }, []);

  // ✅ Fetch technician profile for dynamic name
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/technician/profile");
        console.log("👤 Technician profile:", res.data);
        setProfile(res.data); // ✅ Store the profile for display
      } catch (err) {
        console.error("❌ fetchProfile error:", err);
      }
    }
    fetchProfile();
  }, []);

  // ✅ Sidebar navigation handler
  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // ✅ Fetch all labs on mount
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/labs", config);
        setLabs(res.data);
        setSelectedLab(res.data[0]?._id || null); // Auto-select first lab
      } catch (err) {
        setError("Unable to fetch labs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // ✅ Fetch units when selectedLab changes
  useEffect(() => {
    if (!selectedLab) return;

    const fetchUnits = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/technician/units?labId=${selectedLab}`, config);
        setUnits(res.data);
        setSelectedUnit(res.data[0]?._id || null); // Auto-select first unit
      } catch (err) {
        setError("Unable to fetch units");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [selectedLab]);

  // ✅ Fetch reports when selectedUnit changes
  useEffect(() => {
    if (!selectedUnit) return;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/technician/reports/unit/${selectedUnit._id}`, config);
        setReports(res.data);
        setSelectedReport(res.data[0] || null); // Auto-select first report
      } catch (err) {
        setError("Unable to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [selectedUnit]);

  // ✅ Filter units based on search term
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Reports</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">
            {profile ? `${profile.firstName || profile.username || ""} ${profile.lastName || ""}`.trim() : "Technician"}
          </span>
          <span className="profile-role">{profile?.role?.name || "Technician"}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        {/* ✅ Sidebar Navigation */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        {/* ✅ Main Content */}
        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">

            {/* ✅ Lab Panel */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports" onClick={createLab}>ADD LAB</button>
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

            {/* 🔧 Units Panel */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">
                  {labs.find(l => l._id === selectedLab)?.name || "Loading..."}
                </h2>
                <div className="search-bar-reports">
                  <input
                    type="text"
                    placeholder="Search units..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <p>Loading units...</p>
              ) : (
                <div className="report-cards-grid">
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((unit) => (
                      <div key={unit._id} className={`report-card ${unit._id === selectedUnit ? 'selected' : ''}`}
                        onClick={() => setSelectedUnit(unit)}
                        style={{ cursor: "pointer" }}
                      >
                        <span>{unit.name}</span>
                        <span className={`status-tag ${unit.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {unit.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No units available for this lab</p>
                  )}
                </div>
              )}
            </div>

            {/* ✅ Report Details Panel */}
            <div className="reports-tech-info-panel">
              <h2 className="panel-title">REPORTS</h2>

              {loading ? (
                <p>Loading reports...</p>
              ) : selectedReport ? (
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
