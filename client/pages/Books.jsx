import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LangContext';
import { booksAPI } from '../../services/api';
import { usePaginatedList, useMutation } from '../../hooks/useData';
import {
  Btn, IconBtn, Card, CardHeader, CardBody,
  Badge, Modal, FormField, FormInput, FormSelect, FormGrid,
  Pagination, BookCover, Spinner, Empty,
} from '../Common';

const GENRES = ['Văn học', 'Khoa học', 'Lịch sử', 'Kinh tế', 'Thiếu nhi', 'Kỹ thuật', 'Kỹ năng'];
const CATS = [
  { label: 'Tất cả', value: '', icon: '📚', bg: '#E3F2FD', color: '#1565C0', count: 1247 },
  { label: 'Văn học', value: 'Văn học', icon: '✍️', bg: '#E8F5E9', color: '#2E7D32', count: 389 },
  { label: 'Khoa học', value: 'Khoa học', icon: '🔬', bg: '#EDE7F6', color: '#6A1B9A', count: 234 },
  { label: 'Lịch sử', value: 'Lịch sử', icon: '🏛️', bg: '#FFF3E0', color: '#E65100', count: 178 },
  { label: 'Kinh tế', value: 'Kinh tế', icon: '💼', bg: '#FFEBEE', color: '#C62828', count: 156 },
  { label: 'Thiếu nhi', value: 'Thiếu nhi', icon: '🧸', bg: '#F1F8E9', color: '#558B2F', count: 102 },
  { label: 'Kỹ thuật', value: 'Kỹ thuật', icon: '⚙️', bg: '#E0F7FA', color: '#00838F', count: 88 },
  { label: 'Kỹ năng', value: 'Kỹ năng', icon: '🎯', bg: '#FFF3E0', color: '#F57C00', count: 100 },
];

const EMPTY_FORM = { title: '', author: '', year: new Date().getFullYear(), genre: 'Văn học', isbn: '', publisher: '', quantity: 1 };

// ── MOCK DATA (xóa khi có API thật) ───────────────────────────────────────────
const MOCK_BOOKS = [
  { id: 1, title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', year: 1941, genre: 'Văn học', isbn: '978-604-2-34', publisher: 'NXB Kim Đồng', quantity: 5, available: 4 },
  { id: 2, title: 'Sapiens: Lược sử loài người', author: 'Yuval Noah Harari', year: 2011, genre: 'Khoa học', isbn: '978-604-3-21', publisher: 'NXB Thế Giới', quantity: 3, available: 2 },
  { id: 3, title: 'Nhà Giả Kim', author: 'Paulo Coelho', year: 1988, genre: 'Văn học', isbn: '978-604-1-88', publisher: 'NXB Hội Nhà Văn', quantity: 2, available: 0 },
  { id: 4, title: 'Atomic Habits', author: 'James Clear', year: 2018, genre: 'Kỹ năng', isbn: '978-0-7352', publisher: 'Avery', quantity: 4, available: 3 },
  { id: 5, title: 'Đất Nước Đứng Lên', author: 'Nguyên Ngọc', year: 1956, genre: 'Văn học', isbn: '978-604-5-56', publisher: 'NXB Giải Phóng', quantity: 6, available: 5 },
  { id: 6, title: 'Lịch sử Việt Nam', author: 'Nhiều tác giả', year: 2018, genre: 'Lịch sử', isbn: '978-604-9-18', publisher: 'NXB Đại Học', quantity: 4, available: 3 },
];
// ─────────────────────────────────────────────────────────────────────────────

function statusBadge(available, quantity) {
  if (available === 0) return <Badge type="warning">Hết sách</Badge>;
  if (available < quantity / 2) return <Badge type="info">Sắp hết</Badge>;
  return <Badge type="success">Có sẵn</Badge>;
}

export default function Books() {
  const { t } = useLang();
  const [activeCat, setActiveCat] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // TODO: thay bằng API thật
  // const { items, total, loading, refetch } = usePaginatedList(booksAPI.getAll, { genre: activeCat });
  const items = MOCK_BOOKS.filter(b =>
    (!activeCat || b.genre === activeCat) &&
    (!search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === 'all' || (activeFilter === 'available' ? b.available > 0 : b.available === 0))
  );
  const total = items.length;
  const loading = false;

  const { mutate: saveBook, loading: saving } = useMutation(
    (data) => editId ? booksAPI.update(editId, data) : booksAPI.create(data),
    {
      successMsg: editId ? t('success_edit') : t('success_add'),
      onSuccess: () => { setModalOpen(false); setForm(EMPTY_FORM); setEditId(null); },
    }
  );

  const { mutate: deleteBook } = useMutation(
    () => booksAPI.delete(deleteId),
    { successMsg: t('success_delete'), onSuccess: () => setDeleteId(null) }
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit = (book) => { setForm({ ...book }); setEditId(book.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.author) { toast.error(t('error_required')); return; }
    await saveBook(form);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
      {/* Category grid */}
      <div className="cat-grid">
        {CATS.map((c) => (
          <div
            key={c.value}
            className={`cat-card${activeCat === c.value ? ' cat-card--active' : ''}`}
            style={{ background: c.bg }}
            onClick={() => setActiveCat(c.value)}
          >
            <span className="cat-icon">{c.icon}</span>
            <div className="cat-name" style={{ color: c.color }}>{c.label}</div>
            <div className="cat-count" style={{ color: c.color }}>{c.count} sách</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader
          title={t('book_list')}
          actions={
            <>
              <input
                className="form-input"
                style={{ width: 200, padding: '6px 10px' }}
                placeholder="Tìm sách, tác giả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="chip-row">
                {['all', 'available', 'out'].map((f) => (
                  <button key={f} className={`chip${activeFilter === f ? ' chip--active' : ''}`} onClick={() => setActiveFilter(f)}>
                    {{ all: 'Tất cả', available: 'Có sẵn', out: 'Hết sách' }[f]}
                  </button>
                ))}
              </div>
              <Btn icon={<IconAdd />} onClick={openAdd}>{t('book_add')}</Btn>
            </>
          }
        />
        <CardBody noPad>
          {loading ? <Spinner /> : items.length === 0 ? <Empty /> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('book_title')}</th>
                    <th>{t('book_genre')}</th>
                    <th>{t('book_isbn')}</th>
                    <th>{t('book_qty')} / {t('book_available')}</th>
                    <th>{t('book_status')}</th>
                    <th>{t('book_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <div className="book-info">
                          <BookCover genre={book.genre} />
                          <div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-author">{book.author} · {book.year}</div>
                          </div>
                        </div>
                      </td>
                      <td><Badge type="info">{book.genre}</Badge></td>
                      <td style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: 'monospace' }}>{book.isbn}</td>
                      <td>{book.quantity} / {book.available}</td>
                      <td>{statusBadge(book.available, book.quantity)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 2 }}>
                          <IconBtn title="Cho mượn" onClick={() => toast.success(`Đã mượn: ${book.title}`)}>📤</IconBtn>
                          <IconBtn title="Sửa" onClick={() => openEdit(book)}>✏️</IconBtn>
                          <IconBtn title="Xóa" danger onClick={() => setDeleteId(book.id)}>🗑️</IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: '0 18px 14px' }}>
            <Pagination page={page} limit={10} total={total} onPage={setPage} />
          </div>
        </CardBody>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editId ? t('book_edit') : `${t('book_add')} / Add New Book`}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setModalOpen(false)}>{t('btn_cancel')}</Btn>
            <Btn loading={saving} onClick={handleSave}>{t('btn_save')}</Btn>
          </>
        }
      >
        <FormField label={`${t('book_title')} / Book Title`} required>
          <FormInput placeholder="Nhập tên sách..." value={form.title} onChange={setField('title')} />
        </FormField>
        <FormGrid>
          <FormField label={`${t('book_author')} *`}>
            <FormInput placeholder="Tên tác giả..." value={form.author} onChange={setField('author')} />
          </FormField>
          <FormField label={t('book_year')}>
            <FormInput type="number" value={form.year} onChange={setField('year')} />
          </FormField>
        </FormGrid>
        <FormGrid>
          <FormField label={t('book_genre')}>
            <FormSelect options={GENRES} value={form.genre} onChange={setField('genre')} />
          </FormField>
          <FormField label={t('book_qty')}>
            <FormInput type="number" min="1" value={form.quantity} onChange={setField('quantity')} />
          </FormField>
        </FormGrid>
        <FormGrid>
          <FormField label={t('book_isbn')}>
            <FormInput placeholder="978-..." value={form.isbn} onChange={setField('isbn')} />
          </FormField>
          <FormField label={t('book_publisher')}>
            <FormInput placeholder="NXB..." value={form.publisher} onChange={setField('publisher')} />
          </FormField>
        </FormGrid>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteId}
        title="Xác nhận xóa / Confirm Delete"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setDeleteId(null)}>{t('btn_cancel')}</Btn>
            <Btn variant="danger" onClick={deleteBook}>Xóa sách</Btn>
          </>
        }
      >
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          Bạn có chắc muốn xóa sách này? Thao tác không thể hoàn tác.
        </p>
      </Modal>

      <style>{`
        .cat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
        .cat-card { border-radius:var(--radius); padding:14px; cursor:pointer; border:2px solid transparent; transition:all var(--t); text-align:center; }
        .cat-card:hover { transform:translateY(-2px); box-shadow:var(--shadow2); }
        .cat-card--active { border-color:var(--primary); }
        .cat-icon  { font-size:22px; margin-bottom:5px; display:block; }
        .cat-name  { font-size:12px; font-weight:600; margin-bottom:2px; }
        .cat-count { font-size:11px; opacity:0.7; }
        .chip-row  { display:flex; gap:5px; }
        .chip { padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500; background:var(--surface3); color:var(--text2); cursor:pointer; border:1px solid transparent; transition:all var(--t); }
        .chip--active { background:var(--primary-light); color:var(--primary); border-color:var(--primary); }
      `}</style>
    </>
  );
}

function IconAdd() { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>; }
