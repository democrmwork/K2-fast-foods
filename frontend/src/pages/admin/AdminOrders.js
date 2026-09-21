/**
 * AdminOrders — /admin/orders
 * Purpose:        Full order management for admins.
 * Responsibility: List all orders with status filters, update order status.
 * Dependencies:   orderService, api.js
 */
import React, { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';

const STATUSES = ['all', 'pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_BADGE = {
  pending:          'badge badge-blue',
  accepted:         'badge badge-blue',
  preparing:        'badge badge-gold',
  out_for_delivery: 'badge badge-gold',
  delivered:        'badge badge-green',
  cancelled:        'badge badge-red',
};

const NEXT_STATUS = {
  pending:          'accepted',
  accepted:         'preparing',
  preparing:        'out_for_delivery',
  out_for_delivery: 'delivered',
};

export default function AdminOrders() {
  const [orders,        setOrders]       = useState([]);
  const [activeStatus,  setActiveStatus] = useState('all');
  const [loading,       setLoading]      = useState(true);
  const [updatingId,    setUpdatingId]   = useState(null);
  const [notification,  setNotification] = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = activeStatus !== 'all' ? { status: activeStatus } : {};
    orderService.getAll(params)
      .then(res => setOrders(res.data.data?.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [activeStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setNotification(`Order #${orderId} updated to "${newStatus.replace(/_/g, ' ')}"`);
      setTimeout(() => setNotification(''), 3000);
      fetchOrders();
    } catch {
      setNotification('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-orders">
      <h1 className="page-title font-display">Order Management</h1>

      {/* Status filter tabs */}
      <div className="status-tabs">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`status-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {notification && <div className="alert alert-success" style={{ marginBottom: 16 }}>{notification}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders found for this filter.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card card" key={order.id}>
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-num">Order #{order.id}</span>
                  <span className={STATUS_BADGE[order.status] || 'badge'}>
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="order-time">
                  {new Date(order.placed_at).toLocaleString('en-PK', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-detail">
                  <span className="detail-label">Customer</span>
                  <span className="detail-val">{order.user?.name || '—'} · {order.user?.phone || ''}</span>
                </div>
                <div className="order-detail">
                  <span className="detail-label">Address</span>
                  <span className="detail-val">{order.delivery_address}</span>
                </div>
                {order.special_notes && (
                  <div className="order-detail">
                    <span className="detail-label">Notes</span>
                    <span className="detail-val">{order.special_notes}</span>
                  </div>
                )}
                <div className="order-detail">
                  <span className="detail-label">Total</span>
                  <span className="detail-val order-total">Rs {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Action button */}
              {NEXT_STATUS[order.status] && (
                <div className="order-card-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={updatingId === order.id}
                    onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                  >
                    {updatingId === order.id
                      ? 'Updating...'
                      : `Mark as "${NEXT_STATUS[order.status].replace(/_/g, ' ')}"`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-orders { }
        .page-title { font-size: 32px; color: var(--k2-black); margin-bottom: 20px; }
        .status-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .status-tab { padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
          border: 2px solid var(--k2-border); background: var(--k2-white);
          color: var(--k2-text-muted); transition: all 0.15s; text-transform: capitalize; }
        .status-tab:hover { border-color: var(--k2-red); color: var(--k2-red); }
        .status-tab.active { background: var(--k2-red); border-color: var(--k2-red); color: #fff; }
        .empty-state { text-align: center; padding: 60px; color: var(--k2-text-muted); font-size: 15px; }
        .orders-list { display: flex; flex-direction: column; gap: 14px; }
        .order-card { }
        .order-card-header { display: flex; justify-content: space-between; align-items: center;
          padding: 14px 16px; border-bottom: 1px solid var(--k2-border); flex-wrap: wrap; gap: 8px; }
        .order-meta { display: flex; align-items: center; gap: 10px; }
        .order-num { font-size: 15px; font-weight: 700; }
        .order-time { font-size: 12px; color: var(--k2-text-muted); }
        .order-card-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
        .order-detail { display: flex; gap: 12px; font-size: 13px; }
        .detail-label { color: var(--k2-text-muted); font-weight: 600; min-width: 70px; flex-shrink: 0; }
        .detail-val { color: var(--k2-text); }
        .order-total { font-weight: 700; color: var(--k2-red); font-size: 15px; }
        .order-card-footer { padding: 12px 16px; border-top: 1px solid var(--k2-border); }
      `}</style>
    </div>
  );
}
