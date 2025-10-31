// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import api from '../services/api';
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
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  const [loading, setLoading] = useState(false);

  // structured dashboard data
  const [totalUnits, setTotalUnits] = useState(0);
  const [counts, setCounts] = useState({ functional: 0, maintenance: 0, outOfOrder: 0 });
  const [percentFunctional, setPercentFunctional] = useState(0);
  const [perLab, setPerLab] = useState([]); // [{ _id, name, unitCount }]
  const [recentUnits, setRecentUnits] = useState([]); // latest units
  const [trend, setTrend] = useState([]); // chart series

  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(window.location.pathname);
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * fetchDashboard
   * - fetches /labs for per-lab counts (we expect the endpoint to return unitCount per lab)
   * - attempts to fetch recent units (GET /units?limit=8&sort=-updatedAt)
   * - attempts to fetch all units to compute counts by status (can be replaced by an aggregate endpoint)
   */
  async function fetchDashboard() {
    setLoading(true);
    try {
      // Use centralized api instance (baseURL set in src/services/api.js)
      const labsPromise = api.get('/labs'); // expects aggregate unitCount included
      const recentPromise = api.get('/units', { params: { limit: 8, sort: "-updatedAt" } });
      const allUnitsPromise = api.get('/units');

      const [labsRes, recentRes, allUnitsRes] = await Promise.allSettled([
        labsPromise,
        recentPromise,
        allUnitsPromise,
      ]);

      // process labs
      let labsData = [];
      if (labsRes.status === "fulfilled") {
        labsData = labsRes.value.data || [];
        setPerLab(labsData);
        const total = labsData.reduce((acc, l) => acc + (Number(l.unitCount) || 0), 0);
        setTotalUnits(total);
      } else {
        console.error("labs fetch failed:", labsRes.reason);
        setPerLab([]);
        setTotalUnits(0);
      }

      // process recent units
      if (recentRes.status === "fulfilled") {
        const rec = recentRes.value.data || [];
        const sorted = Array.isArray(rec)
          ? rec.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8)
          : [];
        setRecentUnits(sorted);
      } else {
        console.error("recent units fetch failed:", recentRes.reason);
        setRecentUnits([]);
      }

      // process all units for counts by status
      if (allUnitsRes.status === "fulfilled") {
        const all = allUnitsRes.value.data || [];
        const byStatus = { functional: 0, maintenance: 0, outOfOrder: 0 };
        all.forEach((u) => {
          const s = (u.status || "").toLowerCase();
          if (s === "functional" || s === "function") byStatus.functional += 1;
          else if (s === "maintenance") byStatus.maintenance += 1;
          else if (s === "outoforder" || s === "out-of-order" || s === "out of order") byStatus.outOfOrder += 1;
          else {
            // ignore others for now
          }
        });

        const allUnitsCount = all.length;
        if (allUnitsCount > 0 && byStatus.functional === 0 && byStatus.maintenance === 0 && byStatus.outOfOrder === 0) {
          // fallback if server returns units without status normalized
          setCounts({ functional: 0, maintenance: 0, outOfOrder: 0 });
          setPercentFunctional(0);
        } else {
          setCounts(byStatus);
          const denom = byStatus.functional + byStatus.maintenance + byStatus.outOfOrder;
          const pf = denom ? Math.round((byStatus.functional / denom) * 100) : 0;
          setPercentFunctional(pf);
        }

        if (!totalUnits && allUnitsCount > 0) {
          setTotalUnits(allUnitsCount);
        }
      } else {
        console.error("all units fetch failed:", allUnitsRes.reason);
      }

      // Trend (mock or derived)
      const trendMock = [
        { date: "Mon", value: 60 },
        { date: "Tue", value: 70 },
        { date: "Wed", value: 75 },
        { date: "Thu", value: 80 },
        { date: "Fri", value: 78 },
        { date: "Sat", value: 82 },
        { date: "Sun", value: 85 },
      ];
      setTrend(trendMock);
    } catch (err) {
      console.error("fetchDashboard error:", err);
      window.alert("Failed to load dashboard data. See console.");
    } finally {
      setLoading(false);
    }
  }

  // chart component for the small line chart
  const StatusChart = ({ dataPoints }) => (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#1b2630" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <YAxis domain={[0, 100]} axisLine={false} tick={{ fill: "#a5b3c2", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#071019", border: "none", color: "#fff" }} formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: "#38bdf8" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Navigation helper (SPA)
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
            <li>
              <a href="/dashboard" className={`sidebar-link ${activeLink === "/dashboard" ? "active" : ""}`}>
                <img src={HouseLogo} className="menu-icon" alt="Home" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/inventory" className={`sidebar-link ${activeLink === "/inventory" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); handleNavClick("/inventory"); }}>
                <img src={StackLogo} className="menu-icon" alt="Inventory" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/unit-status-auditor" className={`sidebar-link ${activeLink === "/unit-status-auditor" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); handleNavClick("/unit-status-auditor"); }}>
                <img src={PcDisplayLogo} className="menu-icon" alt="Unit Status" />
                <span>Unit Status</span>
              </a>
            </li>
            <li>
              <a href="/reports-auditor" className={`sidebar-link ${activeLink === "/reports-auditor" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); handleNavClick("/reports-auditor"); }}>
                <img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/technicians" className={`sidebar-link ${activeLink === "/technicians" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); handleNavClick("/technicians"); }}>
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>
            <li>
              <a href="/auditor-profile" className={`sidebar-link ${activeLink === "/auditor-profile" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); handleNavClick("/auditor-profile"); }}>
                <img src={AccountSettingLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* MAIN content */}
        <main className="main-content">
          <div className="dashboard-main-content">
            <div className="dashboard-cards">
              <div className="card total-units clickable-card" onClick={() => handleNavClick("/total-units")}>
                <div className="card-header">
                  <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                  <h3>Total Units</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">{loading ? "..." : totalUnits}</p>
                </div>
              </div>

              <div className="card functional clickable-card" onClick={() => handleNavClick("/functional")}>
                <div className="card-header">
                  <img src={ClipboardLogo} alt="Clipboard Icon" className="card-icon" />
                  <h3>Functional</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">{loading ? "..." : `${counts.functional} / ${totalUnits}`}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percentFunctional}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="card maintenance clickable-card" onClick={() => handleNavClick("/maintenance")}>
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
                    <li style={{ padding: 8 }}>{loading ? "Loading..." : "No recent activity"}</li>
                  ) : (
                    recentUnits.map((u) => (
                      <li key={u._id} className="recent-item">
                        <strong>{u.name}</strong> — <span style={{ textTransform: "capitalize" }}>{u.status}</span>
                        {u.lab?.name && <span> • {u.lab.name}</span>}
                        <div style={{ fontSize: 12, color: "#666" }}>{new Date(u.updatedAt).toLocaleString()}</div>
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
