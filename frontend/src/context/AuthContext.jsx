// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // ✅ Make sure this exists and handles baseURL + token

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  // ✅ Load user from token (verify via backend)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch logged-in user from backend
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setAccessToken(token);

        // Update localStorage to keep consistent
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        localStorage.clear(); // Token might be invalid
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Called after successful login
  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setAccessToken(token);
  };

  // ✅ Logout handler
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
