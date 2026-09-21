/**
 * RegisterPage — /register
 * New customer signup with validation and auto-login on success.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../store/AuthContext';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors,  setErrors]  = useState({});
  const [apiError,setApiError]= useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name     = 'Full name is required';
    if (!form.email)                    e.email    = 'Email is required';
    if (form.phone.length < 10)        e.phone    = 'Enter a valid phone number';
    if (form.password.length < 8)      e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(''); setLoading(true);
    try {
      const res = await authService.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      const { user, token } = res.data.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo"><span>K2</span> Fast Foods</div>
          <p>Create your account to start ordering</p>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'name',            label: 'Full Name',        type: 'text',     placeholder: 'Ali Hassan' },
            { name: 'email',           label: 'Email',            type: 'email',    placeholder: 'ali@example.com' },
            { name: 'phone',           label: 'Phone Number',     type: 'tel',      placeholder: '03xxxxxxxxx' },
            { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Min. 8 characters' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(field => (
            <div className="form-group" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input className={`form-input ${errors[field.name] ? 'error' : ''}`}
                type={field.type} name={field.name} value={form[field.name]}
                onChange={handleChange} placeholder={field.placeholder} />
              {errors[field.name] && <p className="form-error">{errors[field.name]}</p>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; background: var(--k2-black); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .auth-card { width: 100%; max-width: 440px; padding: 32px 28px; }
        .auth-header { text-align: center; margin-bottom: 24px; }
        .auth-logo { font-family: 'Bebas Neue', cursive; font-size: 28px; color: var(--k2-black); letter-spacing: 1px; }
        .auth-logo span { color: var(--k2-red); }
        .auth-header p { font-size: 14px; color: var(--k2-text-muted); margin-top: 4px; }
        .auth-footer { text-align: center; font-size: 14px; color: var(--k2-text-muted); margin-top: 20px; }
        .auth-link { color: var(--k2-red); font-weight: 600; }
      `}</style>
    </div>
  );
}
