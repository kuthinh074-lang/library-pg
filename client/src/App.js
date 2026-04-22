import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/user/HomePage';
import BooksPage from './pages/user/BooksPage';
import BookDetailPage from './pages/user/BookDetailPage';
import MyBorrowsPage from './pages/user/MyBorrowsPage';
import MyFinesPage from './pages/user/MyFinesPage';
import MyReservationsPage from './pages/user/MyReservationsPage';
import ProfilePage from './pages/user/ProfilePage';
import ContactPage from './pages/user/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminBorrow from './pages/admin/AdminBorrow';
import AdminReturn from './pages/admin/AdminReturn';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFines from './pages/admin/AdminFines';
import AdminCategories from './pages/admin/AdminCategories';
import AdminMessages from './pages/admin/AdminMessages';
import AdminReports from './pages/admin/AdminReports';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!['admin', 'librarian'].includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/books" element={<PrivateRoute><BooksPage /></PrivateRoute>} />
          <Route path="/books/:id" element={<PrivateRoute><BookDetailPage /></PrivateRoute>} />
          <Route path="/my-borrows" element={<PrivateRoute><MyBorrowsPage /></PrivateRoute>} />
          <Route path="/my-fines" element={<PrivateRoute><MyFinesPage /></PrivateRoute>} />
          <Route path="/my-reservations" element={<PrivateRoute><MyReservationsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
          <Route path="/admin/borrow" element={<AdminRoute><AdminBorrow /></AdminRoute>} />
          <Route path="/admin/return" element={<AdminRoute><AdminReturn /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/fines" element={<AdminRoute><AdminFines /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}