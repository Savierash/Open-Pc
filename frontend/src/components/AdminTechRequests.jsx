import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminTechRequests.css'; // Changed to AdminTechRequests.css
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png'; // Used for Tech Requests Icon
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import ToolsLogo from '../assets/tools_logo.png';
import CopyIcon from '../assets/copypaste.png'; // Copy icon for input fields
import EnvelopeCheck from '../assets/envelopecheck.png'; // Tech Requests icon
import DocumentIcon from '../assets/icon_5.png'; // Documents icon

const AdminTechRequests = () => { // Renamed component
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const navigate = useNavigate();

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
          <span className="page-title">Tech Requests</span>
        </div>
        <div className="nav-actions">
          <img 
            src={PersonLogo} 
            alt="Profile Icon" 
            className="profile-icon-dashboard"
          />
          <span className="profile-name">Paul Justin</span> {/* Example Name */}
          <span className="profile-role">Admin</span> {/* Example Role */}
        </div>
      </header>

      <div className="main-layout">   
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a 
                href="/dashboard-admin" 
                className={`sidebar-link ${activeLink === '/dashboard-admin' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/dashboard-admin');
                }}
              >
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-technicians" 
                className={`sidebar-link ${activeLink === '/admin-technicians' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-technicians');
                }}
              >
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-profile" 
                className={`sidebar-link ${activeLink === '/admin-profile' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-profile');
                }}
              >
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
            <li>
              <a 
                href="/admin-tech-requests" 
                className={`sidebar-link ${activeLink === '/admin-tech-requests' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/admin-tech-requests');
                }}
              >
                <img src={EnvelopeCheck} alt="Tech Requests Icon" className="menu-icon" />
                <span>Tech Requests</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search A Technician</div>
            <div className="search-input-wrapper">
              <input type="text" placeholder="Search A Technician" className="search-input" />
              <img src={PersonLogo} alt="Search Icon" className="search-icon" />
            </div>
            <h2 className="page-title">Technicians</h2>
          </div>
          <div className="technicians-page-content">
            <div className="technicians-search-panel">
              <div className="technicians-list">
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Suniga Richalle</span>
                    <img src={GearLogo} alt="Settings" className="settings-icon" />
                  </div>
                </div>
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Jaydon Estantino</span>
                    <img src={GearLogo} alt="Settings" className="settings-icon" />
                  </div>
                </div>
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Prince Layno</span>
                    <img src={GearLogo} alt="Settings" className="settings-icon" />
                  </div>
                </div>
              </div>
            </div>

            <div className="technicians-info-panel">
              <h2>Technician's Information</h2>
              <div className="technician-detail-card">
                <div className="technician-profile-header">
                  <img src={PersonLogo} alt="Profile Icon" className="profile-detail-icon" />
                  <h3>Prince Layno</h3>
                </div>
              </div>

              <label className="detail-label">Full name</label>
              <div className="detail-row-name">
                <input type="text" value="Prince" readOnly className="detail-input" />
                <input type="text" value="Layno" readOnly className="detail-input" />
              </div>
              
              <label className="detail-label contact-email-label">Contact Email</label>
              <label className="detail-label">Email</label>
              <div className="detail-row email-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value="LaynoPrince@gmail.com" readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>

              <div className="contact-documents-layout">
                <div className="contact-info-group">
                  <label className="detail-label">Contact No.</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input type="text" value="0932847737" readOnly className="detail-input" />
                      <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                    </div>
                  </div>
                  <label className="detail-label">Address</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input type="text" value="Dagupan USA Chicago" readOnly className="detail-input" />
                    </div>
                  </div>
                  <label className="detail-label">Tech ID:</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input type="text" value="00004" readOnly className="detail-input" />
                      <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                    </div>
                  </div>
                </div>
                
                {/* Documents Section */}
                <div className="documents-section">
                  <label className="detail-label">Documents</label>
                  <div className="document-box">
                    <img src={DocumentIcon} alt="Documents Icon" className="document-icon" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="accept-button">Accept</button>
                <button className="decline-button">Decline</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTechRequests;
