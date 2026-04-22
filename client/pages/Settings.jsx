import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLang } from '../context/LangContext';
import { Btn, Card, CardHeader, CardBody, FormField, FormInput, FormGrid, FormSelect } from '../components/Common';

export default function Settings() {
  const { t, lang } = useLang();

  const [libForm, setLibForm] = useState({
    name: 'Thư viện Quận 1',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '028 3822 1234',
    email: 'thuvien@q1.gov.vn',
    finePerDay: 2000,
    maxBorrowDays: 14,
    maxBooksPerMember: 5,
  });

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const setLib = (k) => (e) => setLibForm(f => ({ ...f, [k]: e.target.value }));
  const setPw  = (k) => (e) => setPwForm(f => ({ ...f, [k]: e.target.value }));

  const saveLib = () => toast.success('Đã lưu cài đặt thư viện!');
  const savePw  = () => {
    if (!pwForm.current || !pwForm.next) { toast.error('Vui lòng nhập đầy đủ!'); return; }
    if (pwForm.next !== pwForm.confirm)  { toast.error('Mật khẩu xác nhận không khớp!'); return; }
    toast.success('Đã đổi mật khẩu thành công!');
    setPwForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>

      {/* Library info */}
      <Card>
        <CardHeader title="Thông tin thư viện / Library Info" />
        <CardBody>
          <FormField label="Tên thư viện / Library Name">
            <FormInput value={libForm.name} onChange={setLib('name')} />
          </FormField>
          <FormField label="Địa chỉ / Address">
            <FormInput value={libForm.address} onChange={setLib('address')} />
          </FormField>
          <FormGrid>
            <FormField label="Điện thoại / Phone">
              <FormInput value={libForm.phone} onChange={setLib('phone')} />
            </FormField>
            <FormField label="Email">
              <FormInput type="email" value={libForm.email} onChange={setLib('email')} />
            </FormField>
          </FormGrid>
          <div style={{ borderTop: '1px solid var(--border2)', paddingTop: 16, marginTop: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quy định mượn sách / Borrowing Rules
            </div>
            <FormGrid>
              <FormField label="Phí phạt / ngày (VNĐ) / Fine per day">
                <FormInput type="number" value={libForm.finePerDay} onChange={setLib('finePerDay')} />
              </FormField>
              <FormField label="Số ngày mượn tối đa / Max loan days">
                <FormInput type="number" value={libForm.maxBorrowDays} onChange={setLib('maxBorrowDays')} />
              </FormField>
            </FormGrid>
            <FormField label="Số sách tối đa / độc giả / Max books per member">
              <FormInput type="number" value={libForm.maxBooksPerMember} onChange={setLib('maxBooksPerMember')} style={{ maxWidth: 120 }} />
            </FormField>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Btn onClick={saveLib}>💾 Lưu cài đặt / Save Settings</Btn>
          </div>
        </CardBody>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader title="Đổi mật khẩu / Change Password" />
        <CardBody>
          <FormField label="Mật khẩu hiện tại / Current Password">
            <FormInput type="password" placeholder="••••••••" value={pwForm.current} onChange={setPw('current')} />
          </FormField>
          <FormGrid>
            <FormField label="Mật khẩu mới / New Password">
              <FormInput type="password" placeholder="••••••••" value={pwForm.next} onChange={setPw('next')} />
            </FormField>
            <FormField label="Xác nhận mật khẩu / Confirm">
              <FormInput type="password" placeholder="••••••••" value={pwForm.confirm} onChange={setPw('confirm')} />
            </FormField>
          </FormGrid>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn onClick={savePw}>🔒 Đổi mật khẩu / Update Password</Btn>
          </div>
        </CardBody>
      </Card>

      {/* System info */}
      <Card>
        <CardHeader title="Thông tin hệ thống / System Info" />
        <CardBody>
          {[
            ['Phiên bản / Version', 'LibraViet v1.0.0'],
            ['Database', 'PostgreSQL 15'],
            ['Backend', 'Node.js + Express + Sequelize'],
            ['Frontend', 'React 18 + react-router-dom v6'],
            ['Ngôn ngữ / Language', lang === 'vi' ? 'Tiếng Việt' : 'English'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border2)', fontSize: 13 }}>
              <span style={{ color: 'var(--text3)' }}>{label}</span>
              <span style={{ fontWeight: 500, color: 'var(--text1)' }}>{value}</span>
            </div>
          ))}
        </CardBody>
      </Card>

    </div>
  );
}
