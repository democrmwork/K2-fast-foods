/**
 * CartPage — /cart
 * Shows items from localStorage cart, lets user adjust quantities, place order.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';

export default function CartPage() {
  const [cart,    setCart]    = useState(() => JSON.parse(localStorage.getItem('k2_cart') || '[]'));
  const [address, setAddress] = useState('');
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
    setCart(updated); localStorage.setItem('k2_cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, i) => sum + (Number(i.price) * i.qty), 0);

  const placeOrder = async () => {
    if (!address.trim()) { setError('Please enter your delivery address.'); return; }
    if (cart.length === 0) { setError('Your cart is empty.'); return; }
    setLoading(true); setError('');
    try {
      const res = await orderService.place({
        items: cart.map(i => ({ menu_item_id: i.id, qty: i.qty })),
        delivery_address: address,
        notes,
      });
      localStorage.removeItem('k2_cart');
      navigate(`/orders/${res.data.data.order_id}/track`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <div style={{textAlign:'center',padding:'80px 20px'}}>
      <div style={{fontSize:'64px',marginBottom:'16px'}}>🛒</div>
      <h2 style={{fontFamily:"'Bebas Neue', cursive",fontSize:'28px',marginBottom:'8px'}}>Your cart is empty</h2>
      <p style={{color:'var(--k2-text-muted)',marginBottom:'24px'}}>Add some delicious items from our menu</p>
      <a href="/menu" className="btn btn-primary">Browse Menu</a>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title font-display">Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item card" key={item.id}>
                <div className="cart-item-emoji">🍔</div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">Rs {Number(item.price).toLocaleString()} each</p>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                </div>
                <div className="cart-item-total">Rs {(Number(item.price) * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h2 className="summary-title font-display">Order Summary</h2>
            {cart.map(i => <div className="summary-row" key={i.id}><span>{i.name} ×{i.qty}</span><span>Rs {(Number(i.price)*i.qty).toLocaleString()}</span></div>)}
            <div className="summary-divider"></div>
            <div className="summary-row summary-total"><strong>Total</strong><strong style={{color:'var(--k2-red)'}}>Rs {total.toLocaleString()}</strong></div>

            <div className="form-group" style={{marginTop:'20px'}}>
              <label className="form-label">Delivery Address *</label>
              <textarea className="form-input" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, area, city..." style={{resize:'vertical'}} />
            </div>
            <div className="form-group">
              <label className="form-label">Special Notes (optional)</label>
              <input className="form-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="No onions, extra sauce..." />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary btn-full btn-lg" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing order...' : `Place Order — Rs ${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page { padding: 28px 0 48px; }
        .page-title { font-size: 36px; margin-bottom: 24px; }
        .cart-layout { display: grid; gap: 20px; }
        @media (min-width: 900px) { .cart-layout { grid-template-columns: 1fr 380px; } }
        .cart-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; margin-bottom: 10px; }
        .cart-item-emoji { font-size: 32px; flex-shrink: 0; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name { font-size: 15px; font-weight: 600; }
        .cart-item-price { font-size: 13px; color: var(--k2-text-muted); }
        .qty-control { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 28px; height: 28px; border-radius: 50%; background: var(--k2-gray); font-size: 16px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .qty-btn:hover { background: var(--k2-red); color: #fff; }
        .qty-val { font-size: 15px; font-weight: 600; min-width: 24px; text-align: center; }
        .cart-item-total { font-size: 15px; font-weight: 700; color: var(--k2-red); min-width: 80px; text-align: right; }
        .cart-summary { padding: 20px; height: fit-content; }
        .summary-title { font-size: 24px; margin-bottom: 16px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .summary-divider { height: 1px; background: var(--k2-border); margin: 12px 0; }
        .summary-total { font-size: 16px; }
      `}</style>
    </div>
  );
}
