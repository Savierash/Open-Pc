// src/pages/AdminTechRequests.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminTechRequests.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import ToolsLogo from '../assets/tools_logo.png';
import GearLogo from '../assets/GearFill.png';
import EnvelopeCheck from '../assets/envelopecheck.png';
import CopyIcon from '../assets/copypaste.png';
import DocumentIcon from '../assets/icon_5.png';

// configure API client (Vite env or default)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});
// attach token if available
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  return cfg;
}, (err) => Promise.reject(err));

/**
 * fetchTechRequestsFromApi(apiClient)
 * - Tries multiple likely endpoints and response shapes.
 * - Returns normalized array of requests:
 *   [{ _id, title, description, status, createdAt, requester, attachments, raw }, ...]
 * - If backend not available, returns a safe mock list so UI can render.
 */
export async function fetchTechRequestsFromApi(apiClient = api) {
  const candidates = [
    '/tech-requests',
    '/requests/tech',
    '/requests?type=tech',
    '/requests', // fallback (we'll filter)
  ];

  let found = null;

  for (const url of candidates) {
    try {
      const res = await apiClient.get(url);
      const payload = res?.data;
      if (Array.isArray(payload)) {
        found = payload;
        break;
      }
      if (payload && Array.isArray(payload.requests)) {
        found = payload.requests;
        break;
      }
      if (payload && Array.isArray(payload.data)) {
        found = payload.data;
        break;
      }
    } catch (err) {
      // try next candidate
      // console.debug('candidate failed', url, err?.message || err);
    }
  }

  // fallback: if /requests returned an array of mixed requests, filter by type
  if (!found) {
    try {
      const res = await apiClient.get('/requests');
      const all = res?.data;
      if (Array.isArray(all)) {
        found = all.filter(r => {
          const t = (r.type || r.requestType || '').toString().toLowerCase();
          return t.includes('tech') || t.includes('technician') || t.includes('equipment') || t.includes('repair');
        });
      }
    } catch (err) {
      // ignore
    }
  }

  // If still not found, return mock data so UI doesn't break (remove mock when backend exists)
  if (!found || !Array.isArray(found) || found.length === 0) {
    return [
      {
        _id: 'mock-1',
        title: 'Printer not working',
        description: 'Printer in Lab A is jammed and shows error E13.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        requester: { name: 'Alice', email: 'alice@example.com' },
        attachments: [],
        raw: {},
      },
      {
        _id: 'mock-2',
        title: 'Monitor flickering',
        description: 'Monitor on PC-12 flickers intermittently.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        requester: { name: 'Bob', email: 'bob@example.com' },
        attachments: [],
        raw: {},
      },
    ];
  }

  // Normalize shape
  const normalized = (found || []).map(r => ({
    _id: r._id || r.id || r.requestId || '',
    title: r.title || r.subject || `Request ${r._id || r.id || ''}`,
    description: r.description || r.details || '',
    status: (r.status || r.state || 'pending').toString(),
    createdAt: r.createdAt || r.created_at || r.date || '',
    requester: r.requester || r.user || r.owner || { name: r.name || r.requesterName || r.email || 'Unknown', email: r.email || '' },
    attachments: r.attachments || r.files || [],
    raw: r,
  }));

  return normalized;
}

/**
 * updateTechRequestStatusFromApi(apiClient, reqId, newStatus)
 * - Tries a few common update patterns (PATCH/PUT to /requests/:id, POST to /requests/:id/accept etc.)
 * - Returns true on success, throws on failure.
 */
export async function updateTechRequestStatusFromApi(apiClient = api, reqId, newStatus) {
  if (!reqId) throw new Error('reqId required');
  const patterns = [
    { method: 'patch', url: `/requests/${reqId}`, data: { status: newStatus } },
    { method: 'put', url: `/requests/${reqId}`, data: { status: newStatus } },
    { method: 'post', url: `/requests/${reqId}/${newStatus}`, data: {} }, // e.g. /requests/123/accept
    { method: 'post', url: `/requests/${reqId}/status`, data: { status: newStatus } },
  ];

  let lastErr = null;
  for (const p of patterns) {
    try {
      const res = await apiClient.request({
        method: p.method,
        url: p.url,
        data: p.data || {},
      });
      if (res && (res.status >= 200 && res.status < 300)) return true;
      // some backends return 200 with object in data - treat as success
      if (res && res.data) return true;
    } catch (err) {
      lastErr = err;
      // try next pattern
    }
  }
  throw lastErr || new Error('Failed to update status');
}

const AdminTechRequests = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(window.location.pathname || '/admin-tech-requests');

  // data
  const [requests, setRequests] = useState([]);      // list of requests
  const [selected, setSelected] = useState(null);    // currently viewed request
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // wrapper that uses fetchTechRequestsFromApi so you can replace api later
  async function loadRequests() {
    setLoading(true);
    setError('');
    try {
      const list = await fetchTechRequestsFromApi(api);
      setRequests(list || []);
      setSelected(list && list.length ? list[0] : null);
    } catch (err) {
      console.error('Failed to load tech requests', err);
      setError('Failed to load requests — check console for details.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  // optimistic update helper for accept/decline using updateTechRequestStatusFromApi
  const updateRequestStatus = async (reqId, newStatus) => {
    if (!reqId) return;
    // optimistic UI
    setRequests(prev => prev.map(r => r._id === reqId ? { ...r, status: newStatus } : r));
    if (selected && selected._id === reqId) setSelected(prev => ({ ...prev, status: newStatus }));

    try {
      await updateTechRequestStatusFromApi(api, reqId, newStatus);
      // success — optionally refresh a single request or full list
      // await loadRequests();
    } catch (err) {
      console.error('Update status failed', err);
      // rollback by reloading
      await loadRequests();
      setError('Failed to update request. See console.');
    }
  };

  const handleAccept = async (r) => {
    if (!r) return;
    if (!window.confirm('Accept this request?')) return;
    await updateRequestStatus(r._id, 'accepted');
  };

  const handleDecline = async (r) => {
    if (!r) return;
    if (!window.confirm('Decline this request?')) return;
    await updateRequestStatus(r._id, 'declined');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text || '');
      console.info('copied', text);
    } catch (err) {
      console.warn('copy failed', err);
    }
  };

  const filtered = requests.filter(req => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (req.title || '').toLowerCase().includes(q) ||
           (req.description || '').toLowerCase().includes(q) ||
           (req.requester?.name || '').toLowerCase().includes(q) ||
           String(req._id || '').toLowerCase().includes(q);
  });

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <span className="page-title">Tech Requests</span>
        </div>

        <div className="nav-actions">
          <img src={PersonLogo} alt="Profile Icon" className="profile-icon-dashboard" />
          <span className="profile-name">Admin</span>
          <span className="profile-role">Administrator</span>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="/dashboard-admin" className={`sidebar-link ${activeLink === '/dashboard-admin' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveLink('/dashboard-admin'); navigate('/dashboard-admin'); }}>
                <img src={HouseLogo} className="menu-icon" alt="Home" /><span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/admin-technicians" className={`sidebar-link ${activeLink === '/admin-technicians' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveLink('/admin-technicians'); navigate('/admin-technicians'); }}>
                <img src={ToolsLogo} className="menu-icon" alt="Technicians" /><span>Technicians</span>
              </a>
            </li>
            <li>
              <a href="/admin-profile" className={`sidebar-link ${activeLink === '/admin-profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveLink('/admin-profile'); navigate('/admin-profile'); }}>
                <img src={GearLogo} className="menu-icon" alt="Account Setting" /><span>Account Setting</span>
              </a>
            </li>
            <li>
              <a href="/admin-tech-requests" className={`sidebar-link ${activeLink === '/admin-tech-requests' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveLink('/admin-tech-requests'); }}>
                <img src={EnvelopeCheck} className="menu-icon" alt="Tech Requests" /><span>Tech Requests</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search Requests</div>
            <div className="search-input-wrapper">
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search requests or requester" className="search-input" />
            </div>
            <h2 className="page-title">Tech Requests</h2>
          </div>

          <div className="technicians-page-content">
            <div className="technicians-search-panel">
              <div className="technicians-list">
                {loading ? (
                  <div style={{ padding: 12, color: '#ccc' }}>Loading requests...</div>
                ) : error ? (
                  <div style={{ padding: 12, color: 'salmon' }}>{error}</div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: 12, color: '#999' }}>No requests found</div>
                ) : (
                  filtered.map(req => (
                    <div
                      key={req._id}
                      className={`technician-list-item ${selected && selected._id === req._id ? 'selected' : ''}`}
                      onClick={() => setSelected(req)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={PersonLogo} alt="Requester" className="technician-icon" />
                        <div>
                          <div style={{ fontWeight: 700 }}>{req.title}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{req.requester?.name || 'Unknown'}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>{req.status}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="technicians-info-panel">
              <h2>Request Details</h2>

              {!selected ? (
                <div style={{ padding: 12, color: '#777' }}>{loading ? 'Loading...' : 'Select a request'}</div>
              ) : (
                <>
                  <div className="technician-detail-card">
                    <div className="technician-profile-header">
                      <img src={PersonLogo} alt="Profile Icon" className="profile-detail-icon" />
                      <div>
                        <h3 style={{ margin: 0 }}>{selected.title}</h3>
                        <div style={{ fontSize: 13, color: '#666' }}>{selected.requester?.name || selected.requester?.email || 'Requester'}</div>
                      </div>
                    </div>
                  </div>

                  <label className="detail-label">Description</label>
                  <div className="detail-row">
                    <div className="detail-input" style={{ whiteSpace: 'pre-wrap' }}>{selected.description || '—'}</div>
                  </div>

                  <label className="detail-label">Status</label>
                  <div className="detail-row">
                    <div className="detail-input">{selected.status}</div>
                  </div>

                  <label className="detail-label">Requester Email</label>
                  <div className="detail-row email-row">
                    <div className="input-with-icon-wrapper">
                      <input type="text" value={selected.requester?.email || ''} readOnly className="detail-input" />
                      <img src={CopyIcon} alt="Copy Icon" className="copy-icon" onClick={() => copyToClipboard(selected.requester?.email || '')} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>

                  <div className="contact-documents-layout">
                    <div style={{ flex: 1 }}>
                      <label className="detail-label">Submitted</label>
                      <div className="detail-row">
                        <div className="detail-input">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</div>
                      </div>
                    </div>

                    <div className="documents-section">
                      <label className="detail-label">Attachments</label>
                      {(!selected.attachments || selected.attachments.length === 0) ? (
                        <div className="document-box"><img src={DocumentIcon} alt="No documents" /></div>
                      ) : (
                        selected.attachments.map((att, idx) => {
                          const url = typeof att === 'string' ? att : (att.url || att.path || att.file);
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <img src={DocumentIcon} alt="doc" style={{ width: 36, height: 36 }} />
                              <a href={url} target="_blank" rel="noreferrer" style={{ color: '#0b66ff' }}>{String(url).split('/').pop()}</a>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="action-buttons" style={{ marginTop: 12 }}>
                    <button className="accept-button" onClick={() => handleAccept(selected)} disabled={selected.status === 'accepted'}>
                      Accept
                    </button>
                    <button className="decline-button" onClick={() => handleDecline(selected)} disabled={selected.status === 'declined'}>
                      Decline
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTechRequests;
