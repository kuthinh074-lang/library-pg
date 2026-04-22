import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiBook, FiUsers, FiList, FiAlertTriangle, FiDollarSign } from 'react-icons/fi';
import Layout from '../../components/common/Layout';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/stats/dashboard'), api.get('/stats/borrows')])
      .then(([s, b]) => {
        setStats(s.data.data);
        const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
        const data = months.map((m, i) => {
          const found = b.data.data?.find(d => d._id?.month === i + 1);
          return { month: m, count: found?.count || 0 };
        });
        setChartData(data);
      })
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div style={{ padding: 48, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div></Layout>;

  const cards = [
    { label: 'Tổng sách', value: stats?.totalBooks, icon: <FiBook />, color: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Người dùng', value: stats?.totalUsers, icon: <FiUsers />, color: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Đang mượn', value: stats?.activeBorrows, icon: <FiList />, color: '#f5f3ff', iconColor: '#7c3aed' },
    { label: 'Quá hạn', value: stats?.overdueBorrows, icon: <FiAlertTriangle />, color: '#fef2f2', iconColor: '#dc2626' },
    { label: 'Phí chưa thu', value: `${(stats?.unpaidFines || 0).toLocaleString('vi-VN')}đ`, icon: <FiDollarSign />, color: '#fffbeb', iconColor: '#d97706' },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>Tổng quan hệ thống thư viện</p>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-icon" style={{ background: c.color, color: c.iconColor }}>{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Borrow chart */}
        <div className="card">
          <div className="card-header"><h2>Lượt mượn theo tháng ({new Date().getFullYear()})</h2></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Lượt mượn" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular books */}
        <div className="card">
          <div className="card-header"><h2>Sách được mượn nhiều nhất</h2></div>
          <div className="card-body">
            {stats?.popularBooks?.map((b, i) => (
              <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i < 3 ? '#fff' : '#64748b' }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{b.author}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{b.borrowCount} lượt</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent borrows */}
      <div className="card">
        <div className="card-header"><h2>Mượn sách gần đây</h2></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Người mượn</th><th>Sách</th><th>Thời gian</th></tr></thead>
            <tbody>
              {stats?.recentBorrows?.map(b => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{b.user?.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{b.user?.studentId}</div>
                  </td>
                  <td style={{ fontSize: 14 }}>{b.book?.title}</td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{new Date(b.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
