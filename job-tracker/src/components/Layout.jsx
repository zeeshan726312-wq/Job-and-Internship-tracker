import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, GraduationCap } from 'lucide-react';
import '../index.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>TrackerPro</h2>
        </div>
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Users className="icon" /> User Panel
          </NavLink>
          <NavLink to="/employer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Briefcase className="icon" /> Employer Panel
          </NavLink>
          <NavLink to="/mentor" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <GraduationCap className="icon" /> Mentor Panel
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <LayoutDashboard className="icon" /> Admin Panel
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <h1>Job & Internship Tracker</h1>
          <div className="user-profile">
            <div className="avatar">U</div>
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
