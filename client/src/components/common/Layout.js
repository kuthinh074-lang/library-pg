import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiBook, FiList, FiDollarSign, FiBookmark, FiInbox,
  FiUser, FiLogOut, FiUsers, FiBarChart2, FiTag, FiMenu, FiX, FiTrendingUp
} from 'react-icons/fi';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isAdmin = ['admin', 'librarian'].includes(user?.role);
  const isOnlyLibrarian = user?.role === 'librarian';

  const userLinks = [
    { to: '/', icon: <FiHome />, label: 'Trang chủ' },
    { to: '/books', icon: <FiBook />, label: 'Danh mục sách' },
    { to: '/contact', icon: <FiInbox />, label: 'Liên hệ admin' },
    { to: '/my-borrows', icon: <FiList />, label: 'Sách đang mượn' },
    { to: '/my-reservations', icon: <FiBookmark />, label: 'Đặt trước' },
    { to: '/my-fines', icon: <FiDollarSign />, label: 'Phí phạt' },
    { to: '/profile', icon: <FiUser />, label: 'Tài khoản' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <FiBarChart2 />, label: 'Dashboard' },
    { to: '/admin/books', icon: <FiBook />, label: 'Quản lý sách' },
    { to: '/admin/categories', icon: <FiTag />, label: 'Thể loại' },
    { to: '/admin/borrow', icon: <FiList />, label: '📤 Mượn Sách' },
    { to: '/admin/return', icon: <FiList />, label: '📥 Trả Sách' },
    { to: '/admin/fines', icon: <FiDollarSign />, label: 'Phí phạt' },
    ...(!isOnlyLibrarian ? [{ to: '/admin/users', icon: <FiUsers />, label: 'Người dùng' }] : []),
    { to: '/admin/messages', icon: <FiInbox />, label: 'Tin nhắn' },
    { to: '/admin/reports',  icon: <FiTrendingUp />, label: 'Báo cáo' },
  ];

  const SidebarContent = () => (
    <>
      <div className="sidebar-logo">
        <FiBook size={22} />
        <div>
          <div>Phần mềm mượn trả sách</div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>Library System</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">Menu</div>
        {userLinks.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setSidebarOpen(false)}>
            {l.icon} {l.label}
          </NavLink>
        ))}
        {isAdmin && (
          <>
            <div className="nav-section">Quản trị</div>
            {adminLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/admin'} onClick={() => setSidebarOpen(false)}>
                {l.icon} {l.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
          <FiLogOut /> Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="layout">
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)} />
      )}

      <div className="sidebar" style={sidebarOpen ? { transform: 'translateX(0)' } : {}}>
        <SidebarContent />
      </div>

      <div className="main-content">
        <div className="topbar">
          <button className="btn btn-secondary btn-icon" style={{ display: 'none' }}
            onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>
            Phần mềm mượn trả sách
          </div>
          <div className="topbar-right">
            {user?.unpaidFines > 0 && (
              <span className="badge badge-danger">
                Nợ: {user.unpaidFines.toLocaleString('vi-VN')}đ
              </span>
            )}
            <div className="user-menu" onClick={() => navigate('/profile')}>
              <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'librarian' ? 'Thủ thư' : 'Độc giả'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
