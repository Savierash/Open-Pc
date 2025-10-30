import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DashboardAdmin.css";
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
import HeadsetPurple from "../assets/headsetpurple.png";
import PersonCheckFill from "../assets/personcheckfill.png";
import PersonRed from "../assets/Personred.png";
import EnvelopeCheck from "../assets/envelopecheck.png"; // Tech Requests icon
import AdminTechnicians from "../components/AdminTechnicians";
import AdminTechRequests from "../components/AdminTechRequests"; // Import AdminTechRequests
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

const DashboardAdmin = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalUnits: 0,
    counts: { functional: 0, maintenance: 0, outOfOrder: 0 },
    percentFunctional: 0,
    perLab: [],
    recentUnits: [],
    trend: [],
    accounts: 0,
    accepted: 0,
    rejected: 0,
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

  const { totalUnits, counts, percentFunctional, perLab, recentUnits, trend, accounts, accepted, rejected } = data;

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
          <span className="page-title">Admin Dashboard</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">Admin Name</span> {/* Example Admin Name */}
          <span className="profile-role">Admin</span> {/* Example Admin Role */}
        </div>
      </header>

      <div className="main-layout three-column">
        {/* LEFT sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-admin" className={`sidebar-link ${activeLink === "/dashboard-admin" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/dashboard-admin');}}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            {/*
            <li><a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/inventory');}}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/unit-status-auditor" className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/unit-status-auditor');}}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === "/reports-auditor" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/reports-auditor');}}><img src={ClipboardLogo} className="menu-icon" alt="Reports" /><span>Reports</span></a></li>
            */}
            <li><a href="/admin-technicians" className={`sidebar-link ${activeLink === "/admin-technicians" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/admin-technicians');}}><img src={ToolsLogo} className="menu-icon" alt="Technicians" /><span>Technicians</span></a></li>
            <li><a href="/admin-profile" className={`sidebar-link ${activeLink === "/admin-profile" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/admin-profile');}}><img src={GearLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
            <li><a href="/admin-tech-requests" className={`sidebar-link ${activeLink === "/admin-tech-requests" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/admin-tech-requests');}}><img src={EnvelopeCheck} className="menu-icon" alt="Tech Requests" /><span>Tech Requests</span></a></li>
          </ul>
        </aside>

        {/* MAIN content */}
        <main className="main-content">
          {activeLink === "/admin-technicians" ? (
            <AdminTechnicians />
          ) : activeLink === "/admin-tech-requests" ? (
            <AdminTechRequests />
          ) : (
            <div className="dashboard-main-content">
              <div className="dashboard-cards">
                <div className="card accounts clickable-card" onClick={() => handleNavClick('/accounts')}>
                  <img src={HeadsetPurple} alt="Accounts Icon" className="card-icon" />
                  <div className="card-content">
                    <h3>Accounts</h3>
                    <p className="stat-number">{loading ? "..." : accounts}</p>
                  </div>
                </div>

                <div className="card accepted clickable-card" onClick={() => handleNavClick('/accepted')}>
                  <img src={PersonCheckFill} alt="Accepted Icon" className="card-icon" />
                  <div className="card-content">
                    <h3>Accepted</h3>
                    <p className="stat-number">{loading ? "..." : accepted}</p>
                  </div>
                </div>

                <div className="card rejected clickable-card" onClick={() => handleNavClick('/rejected')}>
                  <img src={PersonRed} alt="Rejected Icon" className="card-icon" />
                  <div className="card-content">
                    <h3>Rejected</h3>
                    <p className="stat-number">{loading ? "..." : rejected}</p>
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
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
