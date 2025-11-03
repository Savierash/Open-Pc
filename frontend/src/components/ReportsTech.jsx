// src/pages/ReportsTech.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";
import "../styles/ReportsTech.css";

// 🖼️ Assets
import ComputerLogo1 from "../assets/LOGO1.png";
import PersonLogo from "../assets/Person.png";
import HouseLogo from "../assets/HouseFill.png";
import AccountSettingLogo from "../assets/GearFill.png";
import MenuButtonWide from "../assets/menubuttonwide.png";
import ClipboardX from "../assets/clipboardx.png";

const ReportsTech = () => {
  const { user, accessToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [labs, setLabs] = useState([]);
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // 🧠 Wait for Auth to load first
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // ✅ Fetch labs when user is authenticated
  useEffect(() => {
    if (!user || !accessToken) return;
    fetchLabs();
  }, [user, accessToken]);

  // ✅ Fetch units when lab changes
  useEffect(() => {
    if (selectedLab) {
      fetchUnits(selectedLab);
    }
  }, [selectedLab]);

  // ✅ Fetch reports when unit changes
  useEffect(() => {
    if (selectedUnit) {
      fetchReports(selectedUnit);
    }
  }, [selectedUnit]);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/labs");
      setLabs(res.data || []);
      if (res.data.length > 0) setSelectedLab(res.data[0]._id);
    } catch (err) {
      console.error("fetchLabs error:", err);
      setError("Failed to fetch labs");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (labId) => {
    try {
      setLoading(true);
      const res = await api.get(`/technician/units?labId=${labId}`);
      setUnits(res.data || []);
      if (res.data.length > 0) setSelectedUnit(res.data[0]._id);
    } catch (err) {
      console.error("fetchUnits error:", err);
      setError("Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (unitId) => {
    try {
      setLoading(true);
      const res = await api.get(`/technician/reports/unit/${unitId}`);
      setReports(res.data || []);
      if (res.data.length > 0) setSelectedReport(res.data[0]);
    } catch (err) {
      console.error("fetchReports error:", err);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const filteredUnits = units.filter((unit) =>
    unit.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Reports</span>
        </div>

        {/* ✅ Dynamic Technician Info */}
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">
            {user
              ? `${user.firstName || user.username || ""} ${
                  user.lastName || ""
                }`.trim()
              : "Technician"}
          </span>
          <span className="profile-role">{user?.role?.name || "Technician"}</span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="main-layout three-column">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard-technician"
                className={`sidebar-link ${
                  activeLink === "/dashboard-technician" ? "active" : ""
                }`}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/unit-status-technician"
                className={`sidebar-link ${
                  activeLink === "/unit-status-technician" ? "active" : ""
                }`}
              >
                <img src={MenuButtonWide} className="menu-icon" alt="Unit Status" />
                <span>Unit Status</span>
              </a>
            </li>
            <li>
              <a
                href="/reports-tech"
                className={`sidebar-link ${
                  activeLink === "/reports-tech" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/reports-tech");
                }}
              >
                <img src={ClipboardX} alt="Reports Icon" className="menu-icon" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a
                href="/technician-profile"
                className={`sidebar-link ${
                  activeLink === "/technician-profile" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/technician-profile");
                }}
              >
                <img
                  src={AccountSettingLogo}
                  alt="Account Setting Icon"
                  className="menu-icon"
                />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content reports-tech-main-content">
          <div className="reports-tech-page-content">
            {/* ✅ Labs */}
            <div className="reports-tech-lab-panel">
              <button className="add-lab-button-reports">ADD LAB</button>
              <div className="lab-list-container-reports">
                {labs.map((lab) => (
                  <div
                    key={lab._id}
                    className={`lab-card-reports ${
                      lab._id === selectedLab ? "active" : ""
                    }`}
                    onClick={() => setSelectedLab(lab._id)}
                  >
                    {lab.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Units */}
            <div className="reports-tech-middle-panel">
              <div className="middle-panel-header-reports">
                <h2 className="panel-title">
                  {labs.find((l) => l._id === selectedLab)?.name || "Select a Lab"}
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

              <div className="report-cards-grid">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <div
                      key={unit._id}
                      className={`report-card ${
                        unit._id === selectedUnit ? "selected" : ""
                      }`}
                      onClick={() => setSelectedUnit(unit._id)}
                    >
                      <span>{unit.name}</span>
                      <span
                        className={`status-tag ${unit.status
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
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
              {loading ? (
                <p>Loading reports...</p>
              ) : reports.length > 0 ? (
                <>
                  <div className="report-list">
                    {reports.map((report) => (
                      <div
                        key={report._id}
                        className={`report-item ${
                          selectedReport?._id === report._id ? "active" : ""
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="report-header">
                          <strong>
                            {report.auditor?.username || "Auditor Unknown"}
                          </strong>
                        </div>
                        <div className="report-status">
                          Status: {report.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedReport && (
                    <div className="report-details">
                      <div className="report-detail-card-header">
                        <span>{selectedReport.unit.name}</span>
                        <span
                          className={`status-tag ${selectedReport.unit.status
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {selectedReport.unit.status}
                        </span>
                      </div>

                      <div className="info-item-reports">
                        <strong>Auditor:</strong>{" "}
                        {selectedReport.auditor?.username || "N/A"}
                      </div>
                      <div className="info-item-reports">
                        <strong>Technician:</strong>{" "}
                        {selectedReport.technician?.username || "N/A"}
                      </div>
                      <div className="info-item-reports">
                        <strong>Date:</strong>{" "}
                        {new Date(selectedReport.createdAt).toLocaleDateString()}
                      </div>
                      <div className="info-item-reports">
                        <strong>Status:</strong> {selectedReport.status}
                      </div>

                      {selectedReport.issues && (
                        <div className="issues-checkbox-grid">
                          {Object.entries(selectedReport.issues).map(
                            ([key, value]) => (
                              <div key={key}>
                                <input type="checkbox" checked={value} disabled />
                                <label>
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <textarea
                        className="other-issues-textarea"
                        value={selectedReport.otherIssues || "No other issues"}
                        readOnly
                      />
                    </div>
                  )}
                </>
              ) : (
                <p>No reports found for this unit</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsTech;
