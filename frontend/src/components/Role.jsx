import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Role.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import AuditorButton from '../assets/AUDITOR BUTTON.png'; // Import Auditor image
import TechButton from '../assets/TECH BUTTON.png';     // Import Tech image

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Role = () => {
  const [activeLink, setActiveLink] = useState('');
  const [roles, setRoles] = useState([]); // roles from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: track currently selected role
  const [selectedRoleKey, setSelectedRoleKey] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // fetch roles from backend
    let mounted = true;
    setLoading(true);
    setError(null);

    axios.get(`${apiBase}/api/auth/roles`)
      .then(res => {
        if (!mounted) return;
        if (res.data && res.data.roles) {
          setRoles(res.data.roles);
        } else {
          setRoles([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch roles', err);
        if (mounted) setError('Failed to load roles');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
  };

  // decide which image to show for a role key (fallback if any)
  const roleImageForKey = (key) => {
    if (!key) return null;
    const k = key.toLowerCase();
    if (k === 'auditor') return AuditorButton;
    if (k === 'tech' || k === 'technician') return TechButton;
    // fallback: use null
    return null;
  };

  // NEW: when user clicks a role card, mark it selected (do NOT navigate immediately)
  const handleSelectRole = (roleKey) => {
    setSelectedRoleKey(prev => (prev === roleKey ? null : roleKey)); // toggle
  };

  // NEW: Create Account behavior — if a role selected, pass role in query param
  const handleCreateAccount = () => {
    if (selectedRoleKey) {
      navigate(`/register?role=${encodeURIComponent(selectedRoleKey)}`);
    } else {
      // fallback
      navigate('/signup');
    }
  };

  return (
    <div className="role-page">
      <header className="top-bar-role">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>

          <nav className="nav-links-role" aria-label="Main navigation">
            <a
              className={`nav-link-role ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('/'); }}
            >
              Home
            </a>
            <a
              className={`nav-link-role ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('/about'); }}
            >
              About
            </a>
            <a
              className={`nav-link-role ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('/services'); }}
            >
              Services
            </a>
          </nav>
        </div>

        <div className="nav-actions">
         
        </div>
      </header>

      <main className="main-role">
        <h1 className="welcome-title-role">Get started with your role</h1>

        <div className="role-selection-container" aria-live="polite">
          {loading && <div style={{ color: 'rgba(255,255,255,0.85)' }}>Loading roles...</div>}
          {error && <div style={{ color: '#ffb4b4' }}>{error}</div>}

          {!loading && !error && roles.length === 0 && (
            // If backend returned nothing, show static buttons (existing images)
            <>
              <div
                role="button"
                tabIndex={0}
                className="role-image"
                onClick={() => handleSelectRole('auditor')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('auditor'); }}
                style={{
                  backgroundImage: `url(${AuditorButton})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  outline: selectedRoleKey === 'auditor' ? '3px solid rgba(124,58,237,0.9)' : 'none',
                  transform: selectedRoleKey === 'auditor' ? 'translateY(-6px) scale(1.02)' : undefined,
                  transition: 'transform .18s, outline .12s'
                }}
                aria-pressed={selectedRoleKey === 'auditor'}
                aria-label="Select Auditor role"
              />

              <div
                role="button"
                tabIndex={0}
                className="role-image"
                onClick={() => handleSelectRole('tech')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('tech'); }}
                style={{
                  backgroundImage: `url(${TechButton})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  outline: selectedRoleKey === 'tech' ? '3px solid rgba(124,58,237,0.9)' : 'none',
                  transform: selectedRoleKey === 'tech' ? 'translateY(-6px) scale(1.02)' : undefined,
                  transition: 'transform .18s, outline .12s'
                }}
                aria-pressed={selectedRoleKey === 'tech'}
                aria-label="Select Tech role"
              />
            </>
          )}

          {!loading && !error && roles.length > 0 && roles.map((r) => {
            const img = roleImageForKey(r.key);
            const isSelected = selectedRoleKey === r.key;
            return (
              <div
                key={r.key}
                role="button"
                tabIndex={0}
                className="role-image"
                onClick={() => handleSelectRole(r.key)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole(r.key); }}
                style={{
                  ...(img ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
                  outline: isSelected ? '3px solid rgba(124,58,237,0.9)' : 'none',
                  transform: isSelected ? 'translateY(-6px) scale(1.02)' : undefined,
                  transition: 'transform .18s, outline .12s'
                }}
                aria-label={`Select ${r.name} role`}
                title={r.name}
                aria-pressed={isSelected}
              >
                {!img && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 700 }}>{r.name.charAt(0)}</div>
                    <div style={{ marginTop: 8, fontWeight: 700 }}>{r.name.toUpperCase()}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="create-account-button-role"
          onClick={handleCreateAccount}
          // visually indicate disabled state when no role selected
          style={{
            opacity: selectedRoleKey ? 1 : 0.85,
            cursor: 'pointer'
          }}
        >
          Create Account
        </button>

        {/* helper text */}
        <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
          {selectedRoleKey ? `Signing up as: ${selectedRoleKey.toUpperCase()}` : 'Select a role, then click Create Account'}
        </div>
      </main>
    </div>
  );
};

export default Role;
