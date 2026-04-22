import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBox } from '../Common';
import './Layout.css';

const NAV = [
  {
    section: 'nav_overview',
    items: [
      { to: '/',        key: 'nav_dashboard', badge: null,   icon: <IconDashboard /> },
      { to: '/books',   key: 'nav_books',     badge: null,   icon: <IconBook /> },
      { to: '/borrow',  key: 'nav_borrow',    badge: 34,     icon: <IconBorrow /> },
    ],
  },
  {
    section: 'nav_management',
    items: [
      { to: '/members', key: 'nav_members',   badge: null,   icon: <IconMembers /> },
      { to: '/overdue', key: 'nav_overdue',   badge: 8,      icon: <IconWarning />, badgeDanger: true },
      { to: '/reports', key: 'nav_reports',   badge: null,   icon: <IconReport /> },
    ],
  },
  {
    section: 'nav_system',
    items: [
      { to: '/settings', key: 'nav_settings', badge: null,  icon: <IconSettings /> },
    ],
  },
];

export default function Layout({ children, search, onSearch }) {
  const { t, lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitles = {
    '/':         t('nav_dashboard'),
    '/books':    t('nav_books'),
    '/borrow':   t('nav_borrow'),
    '/members':  t('nav_members'),
    '/overdue':  t('nav_overdue'),
    '/reports':  t('nav_reports'),
    '/settings': t('nav_settings'),
  };

  return (
    <div className="layout">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <IconLibrary />
          </div>
          <div className="logo-name">LibraViet</div>
          <div className="logo-sub">Hệ thống quản lý thư viện</div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((group) => (
            <div key={group.section} className="nav-section">
              <div className="nav-label">{t(group.section)}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  {item.icon}
                  <span>{t(item.key)}</span>
                  {item.badge != null && (
                    <span className={`nav-badge${item.badgeDanger ? ' nav-badge-danger' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card" title={t('nav_settings')}>
            <div className="user-avatar">
              {user?.name?.split(' ').slice(-1)[0]?.[0] || 'A'}
            </div>
            <div>
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role">{user?.role === 'admin' ? 'Quản trị viên' : 'Thủ thư'}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Đăng xuất">
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">
        <header className="topbar">
          <div className="topbar-title">
            {pageTitles[location.pathname] || 'LibraViet'}
            <span className="topbar-date">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>

          <SearchBox
            value={search}
            onChange={onSearch}
            placeholder={t('search_placeholder')}
          />

          <div className="lang-switcher">
            <button className={`lang-opt${lang === 'vi' ? ' active' : ''}`} onClick={() => setLang('vi')}>VI</button>
            <button className={`lang-opt${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function IconLibrary()  { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>; }
function IconDashboard(){ return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>; }
function IconBook()     { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>; }
function IconBorrow()   { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.53 16.5 1 14.65 1c-1.05 0-1.96.5-2.65 1.26L12 2.27l-.01-.02C11.31 1.5 10.4 1 9.35 1 7.5 1 6 2.53 6 4.65c0 .48.11.91.18 1.35H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>; }
function IconMembers()  { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>; }
function IconWarning()  { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>; }
function IconReport()   { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>; }
function IconSettings() { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>; }
function IconLogout()   { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>; }
