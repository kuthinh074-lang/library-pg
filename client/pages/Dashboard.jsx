import React, { useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useFetch } from '../../hooks/useData';
import { reportsAPI, borrowsAPI } from '../../services/api';
import {
  StatCard, Card, CardHeader, CardBody,
  Badge, Alert, Spinner, BookCover, Avatar,
} from '../Common';

// SVG icons inline
const IconBook    = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>;
const IconMembers = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconBorrow  = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.53 16.5 1 14.65 1c-1.05 0-1.96.5-2.65 1.26L12 2.27l-.01-.02C11.31 1.5 10.4 1 9.35 1 7.5 1 6 2.53 6 4.65c0 .48.11.91.18 1.35H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>;
const IconWarning = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;

// ── MOCK DATA (xóa khi có API thật) ───────────────────────────────────────────
const MOCK_STATS = {
  totalBooks: 1247, totalMembers: 428, onLoan: 34, overdue: 8,
};
const MOCK_BORROWS = [
  { id: 1, book: { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', genre: 'Văn học' }, member: { name: 'Nguyễn Thị Mai' }, borrowDate: '20/04/2026', dueDate: '04/05/2026', status: 'active' },
  { id: 2, book: { title: 'Sapiens: Lược sử loài người', author: 'Yuval Noah Harari', genre: 'Khoa học' }, member: { name: 'Trần Văn Bình' }, borrowDate: '18/04/2026', dueDate: '02/05/2026', status: 'active' },
  { id: 3, book: { title: 'Nhà Giả Kim', author: 'Paulo Coelho', genre: 'Kinh tế' }, member: { name: 'Lê Hoàng Nam' }, borrowDate: '10/04/2026', dueDate: '24/04/2026', status: 'due_soon' },
  { id: 4, book: { title: 'Lịch sử Việt Nam', author: 'Nhiều tác giả', genre: 'Lịch sử' }, member: { name: 'Phạm Thu Hà' }, borrowDate: '05/04/2026', dueDate: '19/04/2026', status: 'overdue' },
  { id: 5, book: { title: 'Atomic Habits', author: 'James Clear', genre: 'Kỹ năng' }, member: { name: 'Hoàng Minh Tuấn' }, borrowDate: '21/04/2026', dueDate: '05/05/2026', status: 'active' },
];
const MOCK_GENRES = [
  { name: 'Văn học', pct: 82, color: '#1565C0' },
  { name: 'Khoa học', pct: 65, color: '#00695C' },
  { name: 'Lịch sử', pct: 48, color: '#6A1B9A' },
  { name: 'Kinh tế', pct: 39, color: '#F57C00' },
  { name: 'Thiếu nhi', pct: 27, color: '#C62828' },
];
const MOCK_ACTIVITY = [
  { id: 1, member: { name: 'Nguyễn Thị Mai' }, action: 'Mượn', book: 'Dế Mèn Phiêu Lưu Ký', time: '5 phút', color: 'blue' },
  { id: 2, member: { name: 'Trần Văn Bình' },  action: 'Trả',  book: 'Sapiens', time: '32 phút', color: 'green' },
  { id: 3, member: { name: 'Lê Hoàng Nam' },   action: 'Gia hạn', book: 'Nhà Giả Kim', time: '1 giờ', color: 'amber' },
  { id: 4, member: { name: 'Phạm Thu Hà' },    action: 'Nhắc hạn', book: 'Lịch sử VN', time: '2 giờ', color: 'red' },
];
// ─────────────────────────────────────────────────────────────────────────────

function statusBadge(status) {
  if (status === 'active')   return <Badge type="success">Đang mượn</Badge>;
  if (status === 'due_soon') return <Badge type="warning">Sắp hạn</Badge>;
  if (status === 'overdue')  return <Badge type="danger">Quá hạn</Badge>;
  return <Badge type="gray">Đã trả</Badge>;
}

const TABS = ['Hôm nay', 'Tuần này', 'Tháng này'];

export default function Dashboard() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState(0);

  // TODO: thay bằng API thật
  // const { data: stats } = useFetch(() => reportsAPI.getDashboard());
  // const { data: borrows } = useFetch(() => borrowsAPI.getAll({ status: 'active', limit: 5 }));
  const stats = MOCK_STATS;
  const borrows = MOCK_BORROWS;

  return (
    <>
      {/* Stat cards */}
      <div className="stats-row">
        <StatCard icon={<IconBook />}    value={stats.totalBooks}    label={t('stat_books')}    delta="↑ +23 tháng này" deltaType="up"   color="blue" />
        <StatCard icon={<IconMembers />} value={stats.totalMembers}  label={t('stat_members')}  delta="↑ +12 tuần này"  deltaType="up"   color="green" />
        <StatCard icon={<IconBorrow />}  value={stats.onLoan}        label={t('stat_on_loan')}  delta={`${stats.overdue} quá hạn`} deltaType="down" color="amber" />
        <StatCard icon={<IconWarning />} value={stats.overdue}       label={t('stat_overdue')}  delta="Cần xử lý ngay" deltaType="down"  color="red" />
      </div>

      {/* Overdue alert */}
      {stats.overdue > 0 && (
        <Alert type="warning" title={t('overdue_warning_title')}>
          Có <strong>{stats.overdue}</strong> {t('overdue_warning_msg')}
        </Alert>
      )}

      <div className="two-col">
        {/* Recent borrows table */}
        <Card>
          <CardHeader
            title={t('recently_borrowed')}
            actions={
              <div className="tabs">
                {TABS.map((tab, i) => (
                  <button key={tab} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</button>
                ))}
              </div>
            }
          />
          <CardBody noPad>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('book_title')}</th>
                    <th>{t('nav_members')}</th>
                    <th>{t('borrow_date')}</th>
                    <th>{t('borrow_due')}</th>
                    <th>{t('book_status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="book-info">
                          <BookCover genre={b.book.genre} />
                          <div>
                            <div className="book-title">{b.book.title}</div>
                            <div className="book-author">{b.book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td>{b.member.name}</td>
                      <td>{b.borrowDate}</td>
                      <td>{b.dueDate}</td>
                      <td>{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Genre chart */}
          <Card>
            <CardHeader title={t('popular_genres')} />
            <CardBody>
              {MOCK_GENRES.map((g) => (
                <div key={g.name} className="quick-item">
                  <div className="quick-label">{g.name}</div>
                  <div className="quick-bar">
                    <div className="quick-fill" style={{ width: `${g.pct}%`, background: g.color }} />
                  </div>
                  <div className="quick-pct">{g.pct}%</div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Activity feed */}
          <Card>
            <CardHeader title={t('recent_activity')} />
            <CardBody>
              {MOCK_ACTIVITY.map((a) => (
                <div key={a.id} className="borrow-item">
                  <Avatar name={a.member.name} color={a.color} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="book-title" style={{ fontSize: 13 }}>{a.member.name}</div>
                    <div className="book-author">{a.book} — {a.action}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{a.time}</div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <style>{`
        .tabs { display:flex; gap:2px; background:var(--surface2); border-radius:8px; padding:3px; }
        .tab  { font-size:12px; font-weight:500; padding:5px 12px; border-radius:6px; cursor:pointer; color:var(--text3); border:none; background:none; transition:all var(--t); }
        .tab.active { background:var(--surface); color:var(--primary); font-weight:600; box-shadow:var(--shadow); }
        .quick-item { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border2); }
        .quick-item:last-child { border-bottom:none; }
        .quick-label { font-size:12.5px; color:var(--text2); width:90px; font-weight:500; }
        .quick-bar   { flex:1; height:6px; background:var(--surface3); border-radius:3px; overflow:hidden; }
        .quick-fill  { height:100%; border-radius:3px; transition:width 0.6s ease; }
        .quick-pct   { font-size:12px; color:var(--text3); width:34px; text-align:right; }
        .borrow-item { display:flex; align-items:center; gap:12px; padding:9px 0; border-bottom:1px solid var(--border2); }
        .borrow-item:last-child { border-bottom:none; }
      `}</style>
    </>
  );
}
