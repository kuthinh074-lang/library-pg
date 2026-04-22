import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn } from '../components/Common';
import '../styles/tokens.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!form.username || !form.password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface2)' }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border2)', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '40px 36px', width: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'var(--primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text1)' }}>LibraViet</div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Hệ thống quản lý thư viện</div>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid #FFCDD2', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Tên đăng nhập / Username</label>
          <input
            className="form-input"
            placeholder="admin"
            value={form.username}
            onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
            onKeyDown={onKey}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Mật khẩu / Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={onKey}
          />
        </div>

        <Btn style={{ width: '100%', justifyContent: 'center', padding: '10px' }} loading={loading} onClick={handleLogin}>
          Đăng nhập / Sign In
        </Btn>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text3)' }}>
          LibraViet v1.0 · Powered by PostgreSQL + React
        </p>
      </div>
    </div>
  );
}
