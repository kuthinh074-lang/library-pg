import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Books     from './pages/Books';
import Members   from './pages/Members';
import Borrow    from './pages/Borrow';
import Overdue   from './pages/Overdue';
import Reports   from './pages/Reports';
import Settings  from './pages/Settings';
import Login     from './pages/Login';
import './styles/tokens.css';
import './components/Common/Common.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--text3)', fontFamily:'var(--font)' }}>Đang tải...</div>;
  // TODO: bỏ comment `|| true` khi có auth thật
  return (user || true) ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [search, setSearch] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout search={search} onSearch={setSearch}>
                <Routes>
                  <Route path="/"         element={<Dashboard />} />
                  <Route path="/books"    element={<Books />} />
                  <Route path="/members"  element={<Members />} />
                  <Route path="/borrow"   element={<Borrow />} />
                  <Route path="/overdue"  element={<Overdue />} />
                  <Route path="/reports"  element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500 },
            success: { iconTheme: { primary: 'var(--success)', secondary: '#fff' } },
            error:   { iconTheme: { primary: 'var(--danger)',  secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </LangProvider>
  );
}
