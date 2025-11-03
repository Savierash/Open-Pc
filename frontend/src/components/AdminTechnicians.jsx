// src/pages/AdminTechnicians.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminTechnicians.css";
import ComputerLogo1 from "../assets/LOGO1.png";
import PersonLogo from "../assets/Person.png";
import HouseLogo from "../assets/HouseFill.png";
import GearLogo from "../assets/GearFill.png";
import ToolsLogo from "../assets/tools_logo.png";
import CopyIcon from "../assets/copypaste.png";
import EnvelopeCheck from "../assets/envelopecheck.png";

// --- Configure API client ---
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem("accessToken");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (err) => Promise.reject(err)
);

// ✅ Fetch technicians (only verified + active)
export async function fetchTechniciansFromApi(apiClient = api) {
  try {
    const res = await apiClient.get("/admin/admin/technicians");
    const found = res?.data;

    if (!found || !Array.isArray(found)) return [];

    return found.map((u) => ({
      _id: u._id || u.id || "",
      username: u.name || u.username || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      email: u.email || "",
      phone: u.contact || "",
      address: u.address || "",
      techId: u.techId || "",
    }));
  } catch (err) {
    console.error("Failed to fetch technicians:", err);
    return [];
  }
}

const AdminTechnicians = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname || "/admin-technicians");
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveLink(window.location.pathname);
    loadTechnicians();
  }, []);

  async function loadTechnicians() {
    setLoading(true);
    setError("");
    try {
      const list = await fetchTechniciansFromApi(api);
      setTechnicians(list || []);
      setSelectedTech(list && list.length ? list[0] : null);
    } catch (err) {
      console.error("Failed to load technicians", err);
      setError("Failed to load technicians — check console for details.");
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = technicians.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.username || "").toLowerCase().includes(q) ||
      (t.email || "").toLowerCase().includes(q) ||
      (t.phone || "").toLowerCase().includes(q) ||
      (t._id || "").toLowerCase().includes(q)
    );
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text || "");
      console.info("Copied:", text);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Technicians</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{localStorage.getItem("username") || "User"}</span>
          <span className="profile-role">{localStorage.getItem("userRole") || "Role"}</span>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard-admin"
                className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/dashboard-admin");
                  navigate("/dashboard-admin");
                }}
              >
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </a>
            </li>

            <li>
              <a
                href="/admin-technicians"
                className={`sidebar-link ${activeLink === "/admin-technicians" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/admin-technicians");
                  navigate("/admin-technicians");
                }}
              >
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>

            <li>
              <a
                href="/admin-profile"
                className={`sidebar-link ${activeLink === "/admin-profile" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/admin-profile");
                  navigate("/admin-profile");
                }}
              >
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>

            <li>
              <a
                href="/admin-tech-requests"
                className={`sidebar-link ${activeLink === "/admin-tech-requests" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLink("/admin-tech-requests");
                  navigate("/admin-tech-requests");
                }}
              >
                <img src={EnvelopeCheck} alt="Tech Requests Icon" className="menu-icon" />
                <span>Tech Requests</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search A Technician</div>
            <div className="search-input-wrapper">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search A Technician"
                className="search-input"
              />
              <img src={PersonLogo} alt="Search Icon" className="search-icon" />
            </div>
            <h2 className="page-title">Technicians</h2>
          </div>

          <div className="technicians-page-content">
            {/* Technician List */}
            <div className="technicians-search-panel">
              <div className="technicians-list">
                {loading ? (
                  <div style={{ padding: 12, color: "#ccc" }}>Loading technicians...</div>
                ) : error ? (
                  <div style={{ padding: 12, color: "salmon" }}>{error}</div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: 12, color: "#999" }}>No technicians found</div>
                ) : (
                  filtered.map((t) => (
                    <div
                      key={t._id}
                      className={`technician-list-item ${
                        selectedTech && selectedTech._id === t._id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedTech(t)}
                    >
                      <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                      <div className="technician-name-and-id">
                        <span>{t.username}</span>
                        <span className="technician-id">{String(t.techId || "").slice(-5)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Technician Details */}
            <div className="technicians-info-panel">
              <h2>Technician's Information</h2>

              {!selectedTech ? (
                <div style={{ padding: 12, color: "#777" }}>
                  {loading ? "Loading..." : "Select a technician"}
                </div>
              ) : (
                <>
                  <div className="technician-detail-card">
                    <div className="technician-profile-header">
                      <img src={PersonLogo} alt="Profile Icon" className="profile-detail-icon" />
                      <h3>{selectedTech.username}</h3>
                    </div>
                  </div>

                  <label className="detail-label">Full name</label>
                  <div className="detail-row-name">
                    <input
                      type="text"
                      value={(selectedTech.username || "").split(" ")[0] || ""}
                      readOnly
                      className="detail-input"
                    />
                    <input
                      type="text"
                      value={(selectedTech.username || "").split(" ").slice(1).join(" ") || ""}
                      readOnly
                      className="detail-input"
                    />
                  </div>

                  <label className="detail-label contact-email-label">Contact Information</label>

                  <label className="detail-label">Email</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input
                        type="text"
                        value={selectedTech.email || ""}
                        readOnly
                        className="detail-input"
                      />
                      <img
                        src={CopyIcon}
                        alt="Copy Icon"
                        className="copy-icon"
                        onClick={() => copyToClipboard(selectedTech.email || "")}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <label className="detail-label">Contact No.</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input
                        type="text"
                        value={selectedTech.phone || ""}
                        readOnly
                        className="detail-input"
                      />
                      <img
                        src={CopyIcon}
                        alt="Copy Icon"
                        className="copy-icon"
                        onClick={() => copyToClipboard(selectedTech.phone || "")}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <label className="detail-label">Address</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input
                        type="text"
                        value={selectedTech.address || ""}
                        readOnly
                        className="detail-input"
                      />
                    </div>
                  </div>

                  <label className="detail-label">Tech ID:</label>
                  <div className="detail-row">
                    <div className="input-with-icon-wrapper">
                      <input
                        type="text"
                        value={selectedTech.techId || ""}
                        readOnly
                        className="detail-input"
                      />
                      <img
                        src={CopyIcon}
                        alt="Copy Icon"
                        className="copy-icon"
                        onClick={() => copyToClipboard(selectedTech.techId || "")}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
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

export default AdminTechnicians;
