import React, { useState, useEffect, useRef } from 'react';
import '../styles/Document.css'; // <-- new import
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import api from '../services/api';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DocumentPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [birthFile, setBirthFile] = useState(null);
  const [birthPreview, setBirthPreview] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState('');
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
    return () => {
      resumePreview && URL.revokeObjectURL(resumePreview);
      birthPreview && URL.revokeObjectURL(birthPreview);
      idPreview && URL.revokeObjectURL(idPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const validateAndPreview = (file) => {
    if (!file) return { ok: false, msg: 'No file' };
    if (file.size > MAX_FILE_SIZE) return { ok: false, msg: 'File must be ≤ 5MB' };
    // allow images and PDF/Word for resume
    return { ok: true };
  };

  const handleFileChange = (target, file) => {
    setError('');
    const v = validateAndPreview(file);
    if (!v.ok) {
      setError(v.msg);
      return;
    }
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
    if (target === 'resume') {
      if (resumePreview) URL.revokeObjectURL(resumePreview);
      setResumeFile(file);
      setResumePreview(preview);
    } else if (target === 'birth') {
      if (birthPreview) URL.revokeObjectURL(birthPreview);
      setBirthFile(file);
      setBirthPreview(preview);
    } else if (target === 'id') {
      if (idPreview) URL.revokeObjectURL(idPreview);
      setIdFile(file);
      setIdPreview(preview);
    }
  };

  const removeFile = (target) => {
    if (target === 'resume') {
      if (resumePreview) URL.revokeObjectURL(resumePreview);
      setResumeFile(null);
      setResumePreview('');
      if (resumeRef.current) resumeRef.current.value = null;
    } else if (target === 'birth') {
      if (birthPreview) URL.revokeObjectURL(birthPreview);
      setBirthFile(null);
      setBirthPreview('');
      if (birthRef.current) birthRef.current.value = null;
    } else if (target === 'id') {
      if (idPreview) URL.revokeObjectURL(idPreview);
      setIdFile(null);
      setIdPreview('');
      if (idRef.current) idRef.current.value = null;
    }
    setError('');
  };

  const openPreview = (previewUrl, file) => {
    if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
    else if (file) {
      // for non-image (pdf) use object URL
      const url = URL.createObjectURL(file);
      window.open(url, '_blank', 'noopener,noreferrer');
      // revoke after short delay
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  };

  const downloadFile = (file, filename) => {
    const url = file.type.startsWith('image/') && file.previewUrl ? file.previewUrl : URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (!file.type.startsWith('image/')) setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!resumeFile || !birthFile || !idFile) {
      setError('Please provide Resume, Birth Certificate and Valid ID.');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('resume', resumeFile);
      form.append('birthCertificate', birthFile);
      form.append('validId', idFile);

      await api.post('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/documents', { replace: true });
    } catch (err) {
      console.error(err);
      if (!err.response) setError('Network error - try again.');
      else setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-page">
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

      {/* Background decorative logos */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main">
        <h1 className="welcome-title">Provide documents for your account</h1>
        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">

            <label style={{ display: 'block', textAlign: 'left' }}>Resume</label>
            <section>
              <div className="file-row">
                <input ref={resumeRef} type="file" accept="image/*,application/pdf" style={{ width: '100%' }} onChange={(e) => handleFileChange('resume', e.target.files[0])} />
                {resumePreview ? (
                  <>
                    <img src={resumePreview} alt="resume" />
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview(resumePreview, resumeFile)}>View</button>
                      <button type="button" className="signup-button" onClick={() => downloadFile(resumeFile, resumeFile.name)}>Download</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('resume')}>Remove</button>
                    </div>
                  </>
                ) : resumeFile ? (
                  <>
                    <div style={{ color: '#ccc' }}>{resumeFile.name}</div>
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview('', resumeFile)}>Open</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('resume')}>Remove</button>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#aaa' }}>No file selected</div>
                )}
              </div>
            </section>

            <label style={{ display: 'block', textAlign: 'left' }}>Birth Certificate</label>
            <section>
              <div className="file-row">
                <input ref={birthRef} type="file" accept="image/*,application/pdf" style={{ width: '100%' }} onChange={(e) => handleFileChange('birth', e.target.files[0])} />
                {birthPreview ? (
                  <>
                    <img src={birthPreview} alt="birth" />
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview(birthPreview, birthFile)}>View</button>
                      <button type="button" className="signup-button" onClick={() => downloadFile(birthFile, birthFile.name)}>Download</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('birth')}>Remove</button>
                    </div>
                  </>
                ) : birthFile ? (
                  <>
                    <div style={{ color: '#ccc' }}>{birthFile.name}</div>
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview('', birthFile)}>Open</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('birth')}>Remove</button>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#aaa' }}>No file selected</div>
                )}
              </div>
            </section>

            <label style={{ display: 'block', textAlign: 'left' }}>Valid ID</label>
            <section>
              <div className="file-row">
                <input ref={idRef} type="file" accept="image/*,application/pdf" style={{ width: '100%' }} onChange={(e) => handleFileChange('id', e.target.files[0])} />
                {idPreview ? (
                  <>
                    <img src={idPreview} alt="id" />
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview(idPreview, idFile)}>View</button>
                      <button type="button" className="signup-button" onClick={() => downloadFile(idFile, idFile.name)}>Download</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('id')}>Remove</button>
                    </div>
                  </>
                ) : idFile ? (
                  <>
                    <div style={{ color: '#ccc' }}>{idFile.name}</div>
                    <div className="file-actions">
                      <button type="button" className="signup-button" onClick={() => openPreview('', idFile)}>Open</button>
                      <button type="button" className="signup-button remove" onClick={() => removeFile('id')}>Remove</button>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#aaa' }}>No file selected</div>
                )}
              </div>
            </section>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DocumentPage;
