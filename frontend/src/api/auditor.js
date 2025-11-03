// src/api/auditor.js
import api from "../api"; // ✅ This is your pre-configured Axios instance

// 📊 Dashboard
export const fetchAuditorDashboard = async () => {
  const res = await api.get("/auditor/dashboard");
  return res.data;
};

// 🧩 Inventory
export const fetchAuditorUnits = async (labId) => {
  const res = await api.get("/auditor/units", { params: { labId } });
  return res.data;
};

export const updateAuditorUnit = async (unitId, updates) => {
  const res = await api.put(`/auditor/units/${unitId}`, updates);
  return res.data;
};

// 🧮 Unit Status
export const fetchUnitStatus = async (status, labId) => {
  const res = await api.get("/auditor/unit-status", { params: { status, labId } });
  return res.data;
};

// 📝 Reports
export const fetchAuditorReports = async () => {
  const res = await api.get("/auditor/reports");
  return res.data;
};

export const createAuditorReport = async (reportData) => {
  const res = await api.post("/auditor/reports", reportData);
  return res.data;
};

// 👨‍🔧 Technicians Directory
export const fetchTechnicians = async () => {
  const res = await api.get("/auditor/technicians");
  return res.data;
};

// 🙋‍♂️ Profile
export const fetchAuditorProfile = async () => {
  const res = await api.get("/auditor/profile");
  return res.data;
};

export const updateAuditorProfile = async (updates) => {
  const res = await api.put("/auditor/profile", updates);
  return res.data;
};

export const uploadAuditorProfileImage = async (formData) => {
  const res = await api.post("/auditor/upload-profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
