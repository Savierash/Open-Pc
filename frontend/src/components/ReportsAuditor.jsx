import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import ToolsLogo from '../assets/tools_logo.png';
import SearchIcon from '../assets/Person.png'; // Assuming Person.png is used as a search icon as in ReportsTech.jsx
import EditIcon from '../assets/GearFill.png'; // Using GearFill.png as an edit icon

const ReportsAuditor = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [selectedLab, setSelectedLab] = useState('ITS 300'); // State for active lab
  const [selectedPC, setSelectedPC] = useState(null); // State for selected PC to view details

  // State for editable fields
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

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  useEffect(() => {
    if (selectedPC) {
      setTechnicianId(selectedPC.technicianId || '');
      setDateIssued(selectedPC.dateIssued || '');
      setLastIssued(selectedPC.lastIssued || '');
      setOtherIssues(selectedPC.otherIssues || '');
      setReportIssues(selectedPC.issues || {
        ramIssue: false,
        osIssue: false,
        cpuIssue: false,
        noInternet: false,
        storageIssue: false,
        virus: false,
      });
    } else {
      // Reset to empty for placeholder
      setTechnicianId('');
      setDateIssued('');
      setLastIssued('');
      setOtherIssues('');
      setReportIssues({
        ramIssue: false,
        osIssue: false,
        cpuIssue: false,
        noInternet: false,
        storageIssue: false,
        virus: false,
      });
    }
  }, [selectedPC]);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const labs = ['PTC 201', 'MCLAB', 'ITS 300']; // Sample labs
  const pcReports = [ // Sample PC reports
    { id: 'ITS300-PC-001', status: 'Functional' },
    { id: 'ITS300-PC-002', status: 'Out Of Order', technicianId: '01593', dateIssued: 'October 22, 2025', lastIssued: 'September 1, 2025', issues: { ramIssue: true, osIssue: true, cpuIssue: false, noInternet: true, storageIssue: false, virus: false }, otherIssues: 'No Signal on the monitor' },
    { id: 'ITS300-PC-003', status: 'Maintenance' },
    { id: 'ITS300-PC-004', status: 'Functional' },
    { id: 'ITS300-PC-005', status: 'Functional' },
    { id: 'ITS300-PC-006', status: 'Functional' },
    { id: 'ITS300-PC-007', status: 'Functional' },
    { id: 'ITS300-PC-008', status: 'Maintenance' },
    { id: 'ITS300-PC-009', status: 'Maintenance' },
    { id: 'ITS300-PC-010', status: 'Out Of Order', technicianId: '01594', dateIssued: 'October 20, 2025', lastIssued: 'August 28, 2025', issues: { ramIssue: false, osIssue: false, cpuIssue: true, noInternet: false, storageIssue: true, virus: false }, otherIssues: 'Hard drive failure' },
  ];

  const filteredPcReports = pcReports.filter(report => report.id.startsWith(selectedLab));

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
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Dashboard
            </a>
            <span className="logo-text">Reports</span> {/* Add Reports text */}
          </nav>
        </div>
        <div className="nav-actions">
          <img 
            src={PersonLogo} 
            alt="Profile Icon" 
            className="profile-icon-dashboard"
          />
          <span className="profile-name">John Paul</span> {/* Example Name */}
          <span className="profile-role">Auditor</span> {/* Example Role */}
        </div>
      </header>

      <div className="main-layout three-column">
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
                href="/unit-status-auditor" 
                className={`sidebar-link ${activeLink === '/unit-status-auditor' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/unit-status-auditor');
                }}
              >
                <img src={PcDisplayLogo} alt="Unit Status Icon" className="menu-icon" />
                <span>Unit Status</span>
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
                <img src={ClipboardLogo} alt="Reports Auditor Icon" className="menu-icon" />
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
            <li>
              <a 
                href="/auditor-profile" 
                className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/auditor-profile');
                }}
              >
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content reports-auditor-main-content">
          <div className="reports-auditor-page-content">
            {/* Left Container: Lab List */}
            <div className="reports-auditor-lab-panel">
              <h2 className="panel-title">Lab</h2>
              <div className="lab-list-container-auditor">
                {labs.map((lab) => (
                  <div 
                    key={lab} 
                    className={`lab-card-auditor ${selectedLab === lab ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedLab(lab);
                      setSelectedPC(null); // Reset selected PC when changing lab
                    }}
                  >
                    {lab}
                  </div>
                ))}
                <div className="lab-card-auditor add-lab-card-auditor">+</div>
              </div>
            </div>

            {/* Middle Container: PC Reports List */}
            <div className="reports-auditor-middle-panel">
              <div className="middle-panel-header-auditor">
                <h2 className="panel-title">{selectedLab}</h2>
                <div className="search-bar-auditor">
                  <div className="search-input-wrapper-auditor">
                    <img src={SearchIcon} alt="Search Icon" className="search-icon-auditor" />
                    <input type="text" placeholder="" className="search-input" />
                  </div>
                </div>
              </div>
              <div className="report-cards-grid-auditor">
                {filteredPcReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="report-card-auditor"
                    onClick={() => setSelectedPC(report)}
                  >
                    <span>{report.id}</span>
                    <span className={`status-tag-auditor ${report.status.toLowerCase().replace(/ /g, '-')}`}>{report.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Container: Report Details */}
            <div className="reports-auditor-info-panel">
              <h2 className="panel-title">REPORT SYSTEM</h2>
              <div className="report-detail-card-header-auditor">
                <span>{selectedPC ? selectedPC.id : 'ITS300-PC-XXX'}</span>
                <span className={`status-tag-auditor ${selectedPC ? selectedPC.status.toLowerCase().replace(/ /g, '-') : 'placeholder'}`}>{selectedPC ? selectedPC.status : 'Status'}</span>
              </div>
              <div className="info-item-auditor input-with-icon">
                <input 
                  type="text" 
                  placeholder="Technician ID:"
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>
              <div className="info-item-auditor input-with-icon">
                <input 
                  type="text" 
                  placeholder="Date Issued:"
                  value={dateIssued}
                  onChange={(e) => setDateIssued(e.target.value)}
                />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>
              <div className="info-item-auditor input-with-icon">
                <input 
                  type="text" 
                  placeholder="Last Issued:"
                  value={lastIssued}
                  onChange={(e) => setLastIssued(e.target.value)}
                />
                <img src={EditIcon} alt="Edit Icon" className="input-icon" />
              </div>
              <div className="issues-checkbox-grid-auditor">
                <div>
                  <input type="checkbox" id="ramIssue" checked={reportIssues.ramIssue} onChange={() => setReportIssues(prev => ({...prev, ramIssue: !prev.ramIssue}))} />
                  <label htmlFor="ramIssue">Ram Issue</label>
                </div>
                <div>
                  <input type="checkbox" id="osIssue" checked={reportIssues.osIssue} onChange={() => setReportIssues(prev => ({...prev, osIssue: !prev.osIssue}))} />
                  <label htmlFor="osIssue">OS Issue</label>
                </div>
                <div>
                  <input type="checkbox" id="cpuIssue" checked={reportIssues.cpuIssue} onChange={() => setReportIssues(prev => ({...prev, cpuIssue: !prev.cpuIssue}))} />
                  <label htmlFor="cpuIssue">CPU Issue</label>
                </div>
                <div>
                  <input type="checkbox" id="noInternet" checked={reportIssues.noInternet} onChange={() => setReportIssues(prev => ({...prev, noInternet: !prev.noInternet}))} />
                  <label htmlFor="noInternet">No Internet</label>
                </div>
                <div>
                  <input type="checkbox" id="storageIssue" checked={reportIssues.storageIssue} onChange={() => setReportIssues(prev => ({...prev, storageIssue: !prev.storageIssue}))} />
                  <label htmlFor="storageIssue">Storage Issue</label>
                </div>
                <div>
                  <input type="checkbox" id="virus" checked={reportIssues.virus} onChange={() => setReportIssues(prev => ({...prev, virus: !prev.virus}))} />
                  <label htmlFor="virus">Virus</label>
                </div>
              </div>
              <div className="other-issues-textarea-auditor">
                <textarea 
                  placeholder="Other Issues:"
                  value={otherIssues}
                  onChange={(e) => setOtherIssues(e.target.value)}
                ></textarea>
              </div>
              <button className="submit-report-button">Submit Report</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsAuditor;
