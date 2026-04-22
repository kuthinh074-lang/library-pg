import React from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LangContext';
import { borrowsAPI } from '../../services/api';
import { useMutation } from '../../hooks/useData';
import { Btn, Card, CardHeader, CardBody, Badge, Alert, Avatar } from '../Common';

const MOCK_OVERDUE = [
  { id: 1, member: { name: 'Phạm Thu Hà',   cardId: 'DG-2024-015', phone: '0923456789' }, book: 'Lịch sử Việt Nam', dueDate: '19/04/2026', daysOverdue: 2,  fine: 4000 },
  { id: 2, member: { name: 'Vũ Tuấn Khoa',  cardId: 'DG-2024-022', phone: '0956789012' }, book: 'Doraemon Vol.3',   dueDate: '15/04/2026', daysOverdue: 6,  fine: 12000 },
  { id: 3, member: { name: 'Đỗ Minh Châu',  cardId: 'DG-2023-088', phone: '0967890123' }, book: 'Dế Mèn Phiêu Lưu Ký', dueDate: '12/04/2026', daysOverdue: 9, fine: 18000 },
  { id: 4, member: { name: 'Ngô Thị Lan',   cardId: 'DG-2024-041', phone: '0978901234' }, book: 'Nhà Giả Kim',     dueDate: '10/04/2026', daysOverdue: 11, fine: 22000 },
  { id: 5, member: { name: 'Bùi Văn Hùng',  cardId: 'DG-2025-007', phone: '0989012345' }, book: 'Atomic Habits',  dueDate: '08/04/2026', daysOverdue: 13, fine: 26000 },
];

const COLORS = ['red', 'amber', 'green', 'blue', 'purple'];

export default function Overdue() {
  const { t } = useLang();
  const totalFines = MOCK_OVERDUE.reduce((s, o) => s + o.fine, 0);

  const remind = (name) => toast.success(`${t('success_remind')} → ${name}`);
  const remindAll = () => toast.success('Đã gửi nhắc nhở tới tất cả 8 độc giả!');

  return (
    <>
      <Alert type="warning" title={`${MOCK_OVERDUE.length} sách quá hạn trả / ${MOCK_OVERDUE.length} Books Overdue`}>
        Phí phạt: <strong>2.000 VNĐ/ngày/cuốn</strong> · Late fee: 2,000 VND/day/book ·
        Tổng phí phạt hiện tại: <strong style={{ color: 'var(--danger)' }}>{totalFines.toLocaleString('vi-VN')} VNĐ</strong>
      </Alert>

      <Card>
        <CardHeader
          title={`${t('overdue_title')} (${MOCK_OVERDUE.length})`}
          actions={
            <Btn variant="outline" icon={<IconMail />} onClick={remindAll}>
              {t('overdue_remind_all')} / Remind All
            </Btn>
          }
        />
        <CardBody noPad>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Hạn trả</th>
                  <th>{t('overdue_days')}</th>
                  <th>{t('overdue_fine')}</th>
                  <th>{t('book_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_OVERDUE.map((o, i) => (
                  <tr key={o.id}>
                    <td>
                      <div className="book-info">
                        <Avatar name={o.member.name} color={COLORS[i % COLORS.length]} size={34} />
                        <div>
                          <div className="book-title">{o.member.name}</div>
                          <div className="book-author">{o.member.cardId} · {o.member.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{o.book}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{o.dueDate}</td>
                    <td>
                      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                        {o.daysOverdue} ngày
                      </span>
                    </td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>
                      {o.fine.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Btn size="sm" variant="outline" onClick={() => remind(o.member.name)}>
                          {t('overdue_remind')}
                        </Btn>
                        <Btn size="sm" variant="ghost" onClick={() => toast.success('Đã thu phạt!')}>
                          Thu phạt
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function IconMail() { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>; }
