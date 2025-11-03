import React, { useState, useEffect } from 'react';
import '../styles/Pending.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import MissionLogo from '../assets/mission_logo.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

const Pending = () => {
  const [activeLink, setActiveLink] = useState('');
  const [status, setStatus] = useState('pending');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem('pendingEmail') || location.state?.email || '';

  useEffect(() => {
    setActiveLink(location.pathname);

    // Auto-check approval every 10 seconds
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    if (!email) return;
    setChecking(true);
    try {
      const res = await api.get(`/auth/status?email=${email}`);
      if (res.data.verified) {
        setStatus('approved');
        alert('🎉 Your technician account has been approved! You can now log in.');
        localStorage.removeItem('pendingEmail');
        navigate('/login');
      } else {
        console.log('Still pending...');
      }
    } catch (err) {
      console.error('Status check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="pending">
      <header className="top-bar-pending">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
        </div>
      </header>

      {/* Background */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main-pending">
        <h1 className="pending-title">
          {status === 'approved' ? 'APPROVED!' : 'PENDING REQUEST'}
        </h1>
        <p className="pending-subtitle">
          {status === 'approved'
            ? 'Redirecting to login...'
            : checking
            ? 'Checking approval status...'
            : 'Waiting for admin approval...'}
        </p>

        <div className="pending-icon-container">
          <img src={MissionLogo} alt="Loading" className="pending-logo" />
        </div>
      </main>
    </div>
  );
};

export default Pending;
