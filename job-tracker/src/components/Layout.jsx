import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import dashboardBg from '../../../Untitled design.png';
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
  Users,
  Search,
  ChevronRight
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
      case 'admin': return 'System Administrator';
      case 'employer': return 'Employer';
      case 'mentor': return 'Mentor';
      case 'user':
      default: return 'Applicant';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'employer': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'mentor': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'user':
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return currentUser?.role === 'admin' ? 'System Overview & Analytics' :
               currentUser?.role === 'employer' ? 'Recruiter Command Hub' :
               currentUser?.role === 'mentor' ? 'Mentorship & Guidance Hub' :
               'Applicant Command Center';
      case '/apply':
        return 'Log Application Form';
      case '/applications':
        return 'Applications Tracker & Pipeline';
      case '/employer':
        return 'Employer Candidate Console';
      case '/mentor':
        return 'Student Guidance Portal';
      case '/admin':
        return 'System Administration Console';
      default:
        return 'TrackerPro Workspace';
    }
  };

  return (
    <div className="layout-container bg-bg relative font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-md transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar z-50 ${mobileOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="logo flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Tracker<span className="text-indigo-400">Pro</span>
              </h2>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Career Suite</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu flex-1 space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Navigation
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(currentUser?.role)}`}>
              {getRoleTitle(currentUser?.role)}
            </span>
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
                <LayoutDashboard className="w-4 h-4 text-indigo-400" /> 
                <span className="flex-1">Overview Dashboard</span>
              </NavLink>

              <NavLink 
                to="/apply" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FilePlus className="w-4 h-4 text-purple-400" /> 
                <span className="flex-1">Log Application</span>
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="w-4 h-4 text-emerald-400" /> 
                <span className="flex-1">Application Tracker</span>
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
                <Briefcase className="w-4 h-4 text-amber-400" /> 
                <span className="flex-1">Employer Console</span>
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <Users className="w-4 h-4 text-indigo-400" /> 
                <span className="flex-1">Applicant Submissions</span>
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
                <GraduationCap className="w-4 h-4 text-purple-400" /> 
                <span className="flex-1">Mentor Portal</span>
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="w-4 h-4 text-emerald-400" /> 
                <span className="flex-1">Student Applications</span>
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
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 
                <span className="flex-1">Admin Console</span>
              </NavLink>

              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <FileText className="w-4 h-4 text-indigo-400" /> 
                <span className="flex-1">All Applications</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 mt-auto bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative">
                <div className="avatar text-xs shadow-md">
                  {getInitial(currentUser?.name)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'User'}</p>
                <p className="text-[11px] text-slate-400 capitalize truncate">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content relative bg-slate-950 overflow-hidden">
        {/* Ambient Dashboard Background Photo for All Users */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.14] bg-cover bg-center bg-no-repeat z-0 filter brightness-90 contrast-110"
          style={{ backgroundImage: `url(${dashboardBg})` }}
        />
        {/* Sticky Topbar Header */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl border border-slate-800 bg-slate-900/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button for applicants */}
            {currentUser?.role === 'user' && (
              <button
                onClick={() => navigate('/apply')}
                className="btn primary py-2 px-4 text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Application</span>
              </button>
            )}

            <div className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="user-profile hidden sm:block">
                <div className="avatar text-xs">
                  {getInitial(currentUser?.name)}
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200 leading-none">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Main Content Container */}
        <div className="page-content flex-1 overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
