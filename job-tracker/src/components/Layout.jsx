import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, GraduationCap, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import '../index.css';

const Layout = () => {
  const { currentUser, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="layout-container bg-bg">
      <aside className="sidebar">
        <div className="logo">
          <h2>TrackerPro</h2>
        </div>
        <nav className="nav-menu">
          {currentUser?.role === 'user' && (
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Users className="icon" /> User Panel
            </NavLink>
          )}
          {currentUser?.role === 'employer' && (
            <NavLink to="/employer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Briefcase className="icon" /> Employer Panel
            </NavLink>
          )}
          {currentUser?.role === 'mentor' && (
            <NavLink to="/mentor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <GraduationCap className="icon" /> Mentor Panel
            </NavLink>
          )}
          {currentUser?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <LayoutDashboard className="icon" /> Admin Panel
            </NavLink>
          )}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <h1>Job & Internship Tracker</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-primaryText">{currentUser?.name}</p>
              <p className="text-xs text-secondaryText capitalize">{currentUser?.role}</p>
            </div>
            <div className="user-profile">
              <div className="avatar">
                {getInitial(currentUser?.name)}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
