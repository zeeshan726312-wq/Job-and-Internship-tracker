import { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Sun,
  Moon,
  User,
  Camera,
  Edit2,
  CheckCircle2,
  Phone,
  CreditCard,
  Mail,
  KeyRound,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import '../index.css';

const Layout = () => {
  const { currentUser, logout, theme, toggleTheme, updateUserProfile, usersDb = [] } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Edit Profile Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileMobile, setProfileMobile] = useState('');
  const [profileIdCard, setProfileIdCard] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const openProfileModal = () => {
    setProfileName(currentUser?.name || '');
    setProfileEmail(currentUser?.email || '');
    setProfilePassword(currentUser?.password || '');
    setProfileMobile(currentUser?.mobile || '');
    setProfileIdCard(currentUser?.idCard || '');
    setAvatarPreview(currentUser?.avatarUrl || '');
    setProfileSaveSuccess(false);
    setProfileErrorMsg('');
    setShowEditProfileModal(true);
  };

  useEffect(() => {
    const handleOpenModal = () => openProfileModal();
    window.addEventListener('open-profile-modal', handleOpenModal);
    return () => window.removeEventListener('open-profile-modal', handleOpenModal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileErrorMsg('');

    if (!profileEmail.trim() || !profileEmail.toLowerCase().endsWith('@gmail.com')) {
      setProfileErrorMsg('Please enter a valid Gmail address (@gmail.com)');
      return;
    }
    if (!profilePassword || profilePassword.trim().length < 4) {
      setProfileErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const existing = usersDb.find(
      u => u && u.email && u.email.toLowerCase() === profileEmail.trim().toLowerCase() && 
           u.email.toLowerCase() !== (currentUser?.email || '').toLowerCase()
    );
    if (existing) {
      setProfileErrorMsg('This Gmail address is already registered to another account.');
      return;
    }

    updateUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      password: profilePassword.trim(),
      mobile: profileMobile.trim(),
      idCard: profileIdCard.trim(),
      avatarUrl: avatarPreview
    });
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setShowEditProfileModal(false);
    }, 1500);
  };

  // Extract initial for default avatar
  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Dynamic Header Title & Icon based on Route and Role
  const getHeaderDetails = () => {
    const path = location.pathname;

    if (currentUser?.role === 'admin') {
      if (path === '/applications') return { title: 'Admin — System Applications', icon: <FileText className="w-5 h-5 text-indigo-400" /> };
      return { title: 'Admin Panel', icon: <ShieldCheck className="w-5 h-5 text-indigo-400" /> };
    }

    if (currentUser?.role === 'employer') {
      if (path === '/applications') return { title: 'Employer — Candidate Pipeline', icon: <FileText className="w-5 h-5 text-indigo-400" /> };
      return { title: 'Employer Console', icon: <Briefcase className="w-5 h-5 text-indigo-400" /> };
    }

    if (currentUser?.role === 'mentor') {
      if (path === '/applications') return { title: 'Mentor — Student Applications', icon: <FileText className="w-5 h-5 text-indigo-400" /> };
      return { title: 'Mentorship Portal', icon: <GraduationCap className="w-5 h-5 text-indigo-400" /> };
    }

    if (path === '/applications') return { title: 'Application Tracker', icon: <FileText className="w-5 h-5 text-indigo-400" /> };
    return { title: 'Applicant Overview', icon: <LayoutDashboard className="w-5 h-5 text-indigo-400" /> };
  };

  const headerDetails = getHeaderDetails();

  const getRoleTitle = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'employer': return 'Recruiter / Employer';
      case 'mentor': return 'Career Mentor';
      default: return 'Student Applicant';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md z-40 lg:hidden cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Navigation */}
      <aside className={`sidebar
        fixed lg:static top-0 bottom-0 left-0 z-50 h-full
        w-72 bg-white dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-2xl backdrop-blur-xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                TrackerPro <span className="text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">2.0</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Job & Internship Suite</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
          {/* Role-Based Panel Views */}
          {currentUser?.role === 'user' && (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant Hub</div>
              <NavLink 
                to="/dashboard" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Overview & Workspace</span>
              </NavLink>
              <NavLink 
                to="/applicant" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <UserCheck className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Applicant Panel</span>
              </NavLink>
              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">My Applications & Status</span>
              </NavLink>
            </>
          )}

          {currentUser?.role === 'employer' && (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recruiter Hub</div>
              <NavLink 
                to="/employer" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Briefcase className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Employer Console</span>
              </NavLink>
              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Candidate Pipeline</span>
              </NavLink>
            </>
          )}

          {currentUser?.role === 'mentor' && (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mentorship Hub</div>
              <NavLink 
                to="/mentor" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Mentorship Portal</span>
              </NavLink>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Control</div>
              <NavLink 
                to="/admin" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">Admin Panel</span>
              </NavLink>
              <NavLink 
                to="/applications" 
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText className="w-4 h-4 text-indigo-500" /> 
                <span className="flex-1">System Applications</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar Footer User Info with Edit Profile Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 mt-auto bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={openProfileModal}
              className="flex items-center gap-3 overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity"
              title="Click to edit profile & photo"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md border border-emerald-400">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitial(currentUser?.name)
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {currentUser?.username || currentUser?.name || 'User'} <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize truncate">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-200 dark:border-rose-500/30 shrink-0 flex items-center gap-1 font-bold text-xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content relative bg-slate-50 dark:bg-slate-950 flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar Navigation Bar */}
        <header className="topbar h-16 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Navigation Drawer"
            >
              <Menu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </button>

            <div className="flex items-center gap-2">
              {headerDetails.icon}
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {headerDetails.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Clickable User Profile Badge displaying Username */}
            <div 
              onClick={openProfileModal}
              className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
              title="Click to edit profile details & photo"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md border border-emerald-400">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser?.username || currentUser?.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitial(currentUser?.username || currentUser?.name)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full text-[9px] shadow-sm">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-none flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {currentUser?.username || currentUser?.name} <Edit2 className="w-3 h-3 opacity-60" />
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize mt-0.5">{getRoleTitle(currentUser?.role)}</p>
              </div>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-500 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-200 dark:border-rose-500/30"
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

      {/* EDIT PROFILE & UPLOAD PICTURE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" /> Edit Profile & Photo
              </h3>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileErrorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {profileErrorMsg}
              </div>
            )}

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Profile details, Gmail, password and photo updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Avatar Upload Circle */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-3xl shadow-xl border-4 border-emerald-500/30">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitial(profileName)
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors border-2 border-white dark:border-slate-900">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Click camera icon to upload profile photo</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Gmail Address (Editable) */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Gmail Address *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Password (Editable) */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Login Password *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Phone / Mobile Number</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. +923001234567"
                    value={profileMobile}
                    onChange={(e) => setProfileMobile(e.target.value)}
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* CNIC / ID Card */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">CNIC / National ID Card</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 12345-1234567-1"
                    value={profileIdCard}
                    onChange={(e) => setProfileIdCard(e.target.value)}
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="btn secondary flex-1 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/25 keep-white border-0"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
