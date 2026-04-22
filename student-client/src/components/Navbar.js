import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiBook, FiUser, FiLogOut, FiLogIn, FiMessageSquare, FiList } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FiBook size={22} />
        Phần mềm mượn trả sách
      </Link>

      <div className="navbar-nav">
        <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>
          Trang chủ
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Danh mục sách
        </NavLink>
        {user && (
          <>
            <NavLink to="/my-borrows" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiList size={14} /> Sách đang mượn
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiMessageSquare size={14} /> Liên hệ
            </NavLink>
          </>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              {user.name} {user.student_id ? `(${user.student_id})` : ''}
            </span>
            <div className="avatar-sm">{user.name?.[0]?.toUpperCase()}</div>
            <Link to="/profile" className="nav-link" style={{ padding: '6px 10px' }}><FiUser size={16} /></Link>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={handleLogout}>
              <FiLogOut size={14} /> Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>
            <FiLogIn size={14} /> Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
