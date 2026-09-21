/**
 * AppRoutes.js
 * Purpose:        Declare all client-side routes.
 * Responsibility: Public routes, customer routes (auth required),
 *                 admin routes (admin role required).
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

// Auth pages
import LoginPage    from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer pages
import HomePage      from '../pages/customer/HomePage';
import MenuPage      from '../pages/customer/MenuPage';
import CartPage      from '../pages/customer/CartPage';
import OrdersPage    from '../pages/customer/OrdersPage';
import TrackPage     from '../pages/customer/TrackPage';

// Admin pages
import AdminDashboard  from '../pages/admin/AdminDashboard';
import AdminOrders     from '../pages/admin/AdminOrders';
import AdminMenu       from '../pages/admin/AdminMenu';
import AdminUsers      from '../pages/admin/AdminUsers';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout    from '../layouts/AdminLayout';

// Guards
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer routes */}
      <Route path="/" element={<RequireAuth><CustomerLayout /></RequireAuth>}>
        <Route index         element={<HomePage />} />
        <Route path="menu"   element={<MenuPage />} />
        <Route path="cart"   element={<CartPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id/track" element={<TrackPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index           element={<AdminDashboard />} />
        <Route path="orders"   element={<AdminOrders />} />
        <Route path="menu"     element={<AdminMenu />} />
        <Route path="users"    element={<AdminUsers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
