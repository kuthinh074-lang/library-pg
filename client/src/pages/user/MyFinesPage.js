import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';

export default function MyFinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fines/my').then(r => setFines(r.data.data)).finally(() => setLoading(false));
  }, []);

  const total = fines.reduce((s, f) => s + f.amount, 0);
  const unpaid = fines.filter(f => !f.isPaid).reduce((s, f) => s + f.amount, 0);

  return (
    <Layout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Phí phạt</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>Lịch sử phí phạt của bạn</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-value">{fines.length}</div><div className="stat-label">Tổng phiếu phạt</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#dc2626' }}>{unpaid.toLocaleString('vi-VN')}đ</div><div className="stat-label">Chưa thanh toán</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#16a34a' }}>{(total - unpaid).toLocaleString('vi-VN')}đ</div><div className="stat-label">Đã thanh toán</div></div>
      </div>

      <div className="card">
        {loading ? <div style={{ padding: 48, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          : fines.length === 0 ? <div className="empty-state"><div className="empty-icon">✅</div><h3>Không có phí phạt</h3><p>Bạn chưa có phí phạt nào</p></div>
            : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Sách</th><th>Lý do</th><th>Số ngày trễ</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead>
                  <tbody>
                    {fines.map(f => (
                      <tr key={f._id}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{f.borrow?.book?.title || 'N/A'}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{f.borrow?.book?.author}</div>
                        </td>
                        <td><span className="badge badge-warning">{f.reason === 'overdue' ? 'Trả trễ' : f.reason === 'damaged' ? 'Hư hỏng' : 'Mất sách'}</span></td>
                        <td style={{ fontSize: 13 }}>{f.overdueDays > 0 ? `${f.overdueDays} ngày` : '—'}</td>
                        <td style={{ fontWeight: 600, color: f.isPaid ? '#16a34a' : '#dc2626' }}>{f.amount.toLocaleString('vi-VN')}đ</td>
                        <td><span className={`badge ${f.isPaid ? 'badge-success' : 'badge-danger'}`}>{f.isPaid ? 'Đã trả' : 'Chưa trả'}</span></td>
                        <td style={{ fontSize: 13 }}>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
      {unpaid > 0 && (
        <div style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 16, fontSize: 14, color: '#92400e' }}>
          💡 Bạn có <strong>{unpaid.toLocaleString('vi-VN')}đ</strong> chưa thanh toán. Vui lòng đến quầy thủ thư để thanh toán.
        </div>
      )}
    </Layout>
  );
}
