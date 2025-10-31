import api from '../api';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DashboardTechnician.css";
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

const DashboardTechnician = () => {
  
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ ADDED
  const [data, setData] = useState({
    totalUnits: 0,
    counts: { functional: 0, maintenance: 0, outOfOrder: 0 },
    percentFunctional: 0,
    perLab: [],
    recentUnits: [],
    trend: [],
  });

  const [profile, setProfile] = useState(null); // ✅ ADDED - show technician name dynamically

  function normalizeCounts(counts) {
  if (!counts) return { functional: 0, maintenance: 0, outOfOrder: 0 };
  return {
    functional: counts.Functional || counts.functional || 0,
    maintenance: counts.Maintenance || counts.maintenance || 0,
    outOfOrder: counts['Out Of Order'] || counts.outOfOrder || 0,
  };
}

  

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchDashboard();
    fetchProfile(); // ✅ ADDED
  }, []);
  
  async function fetchProfile() {
    try {
      const res = await api.get("/technician/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  }

async function fetchDashboard() {
  console.log("📡 Fetching dashboard...");

  try {
    const token = localStorage.getItem("token");
    console.log("🔑 Token found:", token ? "✅ Yes" : "❌ No");

    const res = await api.get("/technician/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Raw response from backend:", res);
    const backendData = res.data;
    console.log("📦 Parsed dashboard data:", backendData);

    if (!backendData || typeof backendData !== "object") {
      throw new Error("Invalid backend response format");
    }

    // Normalize data
    const normalizedCounts = normalizeCounts(backendData.counts);

    setData({
      totalUnits: backendData.totalUnits || 0,
      counts: normalizedCounts,
      percentFunctional: backendData.percentFunctional || 0,
      perLab: backendData.perLab || [],
      recentUnits: backendData.recentUnits || [],
      trend: backendData.trend || [],
    });

    console.log("🎯 Dashboard state updated successfully.");
  } catch (err) {
    console.error("fetchDashboard error:", err?.response ?? err);
    alert(err?.response?.data?.message || "Failed to load dashboard data. Please check console.");
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
            <a href="/dashboard-technician" className={`nav-link-dashboard ${activeLink === "/dashboard-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/dashboard-technician');}}>
              Technician Dashboard
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name"> {profile? `${profile.firstName || profile.username || ''} ${profile.lastName || ''}`.trim(): 'Technician'}</span>
          <span className="profile-role">{profile?.role?.name || "Technician"}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        {/* LEFT sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/dashboard-technician');}}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/unit-status-technician');}}><img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardLogo} className="menu-icon" alt="Reports Icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === "/technician-profile" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={GearLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        {/* MAIN content */}
        <main className="main-content">
          <div className="dashboard-main-content">
            {error && (
              <div
                style={{
                  background: "#ffcccc",
                  color: "#900",
                  padding: "8px 12px",
                  borderRadius: 6,
                  marginBottom: 12,
                }}
              >
                ⚠️ {error}
              </div>
            )}

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

export default DashboardTechnician;
