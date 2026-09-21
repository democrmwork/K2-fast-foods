/**
 * OrdersPage — /orders
 * Lists the logged-in customer's past and active orders.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const STATUS_BADGE = {
  pending:          'badge badge-blue',
  accepted:         'badge badge-blue',
  preparing:        'badge badge-gold',
  out_for_delivery: 'badge badge-gold',
  delivered:        'badge badge-green',
  cancelled:        'badge badge-red',
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px'}}><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title font-display">My Orders</h1>
        {orders.length === 0
          ? <div style={{textAlign:'center',padding:'60px 20px'}}><div style={{fontSize:'60px',marginBottom:'12px'}}>🍽️</div><h3>No orders yet</h3><p style={{color:'var(--k2-text-muted)',margin:'8px 0 20px'}}>Browse our menu and place your first order!</p><Link to="/menu" className="btn btn-primary">Browse Menu</Link></div>
          : orders.map(order => (
            <div className="order-card card" key={order.id}>
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className={STATUS_BADGE[order.status] || 'badge'} style={{marginLeft:'10px'}}>
                    {order.status?.replace(/_/g,' ')}
                  </span>
                </div>
                <span className="order-date">{new Date(order.placed_at).toLocaleDateString('en-PK', {day:'numeric',month:'short',year:'numeric'})}</span>
              </div>
              <div className="order-body">
                <p className="order-address">📍 {order.delivery_address}</p>
                <p className="order-total">Total: <strong style={{color:'var(--k2-red)'}}>Rs {Number(order.total_amount).toLocaleString()}</strong></p>
              </div>
              {['pending','accepted','preparing','out_for_delivery'].includes(order.status) && (
                <Link to={`/orders/${order.id}/track`} className="btn btn-secondary btn-sm" style={{margin:'0 16px 16px'}}>
                  📍 Track Order
                </Link>
              )}
            </div>
          ))
        }
      </div>

      <style>{`
        .orders-page { padding: 28px 0 48px; }
        .page-title { font-size: 36px; margin-bottom: 24px; }
        .order-card { margin-bottom: 14px; }
        .order-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--k2-border); flex-wrap: wrap; gap: 8px; }
        .order-id { font-size: 15px; font-weight: 700; }
        .order-date { font-size: 13px; color: var(--k2-text-muted); }
        .order-body { padding: 12px 16px; }
        .order-address { font-size: 14px; color: var(--k2-text-muted); margin-bottom: 6px; }
        .order-total { font-size: 15px; }
      `}</style>
    </div>
  );
}
