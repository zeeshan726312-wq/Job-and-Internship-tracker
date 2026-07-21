import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import UserPanel from './pages/UserPanel';
import EmployerPanel from './pages/EmployerPanel';
import MentorPanel from './pages/MentorPanel';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserPanel />} />
            <Route path="employer" element={<EmployerPanel />} />
            <Route path="mentor" element={<MentorPanel />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
