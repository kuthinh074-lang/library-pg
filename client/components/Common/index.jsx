import React from 'react';
import './Common.css';

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ type = 'gray', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Btn({ variant = 'primary', size = 'md', icon, loading, disabled, onClick, children, style }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? <span className="btn-spinner" /> : icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}

// ─── ICON BUTTON ─────────────────────────────────────────────────────────────
export function IconBtn({ title, danger, onClick, children }) {
  return (
    <button
      className={`icon-btn${danger ? ' icon-btn-danger' : ''}`}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─── CARD ────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}
export function CardHeader({ title, actions }) {
  return (
    <div className="card-header">
      <span className="card-title">{title}</span>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}
export function CardBody({ children, noPad }) {
  return <div className={`card-body${noPad ? ' card-body--no-pad' : ''}`}>{children}</div>;
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
export function Modal({ open, title, onClose, footer, children, width = 480 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: width }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────
export function FormField({ label, required, children }) {
  return (
    <div className="form-row">
      <label className="form-label">{label}{required && <span className="required"> *</span>}</label>
      {children}
    </div>
  );
}
export function FormInput({ ...props }) {
  return <input className="form-input" {...props} />;
}
export function FormSelect({ options = [], ...props }) {
  return (
    <select className="form-input" {...props}>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}
export function FormGrid({ children }) {
  return <div className="form-grid">{children}</div>;
}

// ─── SEARCH BOX ──────────────────────────────────────────────────────────────
export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text3)">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, delta, deltaType = 'up', color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon--${color}`}>{icon}</div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-label">{label}</div>
        {delta && <div className={`stat-delta delta-${deltaType}`}>{delta}</div>}
      </div>
    </div>
  );
}

// ─── PAGINATION ──────────────────────────────────────────────────────────────
export function Pagination({ page, limit, total, onPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);

  return (
    <div className="pager">
      <span className="pager-info">Hiển thị {start}–{end} / {total}</span>
      <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
      {pages.map((p) => (
        <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>›</button>
    </div>
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
export function Avatar({ name = '', color = 'blue', size = 34 }) {
  const initials = name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();
  const colors = {
    blue: { bg: '#E3F2FD', color: '#1565C0' },
    green: { bg: '#E8F5E9', color: '#2E7D32' },
    amber: { bg: '#FFF3E0', color: '#F57C00' },
    red: { bg: '#FFEBEE', color: '#C62828' },
    purple: { bg: '#EDE7F6', color: '#6A1B9A' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, ...c }}>
      {initials}
    </div>
  );
}

// ─── BOOK COVER PLACEHOLDER ──────────────────────────────────────────────────
export function BookCover({ genre, size = { w: 34, h: 46 } }) {
  const map = {
    'Văn học': { bg: '#1565C0', label: 'VH' },
    Literature: { bg: '#1565C0', label: 'LT' },
    'Khoa học': { bg: '#00695C', label: 'KH' },
    Science: { bg: '#00695C', label: 'SC' },
    'Lịch sử': { bg: '#6A1B9A', label: 'LS' },
    History: { bg: '#6A1B9A', label: 'HI' },
    'Kinh tế': { bg: '#C62828', label: 'KT' },
    Economics: { bg: '#C62828', label: 'EC' },
    'Kỹ năng': { bg: '#F57C00', label: 'KN' },
    'Self-Help': { bg: '#F57C00', label: 'SH' },
    'Thiếu nhi': { bg: '#558B2F', label: 'TN' },
    "Children's": { bg: '#558B2F', label: 'CH' },
  };
  const c = map[genre] || { bg: '#90A4AE', label: genre?.slice(0, 2).toUpperCase() || '??' };
  return (
    <div
      className="book-cover"
      style={{ width: size.w, height: size.h, background: c.bg }}
    >
      {c.label}
    </div>
  );
}

// ─── LOADING SPINNER ─────────────────────────────────────────────────────────
export function Spinner({ text = 'Đang tải...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
export function Empty({ message = 'Không có dữ liệu' }) {
  return <div className="empty-state">{message}</div>;
}

// ─── ALERT ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'warning', title, children }) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{type === 'warning' ? '⚠️' : 'ℹ️'}</div>
      <div>
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-text">{children}</div>
      </div>
    </div>
  );
}
