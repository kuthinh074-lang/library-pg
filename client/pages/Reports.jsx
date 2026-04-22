import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LangContext';
import { reportsAPI } from '../../services/api';
import { Btn, Card, CardHeader, CardBody, StatCard } from '../Common';

const IconChart   = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>;
const IconMoney   = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
const IconReturn  = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>;
const IconNewUser = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;

const MONTHLY = [
  { month: 'T1', borrows: 98,  returns: 89 },
  { month: 'T2', borrows: 112, returns: 105 },
  { month: 'T3', borrows: 134, returns: 128 },
  { month: 'T4', borrows: 156, returns: 143 },
];
const MAX_VAL = 180;

const TOP_BOOKS = [
  { rank: 1, title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài',       borrows: 47 },
  { rank: 2, title: 'Nhà Giả Kim',          author: 'Paulo Coelho',  borrows: 42 },
  { rank: 3, title: 'Atomic Habits',         author: 'James Clear',   borrows: 38 },
  { rank: 4, title: 'Sapiens',              author: 'Yuval Harari',  borrows: 35 },
  { rank: 5, title: 'Đắc Nhân Tâm',        author: 'Dale Carnegie', borrows: 31 },
];

export default function Reports() {
  const { t } = useLang();
  const [year, setYear] = useState(2026);

  const handleExport = () => {
    // TODO: gọi reportsAPI.exportMonthly({ year })
    toast.success('Đang xuất báo cáo Excel...');
  };

  return (
    <>
      <div className="stats-row">
        <StatCard icon={<IconChart />}   value="156" label={t('reports_monthly')}     delta="↑ +16% so tháng 3" deltaType="up"   color="blue"  />
        <StatCard icon={<IconReturn />}  value="143" label={t('reports_returned')}    delta="↑ +14% so tháng 3" deltaType="up"   color="green" />
        <StatCard icon={<IconMoney />}   value="24.000đ" label={t('reports_fines')}  delta="↓ -8% so tháng 3"  deltaType="down" color="amber" />
        <StatCard icon={<IconNewUser />} value="18"  label={t('reports_new_members')} delta="↑ +20% so tháng 3" deltaType="up"   color="blue"  />
      </div>

      <div className="two-col">
        {/* Bar chart */}
        <Card>
          <CardHeader
            title={`${t('reports_chart')} ${year}`}
            actions={
              <>
                <select
                  className="form-input"
                  style={{ width: 90, padding: '5px 8px', fontSize: 12 }}
                  value={year}
                  onChange={(e) => setYear(+e.target.value)}
                >
                  {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                </select>
                <Btn variant="outline" size="sm" onClick={handleExport}>
                  📊 {t('reports_export')}
                </Btn>
              </>
            }
          />
          <CardBody>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--primary)' }} />
                Lượt mượn
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--secondary)' }} />
                Lượt trả
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160, padding: '0 8px 8px', borderBottom: '1px solid var(--border2)' }}>
              {MONTHLY.map((m) => (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', width: '100%' }}>
                    <div style={{ flex: 1, background: 'var(--primary)', borderRadius: '3px 3px 0 0', height: `${(m.borrows / MAX_VAL) * 140}px`, position: 'relative' }}>
                      <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{m.borrows}</span>
                    </div>
                    <div style={{ flex: 1, background: 'var(--secondary)', borderRadius: '3px 3px 0 0', height: `${(m.returns / MAX_VAL) * 140}px` }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: m.month === 'T4' ? 700 : 400 }}>{m.month}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 16 }}>
              {MONTHLY.map((m) => (
                <div key={m.month} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{m.month}/{year}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text1)' }}>{m.borrows}</div>
                  <div style={{ fontSize: 10, color: 'var(--success)' }}>Trả: {m.returns}</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top books */}
        <Card>
          <CardHeader title="Top 5 sách được mượn nhiều nhất" />
          <CardBody>
            {TOP_BOOKS.map((b) => (
              <div key={b.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border2)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: b.rank === 1 ? '#FFF3CD' : b.rank === 2 ? '#E8E8E8' : b.rank === 3 ? '#FFE5CC' : 'var(--surface3)',
                  color: b.rank === 1 ? '#F59E0B' : b.rank === 2 ? '#6B7280' : b.rank === 3 ? '#CD7F32' : 'var(--text3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>
                  {b.rank}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="book-title" style={{ fontSize: 13 }}>{b.title}</div>
                  <div className="book-author">{b.author}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{b.borrows}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
