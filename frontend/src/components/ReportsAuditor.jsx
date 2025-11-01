// src/pages/reports/ReportsAuditor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/icon_6.png'; // Inventory icon
import ToolsLogo from '../assets/tools_logo.png';
import SearchIcon from '../assets/Person.png';
import EditIcon from '../assets/GearFill.png';

// API base (Vite)
const RAW_API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');
import MenuButtonWide from '../assets/menubuttonwide.png'; // Unit Status icon
import ClipboardX from '../assets/clipboardx.png'; // Reports icon

const ReportsAuditor = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(window.location.pathname || '/reports-auditor');

  // data
  const [labs, setLabs] = useState([]); // { _id, name }
  const [units, setUnits] = useState([]); // [{ _id, name, status, ... }]

  // selection & UI
  const [selectedLab, setSelectedLab] = useState(null); // lab object
  const [selectedUnit, setSelectedUnit] = useState(null); // unit object
  const [selectedReport, setSelectedReport] = useState(null); // existing report if editing (optional)

  // form fields
  const [technicianId, setTechnicianId] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [lastIssued, setLastIssued] = useState('');
  const [otherIssues, setOtherIssues] = useState('');
  const [reportIssues, setReportIssues] = useState({
    ramIssue: false,
    osIssue: false,
    cpuIssue: false,
    noInternet: false,
    storageIssue: false,
    virus: false,
  });

  // loading & error
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/reports');
        setReports(res.data || []);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when selectedLab changes -> load units and reports
  useEffect(() => {
    if (selectedLab && selectedLab._id) {
      fetchUnitsByLab(selectedLab._id);
      fetchReportsByLab(selectedLab._id);
      // reset selections
      setSelectedUnit(null);
      setSelectedReport(null);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLab]);

  // when selectedUnit changes -> populate form from latest report for that unit (if any)
  useEffect(() => {
    if (!selectedUnit) {
      resetForm();
      setSelectedReport(null);
      return;
    }

    // find the most recent report for this unit (from reports state)
    const lastReport = reports.find(r => r.unit && r.unit._id === selectedUnit._id) || null;
    if (lastReport) {
      setSelectedReport(lastReport);
      setTechnicianId(lastReport.technicianId || '');
      setDateIssued(lastReport.dateIssued || '');
      setLastIssued(lastReport.lastIssued || '');
      setOtherIssues(lastReport.otherIssues || '');
      setReportIssues(lastReport.issues || {
        ramIssue: false, osIssue: false, cpuIssue: false, noInternet: false, storageIssue: false, virus: false
      });
    } else {
      // no previous report -> blank form
      setSelectedReport(null);
      setTechnicianId('');
      setDateIssued('');
      setLastIssued('');
      setOtherIssues('');
      setReportIssues({
        ramIssue: false, osIssue: false, cpuIssue: false, noInternet: false, storageIssue: false, virus: false
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnit]);

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // ---------- API calls ----------

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/labs`);
      setLabs(res.data || []);
      if (res.data && res.data.length > 0) {
        // choose previously selected lab name if exists, else first one
        const prefer = res.data.find(l => l.name === 'ITS 300') || res.data[0];
        setSelectedLab(prefer);
      }
    } catch (err) {
      console.error('Failed to fetch labs', err);
      window.alert('Failed to load labs. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitsByLab = async (labId) => {
    setLoading(true);
    try {
      // units route supports query param labId
      const res = await axios.get(`${API_BASE}/units?labId=${labId}`);
      setUnits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch units', err);
      window.alert('Failed to load units. See console.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportsByLab = async (labId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reports?labId=${labId}`);
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      window.alert('Failed to load reports. See console.');
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    if (!selectedLab || !selectedUnit) return window.alert('Please select a lab and a unit before submitting.');
    setSaving(true);
    try {
      const payload = {
        unit: selectedUnit._id,
        lab: selectedLab._id,
        technicianId,
        dateIssued,
        lastIssued,
        issues: reportIssues,
        otherIssues
      };

      // If editing an existing report (selectedReport), we update it instead:
      if (selectedReport && selectedReport._id) {
        await axios.put(`${API_BASE}/reports/${selectedReport._id}`, payload);
        window.alert('Report updated');
      } else {
        await axios.post(`${API_BASE}/reports`, payload);
        window.alert('Report submitted');
      }

      // refresh reports and units
      await fetchReportsByLab(selectedLab._id);
      await fetchUnitsByLab(selectedLab._id);

    } catch (err) {
      console.error('Failed to submit report', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit report';
      window.alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // ---------- helpers ----------
  function resetForm() {
    setTechnicianId('');
    setDateIssued('');
    setLastIssued('');
    setOtherIssues('');
    setReportIssues({ ramIssue: false, osIssue: false, cpuIssue: false, noInternet: false, storageIssue: false, virus: false });
  }

  // ---------- derived UI lists ----------
  const pcList = units.length > 0 ? units : []; // prioritize real units from DB
  // show filtered reports for selected lab (already in reports state)
  const filteredReports = reports;

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
              className={`nav-link-dashboard ${activeLink === '/dashboard' || activeLink === '/reports-auditor' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('/dashboard'); }}
            >
              Dashboard
            </a>
            <span className="logo-text">Reports</span>
          </nav>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span>
          <span className="profile-role">Auditor</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard" className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); handleNavClick('/dashboard');}}>
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/inventory" className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); handleNavClick('/inventory');}}>
                <img src={StackLogo} alt="Inventory Icon" className="menu-icon" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/reports-auditor" className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); handleNavClick('/reports-auditor');}}>
                <img src={ClipboardLogo} alt="Reports Auditor Icon" className="menu-icon" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/technicians" className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); handleNavClick('/technicians');}}>
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a href="/auditor-profile" className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`} onClick={(e)=>{e.preventDefault(); handleNavClick('/auditor-profile');}}>
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content reports-auditor-main-content">
          <div className="reports-auditor-page-content">
            {/* Left: Labs */}
            <div className="reports-auditor-lab-panel">
              <h2 className="panel-title">Lab</h2>
              <div className="lab-list-container-auditor">
                {loading ? <div>Loading labs...</div> : (
                  labs.map((lab) => (
                    <div
                      key={lab._id}
                      className={`lab-card-auditor ${selectedLab && selectedLab._id === lab._id ? 'active' : ''}`}
                      onClick={() => { setSelectedLab(lab); setSelectedPC(null); }}
                    >
                      {lab.name}
                    </div>
                  ))
                )}
                <div className="lab-card-auditor add-lab-card-auditor" onClick={() => {
                  const newName = window.prompt('New lab name');
                  if (!newName) return;
                  // create lab quickly
                  axios.post(`${API_BASE}/labs`, { name: newName.trim() }).then(res => {
                    setLabs(prev => [...prev, res.data]);
                    setSelectedLab(res.data);
                  }).catch(err => {
                    console.error('Failed to create lab', err);
                    window.alert(err?.response?.data?.message || 'Failed to create lab');
                  });
                }}>+</div>
              </div>
            </div>

            {/* Middle: Units / PCs */}
            <div className="reports-auditor-middle-panel">
              <div className="middle-panel-header-auditor">
                <h2 className="panel-title">{selectedLab ? selectedLab.name : 'Select a lab'}</h2>
                <div className="search-bar-auditor">
                  <div className="search-input-wrapper-auditor">
                    <img src={SearchIcon} alt="Search Icon" className="search-icon-auditor" />
                    <input type="text" placeholder="Search PC..." className="search-input" onChange={(e) => {
                      const q = e.target.value.toLowerCase();
                      // basic client-side filter: show units that match q or report ids
                      if (!q) {
                        fetchUnitsByLab(selectedLab?._id);
                      } else {
                        setUnits(prev => prev.filter(u => u.name.toLowerCase().includes(q)));
                      }
                    }} />
                  </div>
                </div>
              </div>

              <div className="report-cards-grid-auditor">
                {pcList.length === 0 ? <div className="placeholder">No units</div> : (
                  pcList.map(unit => (
                    <div
                      key={unit._id}
                      className={`report-card-auditor ${selectedUnit && selectedUnit._id === unit._id ? 'active' : ''}`}
                      onClick={() => setSelectedUnit(unit)}
                    >
                      <span>{unit.name}</span>
                      <span className={`status-tag-auditor ${unit.status ? unit.status.toLowerCase().replace(/ /g, '-') : 'functional'}`}>{unit.status || 'Functional'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Report Form / Details */}
            <div className="reports-auditor-info-panel">
              <h2 className="panel-title">REPORT SYSTEM</h2>

              <div className="report-detail-card-header-auditor">
                <span>{selectedUnit ? selectedUnit.name : 'ITS300-PC-XXX'}</span>
                <span className={`status-tag-auditor ${selectedUnit ? (selectedUnit.status || 'functional').toLowerCase().replace(/ /g, '-') : 'placeholder'}`}>{selectedUnit ? (selectedUnit.status || 'Functional') : 'Status'}</span>
              </div>

              <div className="info-item-auditor input-with-icon">
                <input type="text" placeholder="Technician ID:" value={technicianId} onChange={(e) => setTechnicianId(e.target.value)} />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>

              <div className="info-item-auditor input-with-icon">
                <input type="text" placeholder="Date Issued:" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>

              <div className="info-item-auditor input-with-icon">
                <input type="text" placeholder="Last Issued:" value={lastIssued} onChange={(e) => setLastIssued(e.target.value)} />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>

              <div className="issues-checkbox-grid-auditor">
                <label><input type="checkbox" checked={reportIssues.ramIssue} onChange={() => setReportIssues(prev => ({ ...prev, ramIssue: !prev.ramIssue }))} /> Ram Issue</label>
                <label><input type="checkbox" checked={reportIssues.osIssue} onChange={() => setReportIssues(prev => ({ ...prev, osIssue: !prev.osIssue }))} /> OS Issue</label>
                <label><input type="checkbox" checked={reportIssues.cpuIssue} onChange={() => setReportIssues(prev => ({ ...prev, cpuIssue: !prev.cpuIssue }))} /> CPU Issue</label>
                <label><input type="checkbox" checked={reportIssues.noInternet} onChange={() => setReportIssues(prev => ({ ...prev, noInternet: !prev.noInternet }))} /> No Internet</label>
                <label><input type="checkbox" checked={reportIssues.storageIssue} onChange={() => setReportIssues(prev => ({ ...prev, storageIssue: !prev.storageIssue }))} /> Storage Issue</label>
                <label><input type="checkbox" checked={reportIssues.virus} onChange={() => setReportIssues(prev => ({ ...prev, virus: !prev.virus }))} /> Virus</label>
              </div>

              <div className="other-issues-textarea-auditor">
                <textarea placeholder="Other Issues:" value={otherIssues} onChange={(e) => setOtherIssues(e.target.value)}></textarea>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="submit-report-button" onClick={submitReport} disabled={saving || !selectedUnit || !selectedLab}>
                  {saving ? 'SAVING...' : (selectedReport ? 'UPDATE REPORT' : 'SUBMIT REPORT')}
                </button>
               
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsAuditor;
