import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import UserPanel from './pages/UserPanel';
import EmployerPanel from './pages/EmployerPanel';
import MentorPanel from './pages/MentorPanel';
import AdminPanel from './pages/AdminPanel';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes Wrapper */}
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserPanel />
              </ProtectedRoute>
            } />
            <Route path="employer" element={
              <ProtectedRoute allowedRoles={['employer', 'admin']}>
                <EmployerPanel />
              </ProtectedRoute>
            } />
            <Route path="mentor" element={
              <ProtectedRoute allowedRoles={['mentor', 'admin']}>
                <MentorPanel />
              </ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
