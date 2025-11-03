// src/context/AuditorContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchAuditorDashboard,
  fetchAuditorProfile,
  fetchAuditorReports,
  fetchTechnicians,
} from "../api/auditor";

const AuditorContext = createContext();

export const AuditorProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load all initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dash, prof, reps, techs] = await Promise.all([
          fetchAuditorDashboard(),
          fetchAuditorProfile(),
          fetchAuditorReports(),
          fetchTechnicians(),
        ]);
        setDashboard(dash);
        setProfile(prof);
        setReports(reps);
        setTechnicians(techs);
      } catch (err) {
        console.error("Auditor data load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AuditorContext.Provider
      value={{
        dashboard,
        profile,
        reports,
        technicians,
        loading,
        setProfile,
        setReports,
      }}
    >
      {children}
    </AuditorContext.Provider>
  );
};

// ✅ Hook for easy access
export const useAuditor = () => useContext(AuditorContext);
