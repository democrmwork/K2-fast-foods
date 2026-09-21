/**
 * AdminMenu — /admin/menu
 * Purpose:        Full CRUD for menu categories and items.
 * Responsibility: List, add, edit availability, delete menu items.
 * Dependencies:   menuService
 */
import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';

export default function AdminMenu() {
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [notification,setNotification]= useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', image_url: '', is_available: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchMenu = () => {
    setLoading(true);
    menuService.getAll()
      .then(res => setCategories(res.data.data?.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMenu(); }, []);

  const allItems = categories.flatMap(c => (c.items || []).map(i => ({ ...i, category_name: c.name })));

  const openAdd  = () => { setEditItem(null); setForm({ name:'', description:'', price:'', category_id: categories[0]?.id || '', image_url:'', is_available: true }); setFormError(''); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, description: item.description||'', price: item.price, category_id: item.category_id, image_url: item.image_url||'', is_available: !!item.is_available }); setFormError(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditItem(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category_id) { setFormError('Name, price and category are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editItem) {
        await menuService.update(editItem.id, form);
        setNotification(`"${form.name}" updated successfully.`);
      } else {
        await menuService.create(form);
        setNotification(`"${form.name}" added to menu.`);
      }
      setTimeout(() => setNotification(''), 3000);
      closeForm(); fetchMenu();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save item.');
    } finally { setSaving(false); }
  };

  const toggleAvailability = async (item) => {
    try {
      await menuService.update(item.id, { is_available: !item.is_available });
      setNotification(`"${item.name}" marked as ${!item.is_available ? 'available' : 'unavailable'}.`);
      setTimeout(() => setNotification(''), 3000);
      fetchMenu();
    } catch { setNotification('Failed to update availability.'); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await menuService.delete(item.id);
      setNotification(`"${item.name}" deleted.`);
      setTimeout(() => setNotification(''), 3000);
      fetchMenu();
    } catch { setNotification('Failed to delete item.'); }
  };

  return (
    <div className="admin-menu">
      <div className="menu-top">
        <h1 className="page-title font-display">Menu Management</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Item</button>
      </div>

      {notification && <div className="alert alert-success">{notification}</div>}

      {/* Add / Edit form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-card card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title font-display">{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Zinger Burger" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (Rs) *</label>
                <input className="form-input" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="350.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short item description..." style={{resize:'vertical'}} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL (optional)</label>
                <input className="form-input" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:10}}>
                <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} />
                <label htmlFor="avail" className="form-label" style={{marginBottom:0}}>Available for ordering</label>
              </div>
              {formError && <div className="alert alert-error">{formError}</div>}
              <div style={{display:'flex',gap:10}}>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}</button>
                <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div className="spinner"></div></div>
      ) : (
        <div className="menu-table card">
          <div className="table-head">
            <span>Item</span><span>Category</span><span>Price</span><span>Status</span><span>Actions</span>
          </div>
          {allItems.length === 0
            ? <p style={{padding:'24px 16px',color:'var(--k2-text-muted)'}}>No menu items yet. Add your first item!</p>
            : allItems.map(item => (
              <div className="table-row" key={item.id}>
                <span className="item-name-cell">
                  <span className="item-emoji">🍔</span>
                  <span>
                    <div style={{fontWeight:600,fontSize:14}}>{item.name}</div>
                    {item.description && <div style={{fontSize:12,color:'var(--k2-text-muted)',marginTop:2}}>{item.description.slice(0,40)}{item.description.length>40?'…':''}</div>}
                  </span>
                </span>
                <span className="hide-sm"><span className="badge badge-blue">{item.category_name}</span></span>
                <span style={{fontWeight:700,color:'var(--k2-red)'}}>Rs {Number(item.price).toLocaleString()}</span>
                <span>
                  <button className={`avail-toggle ${item.is_available ? 'on' : 'off'}`} onClick={() => toggleAvailability(item)}>
                    {item.is_available ? '● Available' : '○ Unavailable'}
                  </button>
                </span>
                <span className="action-btns">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn-sm del-btn" onClick={() => handleDelete(item)}>Delete</button>
                </span>
              </div>
            ))
          }
        </div>
      )}

      <style>{`
        .admin-menu { }
        .menu-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .page-title { font-size: 32px; color: var(--k2-black); }
        .menu-table { overflow: hidden; }
        .table-head { display: grid; grid-template-columns: 2fr 1fr 90px 110px 130px; gap: 8px;
          padding: 10px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; color: var(--k2-text-muted); border-bottom: 1px solid var(--k2-border); background: var(--k2-gray); }
        .table-row { display: grid; grid-template-columns: 2fr 1fr 90px 110px 130px; gap: 8px;
          padding: 12px 16px; border-bottom: 1px solid var(--k2-border); align-items: center; font-size: 13px; }
        .table-row:last-child { border-bottom: none; }
        .item-name-cell { display: flex; align-items: center; gap: 10px; }
        .item-emoji { font-size: 22px; flex-shrink: 0; }
        .avail-toggle { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; border: 1.5px solid; cursor: pointer; transition: all 0.15s; }
        .avail-toggle.on  { color: #0f6e56; border-color: #0f6e56; background: #e1f5ee; }
        .avail-toggle.off { color: var(--k2-text-muted); border-color: var(--k2-border); background: var(--k2-gray); }
        .action-btns { display: flex; gap: 6px; }
        .del-btn { color: var(--k2-red); border: 1.5px solid var(--k2-red-light); background: var(--k2-red-light); }
        .del-btn:hover { background: var(--k2-red); color: #fff; }
        .hide-sm { display: none; }
        @media (min-width: 600px) { .hide-sm { display: block; } }
        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: 100%; max-width: 480px; padding: 24px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-title { font-size: 24px; }
        .modal-close { font-size: 18px; color: var(--k2-text-muted); padding: 4px 8px; border-radius: 4px; }
        .modal-close:hover { background: var(--k2-gray); }
      `}</style>
    </div>
  );
}
