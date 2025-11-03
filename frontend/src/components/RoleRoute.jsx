import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// allowed: array of role keys, e.g. ['admin','technician']
const RoleRoute = ({ allowed = [], children }) => {
  const { user, accessToken, loading } = useAuth();

  // 🧠 Wait until AuthContext finishes initializing
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#ccc" }}>
        Checking authentication...
      </div>
    );
  }

  // 🔒 Not logged in → go to login
  if (!user || !accessToken) {
    console.warn("🔒 RoleRoute: No user or token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // 🧩 Normalize role (support both string or populated object)
  const roleKey =
    typeof user.role === "string"
      ? user.role.toLowerCase()
      : (user.role?.key || user.role?.name || "").toLowerCase();

  // 🚫 Unauthorized role
  if (!allowed.includes(roleKey)) {
    console.warn(`🚫 RoleRoute: Access denied for role "${roleKey}"`);
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized → render the page
  return children;
};

export default RoleRoute;
