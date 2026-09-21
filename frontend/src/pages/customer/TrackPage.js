/**
 * TrackPage — /orders/:id/track
 * Live delivery status with step tracker. Polls every 15 seconds.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const STEPS = [
  { key: 'pending',          label: 'Order Placed',    icon: '📋' },
  { key: 'accepted',         label: 'Accepted',        icon: '✅' },
  { key: 'preparing',        label: 'Preparing',       icon: '👨‍🍳' },
  { key: 'out_for_delivery', label: 'On the Way',      icon: '🛵' },
  { key: 'delivered',        label: 'Delivered',       icon: '🏠' },
];

export default function TrackPage() {
  const { id } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading,  setLoading]  = useState(true);

  const fetchTracking = useCallback(() => {
    orderService.track(id)
      .then(res => setTracking(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 15000);
    return () => clearInterval(interval);
  }, [fetchTracking]);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px'}}><div className="spinner"></div></div>;

  const currentIdx = STEPS.findIndex(s => s.key === tracking?.status);

  return (
    <div className="track-page">
      <div className="container">
        <Link to="/orders" className="back-link">← Back to orders</Link>
        <h1 className="page-title font-display">Track Order #{id}</h1>

        {/* Status card */}
        <div className="track-card card">
          <div className="track-status-header">
            <div>
              <p className="track-status-label">Current status</p>
              <h2 className="track-status-value">{tracking?.status?.replace(/_/g, ' ') || '—'}</h2>
            </div>
            {tracking?.eta_minutes && (
              <div className="eta-box">
                <p className="eta-label">ETA</p>
                <p className="eta-value">{tracking.eta_minutes} min</p>
              </div>
            )}
          </div>

          {/* Step tracker */}
          <div className="steps">
            {STEPS.map((step, i) => {
              const done   = i < currentIdx;
              const active = i === currentIdx;
              return (
                <React.Fragment key={step.key}>
                  <div className="step">
                    <div className={`step-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>{step.icon}</div>
                    <p className={`step-label ${done ? 'done' : ''} ${active ? 'active' : ''}`}>{step.label}</p>
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${done ? 'done' : ''}`}></div>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Rider info */}
          {tracking?.rider && (
            <div className="rider-info">
              <span className="rider-icon">🛵</span>
              <div>
                <p className="rider-name">{tracking.rider.name} is on the way</p>
                <p className="rider-sub">Your order is heading to you</p>
              </div>
            </div>
          )}
        </div>

        <div style={{textAlign:'center',marginTop:'20px'}}>
          <p style={{fontSize:'13px',color:'var(--k2-text-muted)'}}>Page refreshes automatically every 15 seconds</p>
        </div>
      </div>

      <style>{`
        .track-page { padding: 28px 0 48px; }
        .back-link { font-size: 14px; color: var(--k2-red); font-weight: 600; display: inline-block; margin-bottom: 16px; }
        .page-title { font-size: 32px; margin-bottom: 20px; }
        .track-card { padding: 24px; }
        .track-status-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
        .track-status-label { font-size: 13px; color: var(--k2-text-muted); }
        .track-status-value { font-size: 22px; font-weight: 700; text-transform: capitalize; margin-top: 4px; }
        .eta-box { background: var(--k2-gold-light); border-radius: 8px; padding: 10px 16px; text-align: center; }
        .eta-label { font-size: 11px; color: var(--k2-gold-dark); font-weight: 600; text-transform: uppercase; }
        .eta-value { font-size: 22px; font-weight: 700; color: var(--k2-gold-dark); }
        .steps { display: flex; align-items: center; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
        .step-dot { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--k2-border); background: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; filter: grayscale(1); opacity: 0.4; }
        .step-dot.done  { border-color: #0f6e56; filter: none; opacity: 1; background: #e1f5ee; }
        .step-dot.active { border-color: var(--k2-red); filter: none; opacity: 1; background: var(--k2-red-light); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .step-label { font-size: 11px; color: var(--k2-text-muted); text-align: center; max-width: 60px; }
        .step-label.done  { color: #0f6e56; font-weight: 600; }
        .step-label.active { color: var(--k2-red); font-weight: 700; }
        .step-line { flex: 1; height: 2px; background: var(--k2-border); min-width: 16px; }
        .step-line.done { background: #0f6e56; }
        .rider-info { display: flex; align-items: center; gap: 14px; background: var(--k2-gray); border-radius: var(--k2-radius-sm); padding: 14px 16px; }
        .rider-icon { font-size: 28px; }
        .rider-name { font-size: 15px; font-weight: 600; }
        .rider-sub  { font-size: 13px; color: var(--k2-text-muted); }
      `}</style>
    </div>
  );
}
