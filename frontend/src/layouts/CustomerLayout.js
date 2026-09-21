/**
 * CustomerLayout — Shared wrapper for all customer-facing pages.
 * Includes: Navbar (mobile hamburger + desktop links) + Footer.
 */
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <div className="customer-layout">
      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="brand-k2">K2</span> Fast Foods
          </Link>

          {/* Desktop nav */}
          <nav className="navbar-links desktop-only">
            <Link to="/"      className={isActive('/')}>Home</Link>
            <Link to="/menu"  className={isActive('/menu')}>Menu</Link>
            <Link to="/orders" className={isActive('/orders')}>My Orders</Link>
            {user?.role === 'admin' && <Link to="/admin" className="nav-link admin-link">Admin</Link>}
          </nav>

          <div className="navbar-actions desktop-only">
            <Link to="/cart" className="btn btn-secondary btn-sm">🛒 Cart</Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          </div>

          {/* Mobile hamburger */}
          <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/"        onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/menu"    onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link to="/cart"    onClick={() => setMenuOpen(false)}>Cart 🛒</Link>
            <Link to="/orders"  onClick={() => setMenuOpen(false)}>My Orders</Link>
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="brand-k2">K2</span> Fast Foods
            <p>Bold flavours. Fast delivery.</p>
          </div>
          <div className="footer-links">
            <Link to="/menu">Menu</Link>
            <Link to="/orders">Orders</Link>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} K2 Fast Foods. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .customer-layout { display: flex; flex-direction: column; min-height: 100vh; }
        .navbar { background: var(--k2-black); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .navbar-inner { display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .navbar-brand { font-family: 'Bebas Neue', cursive; font-size: 22px; color: var(--k2-white); letter-spacing: 1px; }
        .brand-k2 { color: var(--k2-gold); }
        .navbar-links { display: flex; gap: 24px; }
        .nav-link { font-size: 14px; font-weight: 500; color: #ccc; transition: color 0.2s; }
        .nav-link:hover, .nav-link.active { color: var(--k2-gold); }
        .admin-link { color: var(--k2-red) !important; }
        .navbar-actions { display: flex; gap: 10px; }
        .hamburger { display: flex; flex-direction: column; gap: 5px; padding: 4px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--k2-white); border-radius: 2px; }
        .mobile-menu { background: var(--k2-dark); padding: 16px; display: flex; flex-direction: column; gap: 4px; }
        .mobile-menu a, .mobile-menu button { display: block; padding: 12px 16px; color: #ccc; font-size: 15px; font-weight: 500; border-radius: 6px; text-align: left; width: 100%; }
        .mobile-menu a:hover, .mobile-menu button:hover { background: rgba(255,255,255,0.08); color: var(--k2-gold); }
        .desktop-only { display: none; }
        .mobile-only  { display: flex; }
        @media (min-width: 768px) { .desktop-only { display: flex; } .mobile-only { display: none; } }
        .main-content { flex: 1; }
        .footer { background: var(--k2-black); color: #aaa; padding: 32px 0 16px; }
        .footer-inner { display: flex; flex-direction: column; gap: 16px; }
        .footer-brand { font-family: 'Bebas Neue', cursive; font-size: 20px; color: var(--k2-white); }
        .footer-brand p { font-family: 'Poppins', sans-serif; font-size: 13px; color: #888; margin-top: 4px; }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { font-size: 14px; color: #888; }
        .footer-links a:hover { color: var(--k2-gold); }
        .footer-copy { font-size: 12px; color: #555; margin-top: 8px; }
      `}</style>
    </div>
  );
}
