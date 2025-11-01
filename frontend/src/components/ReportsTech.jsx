// src/pages/reports/ReportsTech.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css'; // Import dashboard styles
import '../styles/ReportsTech.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import AccountSettingLogo from "../assets/GearFill.png";

// API base (Vite)
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon 

const ReportsTech = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  // data
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);

  // UI / selection
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(false);

  // report fields (display-only in this component)
  const [reportIssues, setReportIssues] = useState({
    ramIssue: true,
    osIssue: true,
    cpuIssue: false,
    noInternet: true,
    storageIssue: false,
    virus: false,
  });
  const [technicianId, setTechnicianId] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [lastIssued, setLastIssued] = useState('');
  const [otherIssues, setOtherIssues] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line
  }, []);

  // when lab changes -> fetch units and reports
  useEffect(() => {
    if (!selectedLab || !selectedLab._id) return;
    fetchUnits(selectedLab._id);
    fetchReports(selectedLab._id);
    setSelectedReport(null);
    // eslint-disable-next-line
  }, [selectedLab]);

  // ---------- API calls ----------
  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      const list = res.data || [];
      setLabs(list);
      // prefer ITS 300 if present
      const prefer = list.find(l => l.name && l.name.toLowerCase().includes('its 300')) || list[0] || null;
      setSelectedLab(prefer);
    } catch (err) {
      console.error('Failed to fetch labs', err);
      window.alert('Failed to load labs — check backend. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (labId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/units?labId=${labId}`);
      setUnits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch units', err);
      window.alert('Failed to load units — check backend. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (labId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reports?labId=${labId}`);
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      window.alert('Failed to load reports — check backend. See console.');
    } finally {
      setLoading(false);
    }
  };

  const createLab = async () => {
    const name = window.prompt('New lab name');
    if (!name) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/labs`, { name: name.trim() });
      setLabs(prev => [...prev, res.data]);
      setSelectedLab(res.data);
    } catch (err) {
      console.error('Failed to create lab', err);
      window.alert(err?.response?.data?.message || 'Failed to create lab');
    } finally {
      setLoading(false);
    }
  };

  // load a report into right panel
  const loadReport = (r) => {
    setSelectedReport(r);
    setTechnicianId(r.technicianId || '');
    setDateIssued(r.dateIssued || '');
    setLastIssued(r.lastIssued || '');
    setOtherIssues(r.otherIssues || '');
    setReportIssues(r.issues || {
      ramIssue: false, osIssue: false, cpuIssue: false, noInternet: false, storageIssue: false, virus: false
    });
  };

  // client-side search filter for middle panel
  const filteredReportCards = (searchQ || '').trim() === '' 
    ? reports 
    : reports.filter(r => (r.unit && r.unit.name && r.unit.name.toLowerCase().includes(searchQ.toLowerCase())) || (r.otherIssues && r.otherIssues.toLowerCase().includes(searchQ.toLowerCase())));

  // UI navigation
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
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardX} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === '/technician-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">
            {/* Left Container: Lab List */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports" onClick={createLab}>ADD LAB</button>
              <div className="lab-list-container-reports">
                {loading && labs.length === 0 ? <div>Loading labs...</div> : (
                  <>
                    {labs.map(l => (
                      <div
                        key={l._id}
                        className={`lab-card-reports ${selectedLab && selectedLab._id === l._id ? 'active' : ''}`}
                        onClick={() => setSelectedLab(l)}
                        style={{ cursor: 'pointer' }}
                      >
                        {l.name}
                      </div>
                    ))}
                    <div className="lab-card-reports add-lab-card-reports" onClick={createLab}>+</div>
                  </>
                )}
              </div>
            </div>

            {/* Middle Container: PC Reports List */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">{selectedLab ? selectedLab.name : 'Select a lab'}</h2>
                <div className="search-bar-reports">
                  <div className="search-input-wrapper-reports">
                    <img src={PersonLogo} alt="Search Icon" className="search-icon-reports" />
                    <input type="text" placeholder="Search PC or notes..." className="search-input" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="report-cards-grid">
                {filteredReportCards.length === 0 ? <div className="placeholder">No reports</div> : (
                  filteredReportCards.map(r => (
                    <div key={r._id} className="report-card" style={{ cursor: 'pointer' }} onClick={() => loadReport(r)}>
                      <span>{r.unit?.name || 'Unknown'}</span>
                      <span className={`status-tag ${r.status ? (r.status === 'Out Of Order' ? 'out-of-order' : '') : ''}`}>{r.status || 'Status'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Container: Report Details */}
            <div className="reports-tech-info-panel">
              <h2 className="panel-title">REPORTS</h2>

              <div className="report-detail-card-header">
                <span>{selectedReport?.unit?.name || 'ITS300-PC-002'}</span>
                <span className={`status-tag ${selectedReport?.status === 'Out Of Order' ? 'out-of-order' : ''}`}>{selectedReport?.status || 'Status'}</span>
              </div>

              <div className="info-item-reports">
                <span>Technician ID: {technicianId || '—'}</span>
              </div>
              <div className="info-item-reports">
                <span>Date Issued: {dateIssued || '—'}</span>
              </div>
              <div className="info-item-reports">
                <span>Last Issued: {lastIssued || '—'}</span>
              </div>

              <div className="issues-checkbox-grid">
                <label><input type="checkbox" checked={!!reportIssues.ramIssue} onChange={() => {}} disabled /> Ram Issue</label>
                <label><input type="checkbox" checked={!!reportIssues.osIssue} onChange={() => {}} disabled /> OS Issue</label>
                <label><input type="checkbox" checked={!!reportIssues.cpuIssue} onChange={() => {}} disabled /> CPU Issue</label>
                <label><input type="checkbox" checked={!!reportIssues.noInternet} onChange={() => {}} disabled /> No Internet</label>
                <label><input type="checkbox" checked={!!reportIssues.storageIssue} onChange={() => {}} disabled /> Storage Issue</label>
                <label><input type="checkbox" checked={!!reportIssues.virus} onChange={() => {}} disabled /> Virus</label>
              </div>

              <div className="other-issues-textarea">
                <textarea value={otherIssues || 'No Signal on the monitor'} readOnly />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsTech;
