import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiBook, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const adminUrl = `${window.location.protocol}//${window.location.hostname}:3001`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      if (['admin', 'librarian'].includes(res.data.user.role)) {
        toast.error('Tài khoản admin/thủ thư vui lòng đăng nhập tại cổng quản trị.');
        return;
      }
      login(res.data.token, res.data.user);
      toast.success(`Chào mừng, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, color: '#2563eb', marginBottom: 8 }}><FiBook /></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>Đăng nhập</h2>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Dành cho sinh viên / độc giả</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input className="form-control" style={{ paddingLeft: 36 }} type="email"
                placeholder="email@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input className="form-control" style={{ paddingLeft: 36, paddingRight: 40 }}
                type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Đăng ký</Link>
        </p>
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
          Bạn là admin? <a href={adminUrl} style={{ color: '#2563eb' }}>Vào cổng quản trị →</a>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', student_id: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  const f = field => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 44, color: '#2563eb', marginBottom: 8 }}><FiBook /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Đăng ký tài khoản</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Dành cho sinh viên / độc giả</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Họ và tên *</label>
            <input className="form-control" placeholder="Nguyễn Văn A" {...f('name')} required /></div>
          <div className="form-group"><label className="form-label">Email *</label>
            <input className="form-control" type="email" placeholder="email@example.com" {...f('email')} required /></div>
          <div className="form-group"><label className="form-label">Mật khẩu *</label>
            <input className="form-control" type="password" placeholder="Tối thiểu 6 ký tự" {...f('password')} required minLength={6} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group"><label className="form-label">Mã sinh viên</label>
              <input className="form-control" placeholder="SV001" {...f('student_id')} /></div>
            <div className="form-group"><label className="form-label">Số điện thoại</label>
              <input className="form-control" placeholder="0901234567" {...f('phone')} /></div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
            type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
