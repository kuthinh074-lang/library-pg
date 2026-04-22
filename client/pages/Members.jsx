import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LangContext';
import { membersAPI } from '../../services/api';
import { usePaginatedList, useMutation } from '../../hooks/useData';
import {
  Btn, IconBtn, Card, CardHeader, CardBody,
  Badge, Modal, FormField, FormInput, FormGrid,
  Pagination, Avatar, Spinner, Empty,
} from '../Common';

const EMPTY_FORM = { name: '', email: '', phone: '', address: '', dob: '' };

const MOCK_MEMBERS = [
  { id: 1, name: 'Nguyễn Thị Mai', cardId: 'DG-2024-001', email: 'mai.nt@email.com', phone: '0901234567', borrowing: 2, totalBorrowed: 47, joinDate: '15/01/2024', status: 'active' },
  { id: 2, name: 'Trần Văn Bình',  cardId: 'DG-2024-002', email: 'binh.tv@email.com', phone: '0912345678', borrowing: 1, totalBorrowed: 23, joinDate: '20/02/2024', status: 'active' },
  { id: 3, name: 'Phạm Thu Hà',   cardId: 'DG-2024-015', email: 'ha.pt@email.com',   phone: '0923456789', borrowing: 1, totalBorrowed: 8,  joinDate: '05/03/2024', status: 'overdue' },
  { id: 4, name: 'Hoàng Minh Tuấn', cardId: 'DG-2025-033', email: 'tuan.hm@email.com', phone: '0934567890', borrowing: 1, totalBorrowed: 5, joinDate: '11/01/2025', status: 'active' },
  { id: 5, name: 'Lê Hoàng Nam',  cardId: 'DG-2024-009', email: 'nam.lh@email.com',  phone: '0945678901', borrowing: 1, totalBorrowed: 15, joinDate: '09/06/2024', status: 'active' },
];

const AVATAR_COLORS = ['blue', 'green', 'amber', 'red', 'purple'];

export default function Members() {
  const { t } = useLang();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const items = MOCK_MEMBERS.filter(m =>
    !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.cardId.includes(search) ||
    m.email.includes(search)
  );

  const { mutate: saveMember, loading: saving } = useMutation(
    (data) => editId ? membersAPI.update(editId, data) : membersAPI.create(data),
    {
      successMsg: editId ? t('success_edit') : t('success_add'),
      onSuccess: () => { setModalOpen(false); setForm(EMPTY_FORM); setEditId(null); },
    }
  );

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setModalOpen(true); };
  const openEdit = (m) => { setForm({ name: m.name, email: m.email, phone: m.phone }); setEditId(m.id); setModalOpen(true); };
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error(t('error_required')); return; }
    await saveMember(form);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={t('member_list')}
          actions={
            <>
              <input
                className="form-input"
                style={{ width: 200, padding: '6px 10px' }}
                placeholder="Tìm tên, mã thẻ, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Btn icon={<IconAdd />} onClick={openAdd}>{t('member_add')}</Btn>
            </>
          }
        />
        <CardBody noPad>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('member_name')}</th>
                  <th>{t('member_card')}</th>
                  <th>{t('member_borrowing')}</th>
                  <th>{t('member_history')}</th>
                  <th>{t('member_since')}</th>
                  <th>{t('book_status')}</th>
                  <th>{t('book_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m, i) => (
                  <tr key={m.id}>
                    <td>
                      <div className="book-info">
                        <Avatar name={m.name} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} size={36} />
                        <div>
                          <div className="book-title">{m.name}</div>
                          <div className="book-author">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--primary)', fontSize: 12 }}>{m.cardId}</td>
                    <td style={{ fontWeight: 600 }}>{m.borrowing} cuốn</td>
                    <td>{m.totalBorrowed} cuốn</td>
                    <td>{m.joinDate}</td>
                    <td>
                      {m.status === 'active'
                        ? <Badge type="success">{t('member_active')}</Badge>
                        : <Badge type="danger">Quá hạn</Badge>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 2 }}>
                        <IconBtn title="Xem lịch sử" onClick={() => toast(`Lịch sử mượn: ${m.name}`)}>📋</IconBtn>
                        <IconBtn title="Sửa" onClick={() => openEdit(m)}>✏️</IconBtn>
                        <IconBtn title="Xóa" danger onClick={() => toast.error('Xóa độc giả: ' + m.name)}>🗑️</IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        title={editId ? 'Chỉnh sửa độc giả / Edit Member' : `${t('member_add')} / Add Member`}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setModalOpen(false)}>{t('btn_cancel')}</Btn>
            <Btn loading={saving} onClick={handleSave}>{t('btn_save')}</Btn>
          </>
        }
      >
        <FormField label={`${t('member_name')} *`}>
          <FormInput placeholder="Họ và tên..." value={form.name} onChange={setField('name')} />
        </FormField>
        <FormGrid>
          <FormField label={`${t('member_email')} *`}>
            <FormInput type="email" placeholder="email@..." value={form.email} onChange={setField('email')} />
          </FormField>
          <FormField label={t('member_phone')}>
            <FormInput type="tel" placeholder="09xx..." value={form.phone} onChange={setField('phone')} />
          </FormField>
        </FormGrid>
        <FormField label="Ngày sinh / Date of Birth">
          <FormInput type="date" value={form.dob} onChange={setField('dob')} />
        </FormField>
        <FormField label="Địa chỉ / Address">
          <FormInput placeholder="Số nhà, đường, quận..." value={form.address} onChange={setField('address')} />
        </FormField>
      </Modal>
    </>
  );
}

function IconAdd() { return <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>; }
