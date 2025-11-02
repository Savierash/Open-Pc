// src/pages/Role.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Role.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import AuditorButton from '../assets/AUDITOR BUTTON.png';
import TechButton from '../assets/TECH BUTTON.png';

// centralized api client

const Role = () => {
  const [activeLink, setActiveLink] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api.get('/auth/roles')
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

  const handleNavClick = (path) => navigate(path);

  // Handle click for role cards — direct navigation
  const handleRoleClick = (roleKey) => {
    if (!roleKey) return;
    navigate(`/signup?role=${encodeURIComponent(roleKey)}`);
  };

  // Decide image for backend roles (if any extra)
  const roleImageForKey = (key) => {
    if (!key) return null;
    const k = key.toLowerCase();
    if (k === 'auditor') return AuditorButton;
    if (k === 'tech' || k === 'technician') return TechButton;
    return null;
  };

  const backendRolesFiltered = roles.filter(r => {
    const k = (r.key || '').toString().toLowerCase();
    return k !== 'auditor' && k !== 'tech' && k !== 'technician';
  });

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
            >
              Home
            </a>
            <a
              className={`nav-link-role ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-role ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
            >
              Services
            </a>
          </nav>
        </div>
      </header>

      <main className="main-role">
        <h1 className="welcome-title-role">Get started with your role</h1>

        <div className="role-selection-container" aria-live="polite">
          {loading && <div style={{ color: 'rgba(255,255,255,0.85)' }}>Loading roles...</div>}
          {error && <div style={{ color: '#ffb4b4' }}>{error}</div>}

          {/* AUDITOR CARD */}
          <div
            role="button"
            tabIndex={0}
            className="role-image"
            onClick={() => handleRoleClick('inventory')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick('inventory'); }}
            style={{
              backgroundImage: `url(${AuditorButton})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center', 
              transition: 'transform .18s, outline .12s',
              marginRight: 12,
            }}
            aria-label="Auditor role"
            title="Auditor"
          />

          {/* TECH CARD */}
          <div
            role="button"
            tabIndex={0}
            className="role-image"
            onClick={() => handleRoleClick('tech')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick('tech'); }}
            style={{
              backgroundImage: `url(${TechButton})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'transform .18s, outline .12s',
            }}
            aria-label="Tech role"
            title="Technician"
          />

          {/* Render backend roles if available */}
          {!loading && !error && backendRolesFiltered.length > 0 && backendRolesFiltered.map((r) => {
            const img = roleImageForKey(r.key);
            return (
              <div
                key={r.key}
                role="button"
                tabIndex={0}
                className="role-image"
                onClick={() => handleRoleClick(r.key)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick(r.key); }}
                style={{
                  ...(img ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
                  transition: 'transform .18s, outline .12s',
                }}
                aria-label={`Select ${r.name} role`}
                title={r.name}
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

        {/* Keep Create Account button (optional) */}
        <button
          type="button"
          className="create-account-button-role"
          onClick={() => navigate('/signup')}
          style={{
            opacity: 0.9,
            cursor: 'pointer'
          }}
        >
          Create Account
        </button>

        <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
          Click your role to go directly to signup
        </div>
      </main>
    </div>
  );
};

export default Role;
