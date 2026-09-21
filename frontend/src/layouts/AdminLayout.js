/**
 * AdminLayout — Sidebar + topbar shell for all admin pages.
 * Responsive: sidebar collapses on mobile to icon-only or hamburger.
 */
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const NAV_ITEMS = [
  { path: '/admin',        label: 'Dashboard', icon: '📊' },
  { path: '/admin/orders', label: 'Orders',    icon: '🛒' },
  { path: '/admin/menu',   label: 'Menu',      icon: '🍔' },
  { path: '/admin/users',  label: 'Users',     icon: '👥' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-box">K2</span>
          <span className="logo-text">Admin</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link"><span className="sidebar-icon">🏠</span><span className="sidebar-label">Customer Site</span></Link>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}><span className="sidebar-icon">🚪</span><span className="sidebar-label">Logout</span></button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="topbar-title">K2 Fast Foods — Admin</h1>
          <div className="topbar-user">
            <span className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
            <span className="user-name">{user?.name}</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: #f0f0f0; }
        .admin-sidebar { width: 220px; background: var(--k2-black); display: flex; flex-direction: column; position: fixed; top: 0; left: -220px; height: 100vh; z-index: 200; transition: left 0.25s ease; }
        .admin-sidebar.open { left: 0; }
        @media (min-width: 900px) { .admin-sidebar { left: 0; position: sticky; } }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; }
        .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 20px 16px 14px; border-bottom: 1px solid #222; }
        .logo-box { background: var(--k2-red); color: var(--k2-gold); font-family: 'Bebas Neue', cursive; font-size: 20px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
        .logo-text { font-family: 'Bebas Neue', cursive; font-size: 18px; color: #fff; letter-spacing: 1px; }
        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; color: #999; font-size: 14px; font-weight: 500; transition: all 0.15s; width: 100%; text-align: left; }
        .sidebar-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sidebar-link.active { background: var(--k2-red); color: #fff; }
        .sidebar-icon { font-size: 16px; flex-shrink: 0; }
        .sidebar-bottom { padding: 8px; border-top: 1px solid #222; }
        .sidebar-logout { background: none; border: none; cursor: pointer; font-family: inherit; }
        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        @media (min-width: 900px) { .admin-main { margin-left: 0; } }
        .admin-topbar { background: var(--k2-white); border-bottom: 1px solid var(--k2-border); padding: 0 20px; height: 56px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .topbar-hamburger { font-size: 20px; color: var(--k2-text); padding: 4px 8px; border-radius: 4px; }
        .topbar-hamburger:hover { background: var(--k2-gray); }
        @media (min-width: 900px) { .topbar-hamburger { display: none; } }
        .topbar-title { font-family: 'Bebas Neue', cursive; font-size: 18px; color: var(--k2-black); flex: 1; letter-spacing: 0.5px; }
        .topbar-user { display: flex; align-items: center; gap: 8px; }
        .user-avatar { width: 32px; height: 32px; background: var(--k2-red); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .user-name { font-size: 13px; font-weight: 500; color: var(--k2-text-muted); display: none; }
        @media (min-width: 600px) { .user-name { display: block; } }
        .admin-content { flex: 1; padding: 20px 16px; }
        @media (min-width: 768px) { .admin-content { padding: 24px; } }
      `}</style>
    </div>
  );
}
