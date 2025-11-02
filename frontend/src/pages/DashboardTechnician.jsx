import api from '../api';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/DashboardTechnician.css";

// 🖼️ Assets
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import GearLogo from "../assets/GearFill.png";
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon
import OctagonLogo from "../assets/XOctagonFill.png";
import StackLogo from "../assets/Stack.png";
import PersonLogo from "../assets/Person.png";
import ToolsLogo from "../assets/tools_logo.png";

// 📊 Recharts for System Status visualization
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DashboardTechnician = () => {
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

  const [profile, setProfile] = useState(null); // 🆕 store technician profile data

  // 🧮 Normalizes backend data key names (avoids case mismatch)
  function normalizeCounts(counts) {
    if (!counts) return { functional: 0, maintenance: 0, outOfOrder: 0 };
    return {
      functional: counts.Functional || counts.functional || 0,
      maintenance: counts.Maintenance || counts.maintenance || 0,
      outOfOrder: counts["Out Of Order"] || counts.outOfOrder || 0,
    };
  }

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchDashboard();
    fetchProfile();
  }, []);

  // 🧑‍🔧 Fetch Technician Profile
  async function fetchProfile() {
    try {
      const res = await api.get("/technician/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("❌ fetchProfile error:", err);
    }
  }

  // 🧾 Fetch Dashboard Data
  async function fetchDashboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendData = res.data || {};
      const normalizedCounts = normalizeCounts(backendData.counts);

      setData({
        totalUnits: backendData.totalUnits || 0,
        counts: normalizedCounts,
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

  // 🧠 Chart (trend of functional percentage)
  const chartData =
    data.trend?.length > 0
      ? data.trend
      : [
          { date: "Mon", value: 60 },
          { date: "Tue", value: 72 },
          { date: "Wed", value: 68 },
          { date: "Thu", value: 80 },
          { date: "Fri", value: 75 },
          { date: "Sat", value: 85 },
          { date: "Sun", value: 90 },
        ];

  const StatusChart = ({ dataPoints }) => (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataPoints}>
          <CartesianGrid stroke="#1b2630" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#071019", border: "none", color: "#fff" }}
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

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // 🧾 Destructure data
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
          <span className="page-title">Technician Dashboard</span>
        </div>

        {/* ✅ Dynamic profile name and role */}
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">
            {profile
              ? `${profile.firstName || profile.username || ""} ${
                  profile.lastName || ""
                }`.trim()
              : "Technician"}
          </span>
          <span className="profile-role">{profile?.role?.name || "Technician"}</span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="main-layout three-column">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard-technician" className={`sidebar-link ${activeLink === "/dashboard-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/dashboard-technician');}}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/unit-status-technician" className={`sidebar-link ${activeLink === "/unit-status-technician" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/unit-status-technician');}}><img src={MenuButtonWide} className="menu-icon" alt="Unit Status" /><span>Unit Status</span></a></li>
            <li><a href="/reports-tech" className={`sidebar-link ${activeLink === '/reports-tech' ? 'active' : ''}`}onClick={(e) => {e.preventDefault();handleNavClick('/reports-tech');}}><img src={ClipboardX} className="menu-icon" alt="Reports Icon" /><span>Reports</span></a></li>
            <li><a href="/technician-profile" className={`sidebar-link ${activeLink === "/technician-profile" ? "active" : ""}`} onClick={(e) => {e.preventDefault();handleNavClick('/technician-profile');}}><img src={GearLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="dashboard-main-content">
            {error && (
              <div className="error-box">⚠️ {error}</div>
            )}

            {/* DASHBOARD CARDS */}
            <div className="dashboard-cards">
              <div className="card total-units clickable-card" onClick={() => handleNavClick('/total-units')}>
                <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Total Units</h3>
                  <p className="stat-number">{loading ? "..." : totalUnits}</p>
                </div>
              </div>

              <div className="card functional clickable-card" onClick={() => handleNavClick('/functional')}>
                <img src={ClipboardLogo} alt="Clipboard Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Functional Units</h3>
                  <p className="stat-number">{loading ? "..." : counts.functional}</p>
                </div>
              </div>

              <div className="card maintenance clickable-card" onClick={() => handleNavClick('/maintenance')}>
                <img src={ToolsLogo} alt="Tools Icon" className="card-icon" />
                <div className="card-content">
                  <h3>Under Maintenance</h3>
                  <p className="stat-number">{loading ? "..." : counts.maintenance}</p>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="dashboard-bottom-row">
              {/* Recent Units */}
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

              {/* System Status */}
              <div className="system-status-card card" style={{ flex: "0 0 35%" }}>
                <h3>System Status</h3>
                <p>Database: <strong>Connected</strong></p>
                <p>API: <strong>{loading ? "Loading..." : "OK"}</strong></p>
                <StatusChart dataPoints={chartData} />
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

export default DashboardTechnician;
