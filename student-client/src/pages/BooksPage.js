import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiBook, FiGrid, FiList, FiFilter, FiX, FiFileText, FiBookOpen } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import api from '../services/api';

// Màu gradient cho cover
const COVERS = [
  'linear-gradient(160deg,#667eea,#764ba2)',
  'linear-gradient(160deg,#f093fb,#f5576c)',
  'linear-gradient(160deg,#4facfe,#00f2fe)',
  'linear-gradient(160deg,#43e97b,#38f9d7)',
  'linear-gradient(160deg,#fa709a,#fee140)',
  'linear-gradient(160deg,#a18cd1,#fbc2eb)',
  'linear-gradient(160deg,#fccb90,#d57eeb)',
  'linear-gradient(160deg,#a1c4fd,#c2e9fb)',
  'linear-gradient(160deg,#fd7043,#ff8a65)',
  'linear-gradient(160deg,#26c6da,#00acc1)',
];

// ── Card dạng GRID (bìa sách dọc) ─────────────────────────────────────────
function GridCard({ book, index, onClick }) {
  const avail = book.available_copies || 0;
  const hasPdf = !!book.pdf_url;
  const isPublicPdf = book.is_public_pdf;

  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
      background: '#fff', border: '1px solid #e8ecf0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'all 0.25s', display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
    >
      {/* Cover */}
      <div style={{
        background: COVERS[index % COVERS.length],
        height: 220, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '16px 12px',
      }}>
        {/* Badge PDF */}
        {hasPdf && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: isPublicPdf ? 'rgba(22,163,74,0.9)' : 'rgba(234,179,8,0.9)',
            color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '3px 8px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <FiFileText size={10} />
            {isPublicPdf ? 'E-Book' : 'PDF nội bộ'}
          </div>
        )}
        {/* Badge hết sách */}
        {avail === 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(220,38,38,0.85)', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          }}>Hết sách</div>
        )}
        {/* Icon sách */}
        <FiBookOpen size={52} color="rgba(255,255,255,0.9)" />
        {/* Tên hiện trên cover */}
        <div style={{
          color: 'rgba(255,255,255,0.95)', fontSize: 12, fontWeight: 700,
          textAlign: 'center', marginTop: 10, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{book.title}</div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4, color: '#1e293b',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{book.author}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>
            {book.category?.name}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: avail === 0 ? '#dc2626' : avail <= 2 ? '#d97706' : '#16a34a' }}>
            {avail === 0 ? '⛔ Hết' : `${avail} bản`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Card dạng LIST (ngang) ────────────────────────────────────────────────
function ListCard({ book, index, onClick }) {
  const avail = book.available_copies || 0;
  const hasPdf = !!book.pdf_url;

  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', borderRadius: 12, overflow: 'hidden',
      background: '#fff', border: '1px solid #e8ecf0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      display: 'flex', gap: 0, transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e8ecf0'; }}
    >
      {/* Cover nhỏ dạng dọc */}
      <div style={{
        background: COVERS[index % COVERS.length],
        width: 80, minHeight: 110, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FiBookOpen size={28} color="rgba(255,255,255,0.9)" />
      </div>

      {/* Info */}
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>{book.author}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <span style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 10 }}>{book.category?.name}</span>
          {hasPdf && (
            <span style={{ fontSize: 11, background: book.is_public_pdf ? '#dcfce7' : '#fef9c3', color: book.is_public_pdf ? '#16a34a' : '#92400e', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
              <FiFileText size={10} style={{ marginRight: 3 }} />{book.is_public_pdf ? 'E-Book' : 'PDF nội bộ'}
            </span>
          )}
          {book.publish_year && <span style={{ fontSize: 11, color: '#94a3b8' }}>{book.publish_year}</span>}
        </div>
      </div>

      {/* Trạng thái */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: avail === 0 ? '#dc2626' : avail <= 2 ? '#d97706' : '#16a34a' }}>
          {avail === 0 ? '⛔ Hết sách' : avail === 1 ? '⚠️ Còn 1 bản' : `✅ ${avail} bản`}
        </span>
        {book.location && <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>📍 {book.location}</span>}
      </div>
    </div>
  );
}

// ── Trang chính ───────────────────────────────────────────────────────────
export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [viewMode, setViewMode]     = useState('grid'); // 'grid' | 'list'
  const [showFilter, setShowFilter] = useState(false);

  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [available, setAvailable] = useState('');
  const [hasPdf, setHasPdf]     = useState('');
  const [sortBy, setSortBy]     = useState('created_at');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]       = useState(0);

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.data)); }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'grid' ? 20 : 15, sort: sortBy };
      if (search)    params.search    = search;
      if (category)  params.category  = category;
      if (available) params.available = available;
      if (hasPdf)    params.has_pdf   = hasPdf;
      const res = await api.get('/books', { params });
      setBooks(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  }, [search, category, available, hasPdf, sortBy, page, viewMode]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const activeFilters = [category, available, hasPdf].filter(Boolean).length;

  return (
    <>
      <Navbar />

      {/* ── Hero search bar ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '32px 0 24px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>
            📚 Phần mềm mượn trả sách
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            Khám phá hàng nghìn đầu sách — tìm kiếm, mượn sách và đọc online
          </p>
          {/* Search box */}
          <div style={{ display: 'flex', gap: 8, background: '#fff', borderRadius: 12, padding: '6px 6px 6px 16px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <FiSearch size={18} style={{ color: '#94a3b8', alignSelf: 'center', flexShrink: 0 }} />
            <input
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#1e293b' }}
              placeholder="Tìm tên sách, tác giả, ISBN..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              onKeyDown={e => e.key === 'Enter' && setPage(1)}
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px 8px' }}>
                <FiX size={16} />
              </button>
            )}
            <button onClick={() => setPage(1)}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Tìm
            </button>
          </div>

          {/* Quick category pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => { setCategory(''); setPage(1); }}
              style={{ padding: '5px 14px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,0.4)', background: !category ? 'rgba(255,255,255,0.25)' : 'transparent', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              Tất cả
            </button>
            {categories.slice(0, 8).map(c => (
              <button key={c.id} onClick={() => { setCategory(String(c.id)); setPage(1); }}
                style={{ padding: '5px 14px', borderRadius: 20, border: '1.5px solid rgba(255,255,255,0.4)', background: category === String(c.id) ? 'rgba(255,255,255,0.25)' : 'transparent', color: '#fff', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toolbar (sort, view, filter) ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', position: 'sticky', top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Kết quả */}
          <span style={{ fontSize: 13, color: '#64748b', flex: 1 }}>
            {loading ? 'Đang tải...' : <><strong style={{ color: '#1e293b' }}>{total.toLocaleString()}</strong> cuốn sách</>}
          </span>

          {/* Sắp xếp */}
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
            style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer' }}>
            <option value="created_at">Mới nhất</option>
            <option value="borrow_count">Phổ biến nhất</option>
            <option value="title">Tên A-Z</option>
          </select>

          {/* Bộ lọc nâng cao */}
          <button onClick={() => setShowFilter(f => !f)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${showFilter || activeFilters > 0 ? '#2563eb' : '#e2e8f0'}`, background: showFilter || activeFilters > 0 ? '#eff6ff' : '#fff', color: activeFilters > 0 ? '#2563eb' : '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <FiFilter size={14} /> Bộ lọc {activeFilters > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{activeFilters}</span>}
          </button>

          {/* View mode */}
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            {[['grid', <FiGrid size={15} />], ['list', <FiList size={15} />]].map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{ padding: '6px 12px', border: 'none', background: viewMode === mode ? '#2563eb' : '#fff', color: viewMode === mode ? '#fff' : '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Panel bộ lọc mở rộng */}
        {showFilter && (
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '14px 20px', maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Tình trạng</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['', 'Tất cả'], ['true', 'Còn sẵn']].map(([v, l]) => (
                  <button key={v} onClick={() => { setAvailable(v); setPage(1); }}
                    style={{ padding: '5px 14px', borderRadius: 20, border: `1.5px solid ${available === v ? '#2563eb' : '#e2e8f0'}`, background: available === v ? '#eff6ff' : '#fff', color: available === v ? '#2563eb' : '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Loại tài liệu</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['', 'Tất cả'], ['true', '📄 Có PDF/E-Book']].map(([v, l]) => (
                  <button key={v} onClick={() => { setHasPdf(v); setPage(1); }}
                    style={{ padding: '5px 14px', borderRadius: 20, border: `1.5px solid ${hasPdf === v ? '#2563eb' : '#e2e8f0'}`, background: hasPdf === v ? '#eff6ff' : '#fff', color: hasPdf === v ? '#2563eb' : '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {(available || hasPdf) && (
              <button onClick={() => { setAvailable(''); setHasPdf(''); setPage(1); }}
                style={{ padding: '5px 14px', borderRadius: 20, border: '1.5px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                <FiX size={12} /> Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Danh sách sách ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
        {loading ? (
          <div style={{ padding: 80, textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Đang tải sách...</p>
          </div>
        ) : books.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Không tìm thấy sách</h3>
            <p style={{ fontSize: 14 }}>Thử tìm với từ khóa khác hoặc bỏ bộ lọc</p>
            <button onClick={() => { setSearch(''); setCategory(''); setAvailable(''); setHasPdf(''); setPage(1); }}
              style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
              Xem tất cả sách
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 20 }}>
            {books.map((book, i) => (
              <GridCard key={book.id} book={book} index={i} onClick={() => navigate(`/books/${book.id}`)} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {books.map((book, i) => (
              <ListCard key={book.id} book={book} index={i} onClick={() => navigate(`/books/${book.id}`)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40 }}>
            <button onClick={() => setPage(1)} disabled={page === 1}
              style={{ ...pgBtn, opacity: page === 1 ? 0.4 : 1 }}>«</button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              style={{ ...pgBtn, opacity: page === 1 ? 0.4 : 1 }}>‹</button>
            {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
              let p;
              if (totalPages <= 9) p = i + 1;
              else if (page <= 5) p = i + 1;
              else if (page >= totalPages - 4) p = totalPages - 8 + i;
              else p = page - 4 + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ ...pgBtn, background: p === page ? '#2563eb' : '#fff', color: p === page ? '#fff' : '#374151', borderColor: p === page ? '#2563eb' : '#e2e8f0', fontWeight: p === page ? 700 : 400 }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
              style={{ ...pgBtn, opacity: page === totalPages ? 0.4 : 1 }}>›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              style={{ ...pgBtn, opacity: page === totalPages ? 0.4 : 1 }}>»</button>
          </div>
        )}
      </div>
    </>
  );
}

const pgBtn = {
  width: 36, height: 36, borderRadius: 8, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: 14, color: '#374151',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
};