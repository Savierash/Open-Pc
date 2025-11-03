// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; //
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api';
import "../styles/Dashboard.css";
import ComputerLogo1 from "../assets/LOGO1.png";
import HouseLogo from "../assets/HouseFill.png";
import PcDisplayLogo from "../assets/PcDisplayHorizontal.png";
import ClipboardLogo from "../assets/ClipboardCheck.png";
import GearLogo from "../assets/GearFill.png";
import OctagonLogo from "../assets/XOctagonFill.png";
import StackLogo from "../assets/icon_6.png"; // Inventory icon
import PersonLogo from "../assets/Person.png";
import ToolsLogo from "../assets/tools_logo.png";
import AccountSettingLogo from "../assets/GearFill.png"; // Re-using GearFill for Account Setting
import MenuButtonWide from "../assets/menubuttonwide.png"; // Unit Status icon
import ClipboardX from "../assets/clipboardx.png"; // Reports icon
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
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait for context to finish loading

    if (!accessToken || user?.role?.toLowerCase() !== "auditor") {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, [user, accessToken, loading, navigate]);

  const [activeLink, setActiveLink] = useState(window.location.pathname || "/dashboard");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false); // ✅ renamed to avoid conflict

  const [totalUnits, setTotalUnits] = useState(0);
  const [counts, setCounts] = useState({ functional: 0, maintenance: 0, outOfOrder: 0 });
  const [percentFunctional, setPercentFunctional] = useState(0);
  const [perLab, setPerLab] = useState([]);
  const [recentUnits, setRecentUnits] = useState([]);
  const [trend, setTrend] = useState([]);

  async function fetchDashboard() {
    setIsDashboardLoading(true);
    try {
      const res = await api.get('/auditor/dashboard');
      const data = res.data;

      setTotalUnits(data.totalUnits || 0);
      setCounts(data.counts || { functional: 0, maintenance: 0, outOfOrder: 0 });
      setPercentFunctional(data.percentFunctional || 0);
      setPerLab(data.perLab || []);
      setRecentUnits(data.recentUnits || []);
      setTrend(data.trend || []);
    } catch (err) {
      console.error("fetchDashboard error:", err);
      window.alert("Failed to load dashboard data. See console.");
    } finally {
      setIsDashboardLoading(false);
    }
  }

  // improved StatusChart for dark background & reliable height
  const StatusChart = ({ dataPoints = [] }) => {
    const data = (Array.isArray(dataPoints) ? dataPoints : []).map(d => ({
      date: d.date || '',
      value: typeof d.value === 'number' ? d.value : Number(d.value) || 0
    }));

    if (!data.length) {
      // Render a small placeholder so container still occupies space
      return (
        <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa7b2' }}>
          <div>No trend data available</div>
        </div>
      );
    }

    const values = data.map(d => d.value);
    const maxVal = values.length ? Math.max(...values) : 100;
    const minVal = values.length ? Math.min(...values) : 0;
    // small padding so line isn't flush to edges
    const pad = Math.max(5, Math.round((maxVal - minVal) * 0.12));
    const domainTop = Math.max(100, maxVal + pad);
    const domainBottom = Math.max(0, minVal - pad);

    const CustomTooltipSmall = ({ active, payload }) => {
      if (!active || !payload || !payload.length) return null;
      const p = payload[0];
      return (
        <div style={{
          background: 'rgba(8,12,16,0.95)',
          color: '#fff',
          padding: 8,
          borderRadius: 6,
          boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
          fontSize: 12,
          minWidth: 90,
        }}>
          <div style={{ fontWeight: 700 }}>{p.payload.date}</div>
          <div style={{ opacity: 0.9 }}>{p.value}</div>
        </div>
      );
    };

    return (
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, left: -8, bottom: 6 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12 }}
              interval="preserveStartEnd"
              padding={{ left: 6, right: 6 }}
            />
            <YAxis
              domain={[domainBottom, domainTop]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltipSmall />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={3}
              dot={{ r: 5, stroke: '#0b1220', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 7 }}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

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
          <span className="page-title">Dashboard</span>
        </div>
        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">{localStorage.getItem('username') || 'User'}</span>
          <span className="profile-role">{localStorage.getItem('userRole') || 'Role'}</span>
        </div>
      </header>

      <div className="main-layout three-column">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><a href="/dashboard" className={`sidebar-link ${activeLink === "/dashboard" ? "active" : ""}`}><img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span></a></li>
            <li><a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`}><img src={StackLogo} className="menu-icon" alt="Inventory" /><span>Inventory</span></a></li>
            <li><a href="/reports-auditor" className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/reports-auditor'); }}><img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" /><span>Reports</span></a></li>
            <li><a href="/technicians" className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/technicians'); }}><img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" /><span>Technicians</span></a></li>
            <li><a href="/auditor-profile" className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleNavClick('/auditor-profile'); }}><img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" /><span>Account Setting</span></a></li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="dashboard-main-content">
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


            <div className="dashboard-bottom-row">
              <div className="recent-activity-card card" style={{ flex: "0 0 60%" }}>
                <h3>Recent Units</h3>
                <ul className="recent-list">
                  {recentUnits.length === 0 ? (
                    <li style={{ padding: 8 }}>{loading ? "Loading..." : "No recent activity"}</li>
                  ) : (
                    recentUnits.map((u) => (
                      <li key={u._id} className="recent-item">
                        <strong>{u.name}</strong> — <span style={{ textTransform: "capitalize" }}>{u.status}</span>
                        {u.lab?.name && <span> • {u.lab.name}</span>}
                        <div style={{ fontSize: 12, color: "#666" }}>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : ''}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              

              <div className="system-status-card card" style={{ flex: "0 0 35%" }}>
                <h3>System Status</h3>
                <p>Database: <strong>Connected</strong></p>
                <p>API: <strong>{loading ? "Loading..." : "OK"}</strong></p>

                <div style={{ marginTop: 12, background: "transparent" }}>
                  <StatusChart dataPoints={trend} />
                </div>

                <div style={{ marginTop: 12, textAlign: "center", color: "#ccc" }}>
                  <strong>{percentFunctional}%</strong> functional
                </div>

                <div style={{ marginTop: 8, textAlign: "center" }}>
                  <button onClick={fetchDashboard} className="btn small">Refresh</button>
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
