// src/pages/Dashboard.jsx
import api from "../api";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardTechnician.css"; // ✅ same layout styling for visual consistency

// 🖼️ Assets
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import GearLogo from "../assets/GearFill.png";
import MenuButtonWide from "../assets/menubuttonwide.png";
import ClipboardX from "../assets/clipboardx.png";
import StackLogo from "../assets/Stack.png";
import PersonLogo from "../assets/Person.png";
import ToolsLogo from "../assets/tools_logo.png";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken, loading: authLoading } = useAuth();

  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    totalUnits: 0,
    counts: { functional: 0, maintenance: 0, outOfOrder: 0 },
    percentFunctional: 0,
    perLab: [],
    recentUnits: [],
    trend: [],
  });

  // ✅ Load data after user and token available
  useEffect(() => {
    if (!authLoading && accessToken && user) {
      setActiveLink(window.location.pathname);
      fetchDashboard();
    }
  }, [authLoading, accessToken, user]);

  async function fetchDashboard() {
    try {
      setLoading(true);
      const res = await api.get("/auditor/dashboard", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const backendData = res.data || {};
      setData({
        totalUnits: backendData.totalUnits || 0,
        counts: backendData.counts || {
          functional: 0,
          maintenance: 0,
          outOfOrder: 0,
        },
        percentFunctional: backendData.percentFunctional || 0,
        perLab: backendData.perLab || [],
        recentUnits: backendData.recentUnits || [],
        trend: backendData.trend || [],
      });
    } catch (err) {
      console.error("❌ fetchDashboard error:", err?.response ?? err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Chart identical to Technician Dashboard
  const StatusChart = ({ dataPoints }) => (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataPoints}>
          <CartesianGrid stroke="#1b2630" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#071019",
              border: "none",
              color: "#fff",
            }}
            formatter={(v) => `${v}% Functional`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4, fill: "#38bdf8" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  const { totalUnits, counts, percentFunctional, recentUnits } = data;

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
          <span className="page-title">Auditor Dashboard</span>
        </div>

        {/* ✅ Display authenticated user info */}
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">
            {user
              ? `${user.firstName || user.username || ""} ${user.lastName || ""}`.trim()
              : "Auditor"}
          </span>
          <span className="profile-role">{user?.role?.name || "Auditor"}</span>
        </div>
      </header>

      {/* MAIN */}
      <div className="main-layout three-column">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a
                href="/dashboard"
                className={`sidebar-link ${activeLink === "/dashboard" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/dashboard");
                }}
              >
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/inventory"
                className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/inventory");
                }}
              >
                <img src={StackLogo} className="menu-icon" alt="Inventory" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a
                href="/reports-auditor"
                className={`sidebar-link ${
                  activeLink === "/reports-auditor" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/reports-auditor");
                }}
              >
                <img src={ClipboardX} className="menu-icon" alt="Reports" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a
                href="/technicians"
                className={`sidebar-link ${activeLink === "/technicians" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/technicians");
                }}
              >
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a
                href="/auditor-profile"
                className={`sidebar-link ${
                  activeLink === "/auditor-profile" ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/auditor-profile");
                }}
              >
                <img src={GearLogo} className="menu-icon" alt="Account Setting" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="dashboard-main-content">
            {error && <div className="error-box">⚠️ {error}</div>}

            <div className="dashboard-cards">
              <div className="card total-units clickable-card">
                <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Total Units</h3>
                  <p className="stat-number">{loading ? "..." : totalUnits}</p>
                </div>
              </div>

              <div className="card functional clickable-card">
                <img src={ClipboardLogo} alt="Clipboard Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Functional Units</h3>
                  <p className="stat-number">{loading ? "..." : counts.functional}</p>
                </div>
              </div>

              <div className="card maintenance clickable-card">
                <img src={ToolsLogo} alt="Tools Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Under Maintenance</h3>
                  <p className="stat-number">{loading ? "..." : counts.maintenance}</p>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="dashboard-bottom-row">
              <div className="recent-activity-card card" style={{ flex: "0 0 60%" }}>
                <h3>Recent Units</h3>
                <ul className="recent-list">
                  {recentUnits.length === 0 ? (
                    <li>{loading ? "Loading..." : "No recent activity"}</li>
                  ) : (
                    recentUnits.map((u) => (
                      <li key={u._id}>
                        <strong>{u.name}</strong> —{" "}
                        <span style={{ textTransform: "capitalize" }}>{u.status}</span>
                        {u.lab?.name && <span> • {u.lab.name}</span>}
                        <div className="timestamp">
                          {new Date(u.updatedAt).toLocaleString()}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="system-status-card card" style={{ flex: "0 0 35%" }}>
                <h3>System Status</h3>
                <p>Database: <strong>Connected</strong></p>
                <p>API: <strong>{loading ? "Loading..." : "OK"}</strong></p>
                <StatusChart dataPoints={data.trend || []} />
                <div className="status-summary">
                  <strong>{percentFunctional}%</strong> functional units
                </div>
                <button onClick={fetchDashboard} className="btn small">Refresh</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
