import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { MyBorrowsPage, MessagesPage, ProfilePage } from './pages/OtherPages';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public routes */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/books"     element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />

          {/* Protected routes — cần đăng nhập */}
          <Route path="/my-borrows"   element={<RequireAuth><MyBorrowsPage /></RequireAuth>} />
          <Route path="/messages"     element={<RequireAuth><MessagesPage /></RequireAuth>} />
          <Route path="/profile"      element={<RequireAuth><ProfilePage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
