// src/pages/ReportsTech.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Dashboard.css';
import '../styles/ReportsTech.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from "../assets/HouseFill.png";
import AccountSettingLogo from "../assets/GearFill.png";
import MenuButtonWide from "../assets/menubuttonwide.png";
import ClipboardX from "../assets/clipboardx.png";

const ReportsTech = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]);
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // 🧠 Guard rendering during Auth initialization
  if (authLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#ccc" }}>
        Loading authentication...
      </div>
    );
  }

  // 🧠 If user is missing after auth loads, redirect after a short delay
  if (!user) {
    useEffect(() => {
      const timer = setTimeout(() => navigate('/login'), 800);
      return () => clearTimeout(timer);
    }, [navigate]);

    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "salmon" }}>
        Redirecting to login...
      </div>
    );
  }

  // ✅ Fetch technician profile only after user is ready
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/technician/profile");
        console.log("👤 Technician profile:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("❌ fetchProfile error:", err);
      }
    };
    fetchProfile();
  }, [user]);

  // ✅ Fetch labs only after user exists
  useEffect(() => {
    if (!user) return;
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/labs");
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
  }, [user]);

  // ✅ Fetch units when lab changes
  useEffect(() => {
    if (!selectedLab || !user) return;
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/technician/units?labId=${selectedLab}`);
        setUnits(res.data);
        setSelectedUnit(res.data[0]?._id || null);
      } catch (err) {
        setError("Unable to fetch units");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [selectedLab, user]);

  // ✅ Fetch reports when unit changes
  useEffect(() => {
    if (!selectedUnit || !user) return;
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/technician/reports/unit/${selectedUnit}`);
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
  }, [selectedUnit, user]);

  const filteredUnits = units.filter(unit =>
    unit.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">

            {/* ✅ Labs */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports">ADD LAB</button>
              <div className="lab-list-container-reports">
                {labs.map((lab) => (
                  <div key={lab._id} className={`lab-card-reports ${lab._id === selectedLab ? 'active' : ''}`} onClick={() => setSelectedLab(lab._id)}>
                    {lab.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Units */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">{labs.find(l => l._id === selectedLab)?.name || "Select a Lab"}</h2>
                <div className="search-bar-reports">
                  <input type="text" placeholder="Search units..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="report-cards-grid">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <div key={unit._id} className={`report-card ${unit._id === selectedUnit ? 'selected' : ''}`} onClick={() => setSelectedUnit(unit._id)}>
                      <span>{unit.name}</span>
                      <span className={`status-tag ${unit.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {unit.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No units available</p>
                )}
              </div>
            </div>

            {/* ✅ Reports */}
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
                  <div className="info-item-reports"><span>Technician: {selectedReport.technician?.username || "N/A"}</span></div>
                  <div className="info-item-reports"><span>Date Issued: {new Date(selectedReport.createdAt).toLocaleDateString()}</span></div>
                  <div className="info-item-reports"><span>Status: {selectedReport.status}</span></div>
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
