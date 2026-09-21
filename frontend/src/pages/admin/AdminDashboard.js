/**
 * AdminDashboard — /admin
 * Shows KPI stats and recent orders from the API.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats,  setStats]  = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/dashboard'), api.get('/admin/orders?per_page=5')])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes.data.data);
        setOrders(ordersRes.data.data?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div className="spinner"></div></div>;

  const kpis = [
    { label: "Today's Orders",   value: stats?.today_orders  || 0,                         icon: '🛒', color: 'var(--k2-red)' },
    { label: 'Revenue Today',    value: `Rs ${(stats?.today_revenue || 0).toLocaleString()}`, icon: '💰', color: 'var(--k2-gold-dark)' },
    { label: 'Pending Orders',   value: stats?.pending_orders || 0,                         icon: '⏳', color: '#185fa5' },
    { label: 'Active Riders',    value: stats?.active_riders  || 0,                         icon: '🛵', color: '#0f6e56' },
  ];

  const STATUS_CLASS = { pending: 'badge-blue', preparing: 'badge-gold', delivered: 'badge-green', cancelled: 'badge-red', out_for_delivery: 'badge-gold' };

  return (
    <div className="admin-dashboard">
      <h1 className="dash-title font-display">Dashboard</h1>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map(k => (
          <div className="kpi-card card" key={k.label}>
            <div className="kpi-icon" style={{color: k.color}}>{k.icon}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card" style={{marginTop:'20px'}}>
        <div className="section-head">
          <h2 className="section-title font-display">Recent Orders</h2>
          <Link to="/admin/orders" className="view-all">View all →</Link>
        </div>
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span><span>Customer</span><span className="hide-sm">Total</span><span>Status</span><span className="hide-sm">Time</span>
          </div>
          {orders.length === 0
            ? <p style={{padding:'20px 16px',color:'var(--k2-text-muted)'}}>No orders today yet.</p>
            : orders.map(o => (
              <div className="table-row" key={o.id}>
                <span className="order-id-cell">#{o.id}</span>
                <span className="customer-cell">{o.user?.name || '—'}</span>
                <span className="hide-sm" style={{fontWeight:600}}>Rs {Number(o.total_amount).toLocaleString()}</span>
                <span><span className={`badge ${STATUS_CLASS[o.status] || ''}`}>{o.status?.replace(/_/g,' ')}</span></span>
                <span className="hide-sm" style={{fontSize:'12px',color:'var(--k2-text-muted)'}}>{new Date(o.placed_at).toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            ))
          }
        </div>
      </div>

      <style>{`
        .admin-dashboard { }
        .dash-title { font-size: 32px; color: var(--k2-black); margin-bottom: 20px; }
        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (min-width: 768px) { .kpi-grid { grid-template-columns: repeat(4,1fr); } }
        .kpi-card { padding: 18px; text-align: center; }
        .kpi-icon { font-size: 28px; margin-bottom: 8px; }
        .kpi-value { font-size: 26px; font-weight: 700; color: var(--k2-black); }
        .kpi-label { font-size: 13px; color: var(--k2-text-muted); margin-top: 4px; }
        .section-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 0; }
        .section-title { font-size: 22px; }
        .view-all { font-size: 13px; font-weight: 600; color: var(--k2-red); }
        .orders-table { padding: 8px 0; }
        .table-header { display: grid; grid-template-columns: 60px 1fr 100px 110px 70px; gap: 8px; padding: 8px 16px; font-size: 11px; font-weight: 600; color: var(--k2-text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--k2-border); }
        .table-row { display: grid; grid-template-columns: 60px 1fr 100px 110px 70px; gap: 8px; padding: 10px 16px; font-size: 13px; border-bottom: 1px solid var(--k2-border); align-items: center; }
        .table-row:last-child { border-bottom: none; }
        .order-id-cell { font-weight: 700; color: var(--k2-text-muted); }
        .customer-cell { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hide-sm { display: none; }
        @media (min-width: 600px) { .hide-sm { display: block; } }
      `}</style>
    </div>
  );
}
