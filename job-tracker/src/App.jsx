import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import DashboardOverview from './pages/DashboardOverview';
import ApplicationsList from './pages/ApplicationsList';
import EmployerPanel from './pages/EmployerPanel';
import MentorPanel from './pages/MentorPanel';
import AdminPanel from './pages/AdminPanel';
import UserPanel from './pages/UserPanel';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Auth / Login Route */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* Protected Routes Wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Dashboard Overview */}
            <Route index element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <DashboardOverview />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <DashboardOverview />
              </ProtectedRoute>
            } />

            {/* Direct Applicant Panel Routes */}
            <Route path="applicant" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <UserPanel defaultTab="all" />
              </ProtectedRoute>
            } />
            <Route path="user" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <UserPanel defaultTab="all" />
              </ProtectedRoute>
            } />
            <Route path="jobs" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <UserPanel defaultTab="jobs" />
              </ProtectedRoute>
            } />
            <Route path="mentorship" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <UserPanel defaultTab="mentorship" />
              </ProtectedRoute>
            } />

            {/* Tracked Applications View */}
            <Route path="applications" element={
              <ProtectedRoute allowedRoles={['user', 'employer', 'mentor', 'admin']}>
                <ApplicationsList />
              </ProtectedRoute>
            } />

            {/* Role-Specific Portals */}
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

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
