/**
 * HomePage — / (customer)
 * Hero section, popular items preview, CTA to full menu.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const FEATURED = [
  { emoji: '🍔', name: 'Zinger Burger',  price: 'Rs 350', tag: 'Best Seller' },
  { emoji: '🌯', name: 'Crispy Wrap',    price: 'Rs 280', tag: 'Popular' },
  { emoji: '🥙', name: 'Shawarma Roll',  price: 'Rs 320', tag: 'Trending' },
  { emoji: '🍟', name: 'Loaded Fries',   price: 'Rs 180', tag: 'Must Try' },
];

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="badge badge-gold">🔥 Free delivery today</span>
            <h1 className="hero-title font-display">Bold flavours.<br /><span className="hero-accent">Fast delivery.</span></h1>
            <p className="hero-sub">Burgers, wraps, pizza & more — fresh and hot at your door in 30 minutes.</p>
            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary btn-lg">Order Now</Link>
              <Link to="/orders" className="btn btn-outline btn-lg">Track Order</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-emoji">🍔</div>
          </div>
        </div>
      </section>

      {/* Featured items */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-display">Popular Right Now</h2>
            <Link to="/menu" className="section-link">View full menu →</Link>
          </div>
          <div className="featured-grid">
            {FEATURED.map((item, i) => (
              <div className="featured-card card" key={i}>
                <div className="featured-img">{item.emoji}</div>
                <div className="featured-body">
                  <span className="badge badge-red">{item.tag}</span>
                  <h3 className="featured-name">{item.name}</h3>
                  <div className="featured-footer">
                    <span className="featured-price">{item.price}</span>
                    <Link to="/menu" className="btn btn-secondary btn-sm">Add +</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why K2 */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title font-display" style={{textAlign:'center', marginBottom:'24px'}}>Why K2 Fast Foods?</h2>
          <div className="why-grid">
            {[['⚡','Fast Delivery','Order to door in 30 min or less'],['🍽️','Fresh Ingredients','Cooked fresh on every order'],['📍','Live Tracking','Track your rider in real time'],['💳','Easy Ordering','Simple checkout, multiple payment options']].map(([icon,title,desc]) => (
              <div className="why-card" key={title}>
                <div className="why-icon">{icon}</div>
                <h3 className="why-title">{title}</h3>
                <p className="why-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hero { background: var(--k2-black); padding: 48px 0; }
        .hero-inner { display: flex; flex-direction: column; gap: 32px; align-items: center; text-align: center; }
        @media (min-width: 768px) { .hero-inner { flex-direction: row; text-align: left; } .hero-content { flex: 1; } }
        .hero-title { font-size: 52px; color: var(--k2-white); line-height: 1.05; margin: 12px 0 10px; }
        .hero-accent { color: var(--k2-gold); }
        .hero-sub { font-size: 16px; color: #aaa; max-width: 440px; margin-bottom: 24px; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        @media (min-width: 768px) { .hero-actions { justify-content: flex-start; } }
        .hero-visual { font-size: 120px; line-height: 1; }
        .featured-section { padding: 48px 0; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .section-title { font-size: 32px; color: var(--k2-black); }
        .section-link { font-size: 14px; font-weight: 600; color: var(--k2-red); }
        .featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (min-width: 768px) { .featured-grid { grid-template-columns: repeat(4, 1fr); } }
        .featured-card { transition: transform 0.2s; }
        .featured-card:hover { transform: translateY(-4px); }
        .featured-img { height: 100px; display: flex; align-items: center; justify-content: center; font-size: 52px; background: var(--k2-gray); }
        .featured-body { padding: 12px; }
        .featured-name { font-size: 15px; font-weight: 600; margin: 6px 0 10px; }
        .featured-footer { display: flex; align-items: center; justify-content: space-between; }
        .featured-price { font-size: 16px; font-weight: 700; color: var(--k2-red); }
        .why-section { background: var(--k2-white); padding: 48px 0; }
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (min-width: 768px) { .why-grid { grid-template-columns: repeat(4, 1fr); } }
        .why-card { text-align: center; padding: 20px 12px; }
        .why-icon { font-size: 36px; margin-bottom: 10px; }
        .why-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .why-desc { font-size: 13px; color: var(--k2-text-muted); }
      `}</style>
    </div>
  );
}
