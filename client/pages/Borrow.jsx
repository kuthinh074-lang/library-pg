import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LangContext';
import { borrowsAPI } from '../../services/api';
import { useMutation } from '../../hooks/useData';
import { Btn, Card, CardHeader, CardBody, Badge, FormField, FormInput, FormSelect } from '../Common';

const PERIODS = [
  { value: '7', label: '7 ngày / 7 days' },
  { value: '14', label: '14 ngày / 14 days' },
  { value: '30', label: '30 ngày / 30 days' },
];
const CONDITIONS = [
  { value: 'good', label: 'Tốt / Good' },
  { value: 'fair', label: 'Bình thường / Fair' },
  { value: 'damaged', label: 'Hư hỏng / Damaged' },
];

export default function Borrow() {
  const { t } = useLang();
  const [issueForm, setIssueForm] = useState({ memberId: '', bookSearch: '', days: '14' });
  const [returnForm, setReturnForm] = useState({ memberId: '', bookSearch: '', condition: 'good' });

  const setIssue  = (k) => (e) => setIssueForm((f) => ({ ...f, [k]: e.target.value }));
  const setReturn = (k) => (e) => setReturnForm((f) => ({ ...f, [k]: e.target.value }));

  const { mutate: issueBook, loading: issuing } = useMutation(
    () => borrowsAPI.issue({ memberId: issueForm.memberId, bookSearch: issueForm.bookSearch, daysLoan: issueForm.days }),
    {
      successMsg: t('success_issue'),
      onSuccess: () => setIssueForm({ memberId: '', bookSearch: '', days: '14' }),
    }
  );

  const { mutate: returnBook, loading: returning } = useMutation(
    () => borrowsAPI.returnBook(null, { memberId: returnForm.memberId, bookSearch: returnForm.bookSearch, condition: returnForm.condition }),
    {
      successMsg: t('success_return'),
      onSuccess: () => setReturnForm({ memberId: '', bookSearch: '', condition: 'good' }),
    }
  );

  const handleIssue = async () => {
    if (!issueForm.memberId || !issueForm.bookSearch) { toast.error(t('error_required')); return; }
    // TODO: kết nối API thật
    toast.success(t('success_issue'));
    setIssueForm({ memberId: '', bookSearch: '', days: '14' });
  };

  const handleReturn = async () => {
    if (!returnForm.memberId || !returnForm.bookSearch) { toast.error(t('error_required')); return; }
    // TODO: kết nối API thật
    toast.success(t('success_return'));
    setReturnForm({ memberId: '', bookSearch: '', condition: 'good' });
  };

  return (
    <>
      <div className="two-col-equal" style={{ marginBottom: 24 }}>
        {/* Issue */}
        <Card>
          <CardHeader title={`📤 ${t('borrow_issue')}`} />
          <CardBody>
            <FormField label={`${t('borrow_member_id')} *`}>
              <FormInput placeholder="DG-2024-..." value={issueForm.memberId} onChange={setIssue('memberId')} />
            </FormField>
            <FormField label={`${t('borrow_book_search')} *`}>
              <FormInput placeholder="Nhập ISBN hoặc tên sách..." value={issueForm.bookSearch} onChange={setIssue('bookSearch')} />
            </FormField>
            <FormField label={t('borrow_period')}>
              <FormSelect options={PERIODS} value={issueForm.days} onChange={setIssue('days')} />
            </FormField>
            <Btn style={{ width: '100%', justifyContent: 'center' }} loading={issuing} onClick={handleIssue}>
              <IconOut /> {t('borrow_btn_issue')} / Issue
            </Btn>
          </CardBody>
        </Card>

        {/* Return */}
        <Card>
          <CardHeader title={`📥 ${t('borrow_return')}`} />
          <CardBody>
            <FormField label={`${t('borrow_member_id')} *`}>
              <FormInput placeholder="DG-2024-..." value={returnForm.memberId} onChange={setReturn('memberId')} />
            </FormField>
            <FormField label={`${t('borrow_book_search')} *`}>
              <FormInput placeholder="Nhập ISBN hoặc tên sách..." value={returnForm.bookSearch} onChange={setReturn('bookSearch')} />
            </FormField>
            <FormField label={t('borrow_condition')}>
              <FormSelect options={CONDITIONS} value={returnForm.condition} onChange={setReturn('condition')} />
            </FormField>
            <Btn variant="outline" style={{ width: '100%', justifyContent: 'center' }} loading={returning} onClick={handleReturn}>
              <IconIn /> {t('borrow_btn_return')} / Return
            </Btn>
          </CardBody>
        </Card>
      </div>

      {/* Active borrows table */}
      <Card>
        <CardHeader title="Đang mượn / Active Loans" />
        <CardBody noPad>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Hạn trả</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, member: 'Nguyễn Thị Mai',   book: 'Dế Mèn Phiêu Lưu Ký',        borrow: '20/04/2026', due: '04/05/2026', status: 'active' },
                  { id: 2, member: 'Trần Văn Bình',     book: 'Sapiens: Lược sử loài người', borrow: '18/04/2026', due: '02/05/2026', status: 'active' },
                  { id: 3, member: 'Lê Hoàng Nam',      book: 'Nhà Giả Kim',                 borrow: '10/04/2026', due: '24/04/2026', status: 'due_soon' },
                  { id: 4, member: 'Phạm Thu Hà',       book: 'Lịch sử Việt Nam',            borrow: '05/04/2026', due: '19/04/2026', status: 'overdue' },
                ].map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>{row.member}</td>
                    <td>{row.book}</td>
                    <td>{row.borrow}</td>
                    <td style={{ color: row.status === 'overdue' ? 'var(--danger)' : 'inherit', fontWeight: row.status === 'overdue' ? 700 : 400 }}>{row.due}</td>
                    <td>
                      {row.status === 'active'   && <Badge type="success">Đang mượn</Badge>}
                      {row.status === 'due_soon' && <Badge type="warning">Sắp hạn</Badge>}
                      {row.status === 'overdue'  && <Badge type="danger">Quá hạn</Badge>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Btn variant="outline" size="sm" onClick={() => toast.success('Đã nhận trả!')}>Trả</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => toast.success('Đã gia hạn!')}>Gia hạn</Btn>
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

function IconOut() { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>; }
function IconIn()  { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.35C18 2.53 16.5 1 14.65 1c-1.05 0-1.96.5-2.65 1.26L12 2.27l-.01-.02C11.31 1.5 10.4 1 9.35 1 7.5 1 6 2.53 6 4.65c0 .48.11.91.18 1.35H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/></svg>; }
