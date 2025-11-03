import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/AdminTechRequests.css";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import ToolsLogo from "../assets/tools_logo.png";
import GearLogo from "../assets/GearFill.png";
import PersonLogo from "../assets/Person.png";
import DocumentIcon from "../assets/icon_5.png";

const AdminTechRequests = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTechRequests();
  }, []);

  const fetchTechRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tech-requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError("Failed to load technician requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm("Accept this technician?")) return;
    try {
      await api.patch(`/tech-requests/${id}/accept`);
      alert("✅ Technician approved successfully!");
      fetchTechRequests();
    } catch (err) {
      console.error("Accept failed:", err);
      alert("Failed to approve technician.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this technician?")) return;
    try {
      await api.patch(`/tech-requests/${id}/reject`);
      alert("❌ Technician rejected.");
      fetchTechRequests();
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject technician.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard">
      {/* Top Bar */}
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
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">
            {localStorage.getItem("username") || "Admin"}
          </span>
          <span className="profile-role">Admin</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard-admin"
                className={`sidebar-link ${
                  activeLink === "/dashboard-admin" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/dashboard-admin");
                  navigate("/dashboard-admin");
                }}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-technicians"
                className={`sidebar-link ${
                  activeLink === "/admin-technicians" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/admin-technicians");
                  navigate("/admin-technicians");
                }}
              >
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a
                href="/admin-profile"
                className={`sidebar-link ${
                  activeLink === "/admin-profile" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/admin-profile");
                  navigate("/admin-profile");
                }}
              >
                <img src={GearLogo} className="menu-icon" alt="Settings" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search Requests</div>
            <div className="search-input-wrapper">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search technician by name or email"
                className="search-input"
              />
            </div>
          </div>

          <div className="technicians-page-content">
            {/* List Panel */}
            <div className="technicians-search-panel">
              {loading ? (
                <p>Loading requests...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : filteredRequests.length === 0 ? (
                <p>No pending technician requests found.</p>
              ) : (
                <ul className="technicians-list">
                  {filteredRequests.map((req) => (
                    <li
                      key={req._id}
                      className={`technician-list-item ${
                        selected && selected._id === req._id ? "selected" : ""
                      }`}
                      onClick={() => setSelected(req)}
                    >
                      <div>
                        <strong>
                          {req.firstName} {req.lastName}
                        </strong>
                        <p style={{ color: "#999", fontSize: 13 }}>
                          {req.email}
                        </p>
                      </div>
                      <span
                        className={`status-label ${req.status}`}
                        style={{
                          textTransform: "capitalize",
                          color:
                            req.status === "pending"
                              ? "orange"
                              : req.status === "accepted"
                              ? "green"
                              : "red",
                        }}
                      >
                        {req.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Detail Panel */}
            <div className="technicians-info-panel">
              {!selected ? (
                <p>Select a technician to view details</p>
              ) : (
                <>
                  <h2>
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <p>Email: {selected.email}</p>
                  <p>Contact: {selected.contactNo || "N/A"}</p>
                  <p>Status: {selected.status}</p>

                  <div className="documents-section">
                    <h3>Uploaded Documents</h3>
                    {selected.documents?.length ? (
                      selected.documents.map((file, idx) => (
                        <div key={idx} className="document-item">
                          <img
                            src={DocumentIcon}
                            alt="doc"
                            style={{ width: 32, marginRight: 8 }}
                          />
                          <a
                            href={`http://localhost:5000${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.split("/").pop()}
                          </a>
                        </div>
                      ))
                    ) : (
                      <p>No documents uploaded</p>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button
                      className="accept-button"
                      onClick={() => handleAccept(selected._id)}
                      disabled={selected.status === "accepted"}
                    >
                      Accept
                    </button>
                    <button
                      className="decline-button"
                      onClick={() => handleReject(selected._id)}
                      disabled={selected.status === "rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTechRequests;
