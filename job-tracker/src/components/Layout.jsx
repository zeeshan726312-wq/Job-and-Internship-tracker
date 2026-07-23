import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  Sparkles,
  Users
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import '../index.css';

const Layout = () => {
  const { currentUser, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'admin': return 'System Manager';
      case 'employer': return 'Opportunity Provider';
      case 'mentor': return 'Career Guide';
      case 'user':
      default: return 'Student Applicant';
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return currentUser?.role === 'admin' ? 'Admin System Overview' :
               currentUser?.role === 'employer' ? 'Employer Workspace' :
               currentUser?.role === 'mentor' ? 'Mentorship Dashboard' :
               'Student Applicant Dashboard';
      case '/apply':
        return 'Job & Internship Application Form';
      case '/applications':
        return 'Application Management & History';
      case '/employer':
        return 'Employer Management Console';
      case '/mentor':
        return 'Mentorship & Student Guidance Portal';
      case '/admin':
        return 'System Administration Console';
      default:
        return 'Job & Internship Tracker';
    }
  };

  return (
    <div className="layout-container bg-bg relative">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar z-50 ${mobileOpen ? 'open' : ''}`}>
        <div className="logo flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2>TrackerPro</h2>
          </div>
          <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden text-secondaryText hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="nav-menu flex-1 space-y-1">
          <div className="text-[11px] font-bold text-secondaryText/70 uppercase tracking-wider px-3 mb-2">
            Menu ({getRoleTitle(currentUser?.role)})
          </div>

          {/* User / Student Navigation */}
          {currentUser?.role === 'user' && (
            <>
              <NavLink 
                to="/" 
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <LayoutDashboard className="icon" /> Overview Dashboard
              </NavLink>

              <NavLink 
                to="/apply" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FilePlus className="icon" /> Application Form
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="icon" /> Tracked Applications
              </NavLink>
            </>
          )}

          {/* Employer Navigation */}
          {currentUser?.role === 'employer' && (
            <>
              <NavLink 
                to="/employer" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <Briefcase className="icon text-amber-400" /> Employer Console
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <Users className="icon text-blue-400" /> Applicant Submissions
              </NavLink>
            </>
          )}

          {/* Mentor Navigation */}
          {currentUser?.role === 'mentor' && (
            <>
              <NavLink 
                to="/mentor" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <GraduationCap className="icon text-purple-400" /> Mentor Portal
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="icon text-emerald-400" /> Student Progress
              </NavLink>
            </>
          )}

          {/* Admin Navigation */}
          {currentUser?.role === 'admin' && (
            <>
              <NavLink 
                to="/admin" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <ShieldCheck className="icon text-emerald-400" /> Admin Console
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="icon text-primary" /> All Applications
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-border mt-auto bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="user-profile">
                <div className="avatar text-sm">
                  {getInitial(currentUser?.name)}
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-primaryText truncate">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-secondaryText capitalize truncate">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="main-content">
        {/* Topbar Navigation */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-secondaryText hover:text-white p-1.5 rounded-lg border border-border"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Show "New Application" button ONLY for student applicants */}
            {currentUser?.role === 'user' && (
              <button
                onClick={() => navigate('/apply')}
                className="btn primary py-2 px-3.5 text-xs font-semibold shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Application</span>
              </button>
            )}

            <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="user-profile hidden sm:block">
                <div className="avatar text-sm">
                  {getInitial(currentUser?.name)}
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-primaryText leading-none">{currentUser?.name}</p>
                <p className="text-[10px] text-secondaryText capitalize">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
