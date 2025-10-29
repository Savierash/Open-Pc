// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import GraphLogo from "../assets/GraphUp.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import GearLogo from "../assets/GearFill.png";
import OctagonLogo from "../assets/XOctagonFill.png";
import StackLogo from "../assets/Stack.png";
import PersonLogo from "../assets/Person.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png"; // Re-using GearFill for Account Setting
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalUnits: 0,
    counts: { functional: 0, maintenance: 0, outOfOrder: 0 },
    percentFunctional: 0,
    perLab: [],
    recentUnits: [],
    trend: [],
  });

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/dashboard`);
      setData(res.data || data);
    } catch (err) {
      console.error("fetchDashboard error:", err?.response ?? err);
      alert("Failed to load dashboard data. See console.");
    } finally {
      setLoading(false);
    }
  }

  const { totalUnits, counts, percentFunctional, perLab, recentUnits, trend } = data;

  // fallback trend data
  const mockTrend = [
    { date: "Mon", value: 60 },
    { date: "Tue", value: 70 },
    { date: "Wed", value: 75 },
    { date: "Thu", value: 80 },
    { date: "Fri", value: 78 },
    { date: "Sat", value: 82 },
    { date: "Sun", value: 85 },
  ];
  const chartData = trend?.length ? trend : mockTrend;

  const StatusChart = ({ dataPoints }) => (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#1b2630" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <YAxis domain={[0, 100]} axisLine={false} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#071019", border: "none", color: "#fff" }}
            formatter={(v) => `${v}%`}
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
    window.location.href = path;
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
          <nav className="nav-links-dashboard">
            <a href="/dashboard" className={`nav-link-dashboard active`}>
              Dashboard
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">John Paul</span> {/* Example Name */}
          <span className="profile-role">Auditor</span> {/* Example Role */}
        </div>
      </header>

      <div className="main-layout three-column">
        {/* LEFT sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === "/dashboard" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-auditor');}}><img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technicians" className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/technicians');}}><img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/auditor-profile');}}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        {/* MAIN content */}
        <main className="main-content">
          <div className="dashboard-main-content">
            <div className="dashboard-cards">
              <div className="card total-units clickable-card" onClick={() => handleNavClick('/total-units')}>
                <div className="card-header">
                  <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                  <h3>Total Units</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">{loading ? "..." : totalUnits}</p>
                </div>
              </div>

              <div className="card functional clickable-card" onClick={() => handleNavClick('/functional')}>
                <div className="card-header">
                  <img src={ClipboardLogo} alt="Clipboard Icon" className="card-icon" />
                  <h3>Functional</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">
                    {loading ? "..." : `${counts.functional} / ${totalUnits}`}
                  </p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percentFunctional}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="card maintenance clickable-card" onClick={() => handleNavClick('/maintenance')}>
                <div className="card-header">
                  <img src={GearLogo} alt="Gear Icon" className="card-icon" />
                  <h3>Maintenance</h3>
                </div>
                <div className="card-body">
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
                    <li style={{ padding: 8 }}>
                      {loading ? "Loading..." : "No recent activity"}
                    </li>
                  ) : (
                    recentUnits.map((u) => (
                      <li key={u._id} className="recent-item">
                        <strong>{u.name}</strong> —{" "}
                        <span style={{ textTransform: "capitalize" }}>{u.status}</span>
                        {u.lab?.name && <span> • {u.lab.name}</span>}
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {new Date(u.updatedAt).toLocaleString()}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* 🧠 System Status WITH Chart */}
              <div className="system-status-card card" style={{ flex: "0 0 35%" }}>
                <h3>System Status</h3>
                <p>Database: <strong>Connected</strong></p>
                <p>API: <strong>{loading ? "Loading..." : "OK"}</strong></p>

                <div style={{ marginTop: 12, background: "transparent" }}>
                  <StatusChart dataPoints={chartData} />
                </div>

                <div style={{ marginTop: 12, textAlign: "center", color: "#ccc" }}>
                  <strong>{percentFunctional}%</strong> functional
                </div>

                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <button onClick={fetchDashboard} className="btn small">
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
  