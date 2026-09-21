/**
 * LoginPage — /login
 * Handles login form, calls authService, saves token via AuthContext.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../store/AuthContext';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authService.login(form);
      const { user, token } = res.data.data;
      login(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo"><span>K2</span> Fast Foods</div>
          <p>Welcome back! Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min. 8 characters" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; background: var(--k2-black); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .auth-card { width: 100%; max-width: 420px; padding: 32px 28px; }
        .auth-header { text-align: center; margin-bottom: 24px; }
        .auth-logo { font-family: 'Bebas Neue', cursive; font-size: 28px; color: var(--k2-black); letter-spacing: 1px; }
        .auth-logo span { color: var(--k2-red); }
        .auth-header p { font-size: 14px; color: var(--k2-text-muted); margin-top: 4px; }
        .auth-footer { text-align: center; font-size: 14px; color: var(--k2-text-muted); margin-top: 20px; }
        .auth-link { color: var(--k2-red); font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
