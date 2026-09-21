/**
 * MenuPage — /menu
 * Fetches all categories+items from API, shows category filter tabs,
 * and lets customers add items to a local cart (stored in localStorage).
 */
import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';

export default function MenuPage() {
  const [categories,   setCategories]  = useState([]);
  const [activeCategory, setActive]    = useState('all');
  const [loading,      setLoading]     = useState(true);
  const [cart,         setCart]        = useState(() => JSON.parse(localStorage.getItem('k2_cart') || '[]'));
  const [notification, setNotification]= useState('');

  useEffect(() => {
    menuService.getAll()
      .then(res => setCategories(res.data.data?.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    const updated  = existing
      ? cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      : [...cart, { ...item, qty: 1 }];
    setCart(updated);
    localStorage.setItem('k2_cart', JSON.stringify(updated));
    setNotification(`${item.name} added to cart!`);
    setTimeout(() => setNotification(''), 2000);
  };

  const allItems = categories.flatMap(c => c.items || []);
  const displayed = activeCategory === 'all'
    ? allItems
    : (categories.find(c => c.slug === activeCategory)?.items || []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px'}}><div className="spinner"></div></div>;

  return (
    <div className="menu-page">
      <div className="container">
        <h1 className="page-title font-display">Our Menu</h1>

        {/* Category tabs */}
        <div className="category-tabs">
          <button className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>All</button>
          {categories.map(cat => (
            <button key={cat.slug} className={`cat-tab ${activeCategory === cat.slug ? 'active' : ''}`} onClick={() => setActive(cat.slug)}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Notification toast */}
        {notification && <div className="alert alert-success">{notification}</div>}

        {/* Items grid */}
        <div className="menu-grid">
          {displayed.length === 0
            ? <p style={{color:'var(--k2-text-muted)',padding:'40px 0'}}>No items in this category yet.</p>
            : displayed.map(item => (
              <div className="menu-card card" key={item.id}>
                <div className="menu-card-img">{item.image_url ? <img src={item.image_url} alt={item.name} /> : <span className="menu-emoji">🍔</span>}</div>
                <div className="menu-card-body">
                  <h3 className="menu-item-name">{item.name}</h3>
                  {item.description && <p className="menu-item-desc">{item.description}</p>}
                  <div className="menu-item-footer">
                    <span className="menu-item-price">Rs {Number(item.price).toLocaleString()}</span>
                    {item.is_available
                      ? <button className="btn btn-secondary btn-sm" onClick={() => addToCart(item)}>Add +</button>
                      : <span className="badge badge-red">Sold Out</span>}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <style>{`
        .menu-page { padding: 28px 0 48px; }
        .page-title { font-size: 36px; color: var(--k2-black); margin-bottom: 20px; }
        .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .cat-tab { padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 2px solid var(--k2-border); background: var(--k2-white); color: var(--k2-text-muted); transition: all 0.15s; }
        .cat-tab:hover { border-color: var(--k2-red); color: var(--k2-red); }
        .cat-tab.active { background: var(--k2-red); border-color: var(--k2-red); color: #fff; }
        .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (min-width: 600px)  { .menu-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .menu-grid { grid-template-columns: repeat(4, 1fr); } }
        .menu-card { transition: transform 0.2s; }
        .menu-card:hover { transform: translateY(-4px); }
        .menu-card-img { height: 110px; background: var(--k2-gray); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .menu-card-img img { width: 100%; height: 100%; object-fit: cover; }
        .menu-emoji { font-size: 48px; }
        .menu-card-body { padding: 12px; }
        .menu-item-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .menu-item-desc { font-size: 12px; color: var(--k2-text-muted); margin-bottom: 10px; line-height: 1.4; }
        .menu-item-footer { display: flex; align-items: center; justify-content: space-between; }
        .menu-item-price { font-size: 16px; font-weight: 700; color: var(--k2-red); }
      `}</style>
    </div>
  );
}
