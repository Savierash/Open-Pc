// src/pages/Document.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Document.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';
import axios from 'axios';

// ✅ FIXED: Make sure base URL includes /api
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max

const DocumentPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [birthFile, setBirthFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const resumeRef = useRef(null);
  const birthRef = useRef(null);
  const idRef = useRef(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // ✅ File validation
  const validateFile = (file) => {
    if (!file) return { ok: false, msg: 'No file selected' };
    if (file.size > MAX_FILE_SIZE) return { ok: false, msg: 'File must be ≤ 5MB' };
    return { ok: true };
  };

  const handleFileChange = (target, file) => {
    setError('');
    const v = validateFile(file);
    if (!v.ok) {
      setError(v.msg);
      return;
    }

    if (target === 'resume') setResumeFile(file);
    if (target === 'birth') setBirthFile(file);
    if (target === 'id') setIdFile(file);
  };

  // ✅ Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile || !birthFile || !idFile) {
      setError('Please upload all required documents.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();

      form.append('resume', resumeFile);
      form.append('birthCertificate', birthFile);
      form.append('validId', idFile);

      form.append('firstName', localStorage.getItem('firstName') || '');
      form.append('lastName', localStorage.getItem('lastName') || '');
      form.append('email', localStorage.getItem('email') || '');
      form.append('contactNo', localStorage.getItem('contactNo') || '');
      form.append('address', localStorage.getItem('address') || '');

      // ✅ FIXED: Correct API endpoint to match backend
      await api.post('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Documents uploaded successfully! Await admin approval.');
      navigate('/pending');
    } catch (err) {
      console.error('❌ Document upload error:', err);
      if (!err.response) setError('Network error — please try again.');
      else setError(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-page">
      {/* Header */}
      <header className="top-bar-signup">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-signup">
            <a className={`nav-link-signup ${activeLink === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</a>
            <a className={`nav-link-signup ${activeLink === '/about' ? 'active' : ''}`} onClick={() => navigate('/about')}>About</a>
            <a className={`nav-link-signup ${activeLink === '/services' ? 'active' : ''}`} onClick={() => navigate('/services')}>Services</a>
          </nav>
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
        </div>
      </header>

      {/* Background icons */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      {/* Main content */}
      <main className="main">
        <h1 className="welcome-title">Submit Your Required Documents</h1>

        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="file-section">
              <label>Resume (PDF or Image)</label>
              <input
                ref={resumeRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('resume', e.target.files[0])}
              />
              {resumeFile && <p className="file-name">{resumeFile.name}</p>}
            </div>

            <div className="file-section">
              <label>Birth Certificate</label>
              <input
                ref={birthRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('birth', e.target.files[0])}
              />
              {birthFile && <p className="file-name">{birthFile.name}</p>}
            </div>

            <div className="file-section">
              <label>Valid ID</label>
              <input
                ref={idRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange('id', e.target.files[0])}
              />
              {idFile && <p className="file-name">{idFile.name}</p>}
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Uploading...' : 'Submit Documents'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DocumentPage;
