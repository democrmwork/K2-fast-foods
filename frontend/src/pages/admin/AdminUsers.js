/**
 * AdminUsers — /admin/users
 * Purpose:        User management for admins.
 * Responsibility: List all users, view details, activate/deactivate accounts.
 * Dependencies:   api.js
 */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ROLE_BADGE = {
  customer: 'badge badge-blue',
  admin:    'badge badge-red',
  rider:    'badge badge-green',
};

export default function AdminUsers() {
  const [users,        setUsers]       = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [notification, setNotification]= useState('');
  const [search,       setSearch]      = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
      setNotification(`${user.name} has been ${!user.is_active ? 'activated' : 'deactivated'}.`);
      setTimeout(() => setNotification(''), 3000);
      fetchUsers();
    } catch { setNotification('Failed to update user.'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div className="admin-users">
      <div className="users-top">
        <h1 className="page-title font-display">User Management</h1>
        <div className="users-stats">
          <span className="stat-pill">{users.length} Total</span>
          <span className="stat-pill active-pill">{users.filter(u => u.is_active).length} Active</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <input
          className="form-input search-input"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {notification && <div className="alert alert-success">{notification}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No users found{search ? ' matching your search' : ''}.</div>
      ) : (
        <div className="users-table card">
          <div className="table-head">
            <span>User</span>
            <span className="hide-sm">Phone</span>
            <span>Role</span>
            <span className="hide-sm">Joined</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {filtered.map(user => (
            <div className="table-row" key={user.id}>
              <span className="user-cell">
                <div className="user-avatar-sm">{user.name?.[0]?.toUpperCase()}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </span>
              <span className="hide-sm user-phone">{user.phone || '—'}</span>
              <span><span className={ROLE_BADGE[user.role] || 'badge'}>{user.role}</span></span>
              <span className="hide-sm joined-date">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
              <span>
                <span className={`badge ${user.is_active ? 'badge-green' : 'badge-red'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </span>
              <span>
                <button
                  className={`btn btn-sm toggle-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleActive(user)}
                  disabled={user.role === 'admin'}
                  title={user.role === 'admin' ? "Cannot deactivate admin" : ""}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-users { }
        .users-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
        .page-title { font-size: 32px; color: var(--k2-black); }
        .users-stats { display: flex; gap: 8px; }
        .stat-pill { padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; background: var(--k2-gray); color: var(--k2-text-muted); }
        .active-pill { background: #e1f5ee; color: #0f6e56; }
        .search-wrap { margin-bottom: 16px; }
        .search-input { max-width: 380px; }
        .empty-state { text-align: center; padding: 60px; color: var(--k2-text-muted); font-size: 15px; }
        .users-table { overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2fr 1fr 90px 110px 80px 100px; gap: 8px;
          padding: 10px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; color: var(--k2-text-muted); border-bottom: 1px solid var(--k2-border); background: var(--k2-gray); }
        .table-row { display: grid; grid-template-columns: 2fr 1fr 90px 110px 80px 100px; gap: 8px;
          padding: 12px 16px; border-bottom: 1px solid var(--k2-border); align-items: center; font-size: 13px; }
        .table-row:last-child { border-bottom: none; }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-avatar-sm { width: 34px; height: 34px; background: var(--k2-red); color: #fff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .user-name  { font-weight: 600; font-size: 14px; }
        .user-email { font-size: 12px; color: var(--k2-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .user-phone { color: var(--k2-text-muted); font-size: 13px; }
        .joined-date { font-size: 12px; color: var(--k2-text-muted); }
        .toggle-btn { font-size: 12px; font-weight: 600; }
        .toggle-btn.deactivate { color: var(--k2-red); border: 1.5px solid var(--k2-red-light); background: var(--k2-red-light); }
        .toggle-btn.deactivate:hover:not(:disabled) { background: var(--k2-red); color: #fff; }
        .toggle-btn.activate { color: #0f6e56; border: 1.5px solid #c5e8dc; background: #e1f5ee; }
        .toggle-btn.activate:hover:not(:disabled) { background: #0f6e56; color: #fff; }
        .toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .hide-sm { display: none; }
        @media (min-width: 700px) { .hide-sm { display: block; } }
      `}</style>
    </div>
  );
}
