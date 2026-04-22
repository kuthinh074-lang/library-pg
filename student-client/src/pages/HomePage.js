import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiBookOpen, FiArrowRight, FiFileText, FiStar, FiTrendingUp, FiClock, FiGrid } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COVERS = [
  ['#667eea','#764ba2'], ['#f093fb','#f5576c'], ['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'], ['#fa709a','#fee140'], ['#a18cd1','#fbc2eb'],
  ['#fccb90','#d57eeb'], ['#a1c4fd','#c2e9fb'], ['#fd7043','#ff8a65'], ['#26c6da','#00acc1'],
];

// ── Bìa sách giống ebook thật ─────────────────────────────────────────────
function BookCover({ book, index, size = 'md' }) {
  const [c1, c2] = COVERS[index % COVERS.length];
  const h = size === 'lg' ? 260 : size === 'sm' ? 140 : 200;
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 8,
      background: `linear-gradient(160deg, ${c1}, ${c2})`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Sọc trang sách */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'rgba(0,0,0,0.15)' }} />
      <FiBookOpen size={size === 'lg' ? 48 : 36} color="rgba(255,255,255,0.85)" />
      {book.pdf_url && book.is_public_pdf && (
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(22,163,74,0.9)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
          E-BOOK
        </div>
      )}
      {book.available_copies === 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(220,38,38,0.85)', color: '#fff', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '4px 0' }}>
          HẾT SÁCH
        </div>
      )}
    </div>
  );
}

// ── Card sách dạng dọc ────────────────────────────────────────────────────
function BookCard({ book, index, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', width: '100%' }}
      onMouseEnter={e => e.currentTarget.querySelector('.bcard-inner').style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.querySelector('.bcard-inner').style.transform = ''}>
      <div className="bcard-inner" style={{ transition: 'transform 0.25s', background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e8ecf0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <BookCover book={book} index={index} />
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4, color: '#1e293b', marginBottom: 3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {book.title}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{book.author}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, background: '#eff6ff', color: '#2563eb', padding: '2px 7px', borderRadius: 10, fontWeight: 600 }}>
              {book.category?.name}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: book.available_copies === 0 ? '#dc2626' : '#16a34a' }}>
              {book.available_copies === 0 ? 'Hết' : `${book.available_copies} bản`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scroll ngang cho section sách ────────────────────────────────────────
function BookRow({ books, startIndex = 0, onClick }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => scroll(-1)} style={arrowBtn('left')}>‹</button>
      <div ref={ref} style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, scrollSnapType: 'x mandatory' }}>
        <style>{`.scroll-hide::-webkit-scrollbar{display:none}`}</style>
        {books.map((book, i) => (
          <div key={book.id} style={{ minWidth: 160, maxWidth: 160, scrollSnapAlign: 'start' }}>
            <BookCard book={book} index={startIndex + i} onClick={() => onClick(book)} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} style={arrowBtn('right')}>›</button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch]       = useState('');
  const [newBooks, setNewBooks]   = useState([]);
  const [popular, setPopular]     = useState([]);
  const [ebooks, setEbooks]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats]         = useState({ books: 0, users: 0, borrows: 0 });
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/books', { params: { limit: 12, sort: 'created_at' } }),
      api.get('/books', { params: { limit: 12, sort: 'borrow_count', order: 'DESC' } }),
      api.get('/books', { params: { limit: 12, has_pdf: 'true', sort: 'created_at' } }),
      api.get('/categories'),
      api.get('/stats/dashboard').catch(() => ({ data: { data: {} } })),
    ]).then(([newR, popR, ebookR, catR, statR]) => {
      setNewBooks(newR.data.data || []);
      setPopular(popR.data.data || []);
      setEbooks(ebookR.data.data || []);
      setCategories(catR.data.data || []);
      const s = statR.data.data || {};
      setStats({ books: s.totalBooks || 0, users: s.totalUsers || 0, borrows: s.activeBorrows || 0 });
    }).finally(() => setLoading(false));
  }, []);

  const goBook = (book) => navigate(`/books/${book.id}`);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1d4ed8 100%)',
        padding: '56px 20px 48px', color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.1)' }} />

        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 13, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            Phần mềm mượn trả sách đang hoạt động
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: -1 }}>
            Khám phá kho tàng<br />
            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              tri thức số
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)', marginBottom: 32, lineHeight: 1.6 }}>
            Tra cứu, mượn sách và đọc E-Book trực tuyến — không giới hạn thời gian, không giới hạn không gian
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: 14, padding: '6px 6px 6px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxWidth: 640, margin: '0 auto 28px' }}>
            <FiSearch size={18} style={{ color: '#94a3b8', alignSelf: 'center', flexShrink: 0, marginRight: 10 }} />
            <input style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#1e293b' }}
              placeholder="Tìm tên sách, tác giả, ISBN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/books?search=${encodeURIComponent(search)}`)} />
            <button onClick={() => navigate(`/books?search=${encodeURIComponent(search)}`)}
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Tìm kiếm
            </button>
          </div>

          {/* Stats nhanh */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { n: stats.books.toLocaleString(), label: 'Đầu sách' },
              { n: stats.users.toLocaleString(), label: 'Người dùng' },
              { n: stats.borrows.toLocaleString(), label: 'Đang mượn' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button onClick={() => navigate('/books')}
            style={{ whiteSpace: 'nowrap', padding: '6px 16px', borderRadius: 20, border: '1.5px solid #2563eb', background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            🔍 Tất cả sách
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => navigate(`/books?category=${c.id}`)}
              style={{ whiteSpace: 'nowrap', padding: '6px 16px', borderRadius: 20, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.color='#2563eb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#374151'; }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Nội dung chính ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        {/* E-Book / Đọc Online */}
        {ebooks.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionHeader icon="📱" title="Đọc Online — E-Book miễn phí" link="/books?has_pdf=true" linkLabel="Xem tất cả E-Book" color="#16a34a" />
            {loading ? <Spinner /> : <BookRow books={ebooks} startIndex={0} onClick={goBook} />}
          </div>
        )}

        {/* Sách được mượn nhiều */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader icon="🔥" title="Được mượn nhiều nhất" link="/books" color="#ef4444" />
          {loading ? <Spinner /> : <BookRow books={popular} startIndex={10} onClick={goBook} />}
        </div>

        {/* Sách mới nhập */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader icon="✨" title="Sách mới nhập" link="/books" color="#2563eb" />
          {loading ? <Spinner /> : <BookRow books={newBooks} startIndex={20} onClick={goBook} />}
        </div>

        {/* Banner đặc trưng */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { icon: '📖', title: 'Tra cứu dễ dàng', desc: 'Tìm theo tên sách, tác giả, ISBN hoặc thể loại', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#bfdbfe', color: '#1d4ed8', link: '/books' },
            { icon: '📬', title: 'Đặt trước sách', desc: 'Đặt trước để ưu tiên khi sách về kệ', bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '#bbf7d0', color: '#15803d', link: '/books' },
            { icon: '💬', title: 'Liên hệ thủ thư', desc: 'Gửi câu hỏi hoặc yêu cầu đến thủ thư', bg: 'linear-gradient(135deg,#faf5ff,#ede9fe)', border: '#ddd6fe', color: '#6d28d9', link: user ? '/messages' : '/login' },
            { icon: '🔄', title: 'Gia hạn online', desc: 'Gia hạn sách ngay trên website, không cần đến thư viện', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', color: '#b45309', link: user ? '/my-borrows' : '/login' },
          ].map(f => (
            <Link key={f.title} to={f.link} style={{ textDecoration: 'none' }}>
              <div style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 14, padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: f.color, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>📚 Phần mềm mượn trả sách</div>
          <p style={{ fontSize: 13, marginBottom: 16 }}>Hệ thống quản lý thư viện & đọc sách trực tuyến</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 13 }}>
            <Link to="/books" style={{ color: '#60a5fa' }}>Danh mục sách</Link>
            {user && <Link to="/my-borrows" style={{ color: '#60a5fa' }}>Sách đang mượn</Link>}
            {user && <Link to="/messages" style={{ color: '#60a5fa' }}>Liên hệ thủ thư</Link>}
            {!user && <Link to="/login" style={{ color: '#60a5fa' }}>Đăng nhập</Link>}
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: '#475569' }}>© 2025 Phần mềm mượn trả sách. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}

function SectionHeader({ icon, title, link, linkLabel = 'Xem tất cả', color = '#2563eb' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{title}</span>
      </div>
      <Link to={link} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color, textDecoration: 'none' }}>
        {linkLabel} <FiArrowRight size={14} />
      </Link>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function arrowBtn(side) {
  return {
    position: 'absolute', [side]: -16, top: '50%', transform: 'translateY(-50%)',
    width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0',
    background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 10, fontSize: 18, color: '#374151',
    transition: 'all 0.2s',
  };
}