# LibraViet – Hệ thống quản lý thư viện 📚

React + Node.js/Express + PostgreSQL · Song ngữ VN/EN · Material Design

---

## Cấu trúc thư mục / Project Structure

```
client/src/
├── App.js                        ← Router chính
├── index.js                      ← Entry point
├── styles/
│   └── tokens.css                ← CSS variables, reset, utilities
├── context/
│   ├── AuthContext.js            ← JWT auth state (login/logout/user)
│   └── LangContext.js            ← Song ngữ VN/EN + hàm t(key)
├── services/
│   └── api.js                    ← Tất cả axios calls đến backend
├── hooks/
│   └── useData.js                ← useFetch, usePaginatedList, useMutation
├── components/
│   ├── Common/
│   │   ├── index.jsx             ← Badge, Btn, Card, Modal, FormField,
│   │   │                            StatCard, Pagination, Avatar, BookCover,
│   │   │                            Spinner, Empty, Alert, SearchBox, IconBtn
│   │   └── Common.css            ← CSS cho tất cả common components
│   └── Layout/
│       ├── index.jsx             ← Sidebar + Topbar + content wrapper
│       └── Layout.css            ← CSS layout
└── pages/
    ├── Login.jsx                 ← Trang đăng nhập
    ├── Dashboard.jsx             ← Bảng điều khiển + thống kê nhanh
    ├── Books.jsx                 ← Quản lý sách (CRUD + lọc thể loại)
    ├── Members.jsx               ← Quản lý độc giả (CRUD)
    ├── Borrow.jsx                ← Cho mượn / nhận trả sách
    ├── Overdue.jsx               ← Sách quá hạn + nhắc nhở
    ├── Reports.jsx               ← Thống kê + biểu đồ + xuất Excel
    └── Settings.jsx              ← Cài đặt thư viện + đổi mật khẩu
```

---

## Cài đặt / Installation

```bash
# 1. Client
cd client
npm install
npm start          # chạy trên http://localhost:3001

# 2. Server
cd server
npm install
npm run migrate    # tạo bảng PostgreSQL
npm run seed       # dữ liệu mẫu (nếu có)
npm run dev        # chạy trên http://localhost:5001
```

---

## Kết nối API thật / Connect Real API

Mỗi page đều có mock data được đánh dấu rõ. Để kết nối API thật:

### Books.jsx
```js
// XÓA dòng mock:
const items = MOCK_BOOKS.filter(...)
const loading = false

// THAY bằng:
const { items, total, loading, refetch, setSearch, setFilter, setPage } =
  usePaginatedList(booksAPI.getAll, { genre: activeCat });
```

### Dashboard.jsx
```js
// XÓA dòng mock:
const stats = MOCK_STATS
const borrows = MOCK_BORROWS

// THAY bằng:
const { data: stats }   = useFetch(() => reportsAPI.getDashboard());
const { data: borrows } = useFetch(() => borrowsAPI.getAll({ status: 'active', limit: 5 }));
```

### Members.jsx, Overdue.jsx
Tương tự – xóa MOCK_*, bỏ comment usePaginatedList.

---

## API Endpoints cần có ở backend

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/books              ?page &limit &genre &search &status
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
GET    /api/books/export       → .xlsx blob

GET    /api/members            ?page &limit &search
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id
GET    /api/members/:id/borrows

GET    /api/borrows            ?status=active|overdue|returned
POST   /api/borrows            { memberId, bookId, daysLoan }
PUT    /api/borrows/:id/return { condition }
PUT    /api/borrows/:id/extend
GET    /api/borrows/overdue
POST   /api/borrows/:id/remind
POST   /api/borrows/remind-all

GET    /api/reports/dashboard
GET    /api/reports/monthly    ?year
GET    /api/reports/top-books
GET    /api/reports/export     ?year → .xlsx blob
```

---

## Thêm ngôn ngữ / Add Translation Key

Mở `src/context/LangContext.js`, thêm key vào cả `vi` và `en`:

```js
// vi
my_new_key: 'Nội dung tiếng Việt',

// en
my_new_key: 'English content',
```

Dùng trong component:
```jsx
const { t } = useLang();
<span>{t('my_new_key')}</span>
```

---

## Thêm trang mới / Add New Page

1. Tạo `src/pages/MyPage.jsx`
2. Import vào `App.js`:
   ```jsx
   import MyPage from './pages/MyPage';
   // trong Routes:
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Thêm nav item vào `Layout/index.jsx` → mảng `NAV`

---

## Tech Stack

| Layer    | Công nghệ |
|----------|-----------|
| Frontend | React 18, react-router-dom v6 |
| UI       | CSS thuần (Material-inspired, không dùng MUI lib) |
| HTTP     | axios + interceptors JWT |
| Toast    | react-hot-toast |
| Backend  | Node.js, Express 4 |
| ORM      | Sequelize 6 |
| Database | PostgreSQL (pg driver) |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| Excel    | exceljs (server) / xlsx (client) |
