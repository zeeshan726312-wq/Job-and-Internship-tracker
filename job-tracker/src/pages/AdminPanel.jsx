import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Trash2, 
  UserPlus, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Edit2,
  Plus,
  AlertCircle,
  Search,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';

const AdminPanel = () => {
  const { 
    jobs, 
    applications, 
    updateApplicationStatus, 
    deleteApplication, 
    deleteJob,
    usersDb, 
    deleteUser, 
    updateUserRole,
    signup,
    personalApps,
    mentorApps,
    approveMentorApp,
    rejectMentorApp
  } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, applications
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [modalTitle, setModalTitle] = useState('Provision New User Account');
  
  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    mobile: '+92 300 0000000',
    idCard: '12345-1234567-1'
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const applicants = usersDb.filter(u => u.role === 'user');
  const employers = usersDb.filter(u => u.role === 'employer');
  const mentors = usersDb.filter(u => u.role === 'mentor');
  const admins = usersDb.filter(u => u.role === 'admin');

  const hiredCount = applications.filter(a => a.status === 'Hired').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  const openAddUserModalWithRole = (defaultRole = 'user', title = 'Provision New User Account') => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: defaultRole,
      mobile: '+92 300 0000000',
      idCard: '12345-1234567-1'
    });
    setModalTitle(title);
    setFormError('');
    setFormSuccess('');
    setShowAddUserModal(true);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUser.email.endsWith('@gmail.com')) {
      setFormError('Please enter a valid Gmail address (@gmail.com)');
      return;
    }
    if (!newUser.name.trim() || !newUser.password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const res = signup(newUser);
    if (res.success) {
      setFormSuccess(`Account for ${newUser.name} created successfully as ${newUser.role.toUpperCase()}!`);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        mobile: '+92 300 0000000',
        idCard: '12345-1234567-1'
      });
      setTimeout(() => {
        setShowAddUserModal(false);
        setFormSuccess('');
      }, 1500);
    } else {
      setFormError(res.message || 'User creation failed.');
    }
  };

  const filteredUsers = usersDb.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-900 text-white shadow-2xl border border-emerald-500/40"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" /> System Manager Console
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Administrator Control Panel
            </h2>
            <p className="text-emerald-100 text-xs mt-1 font-medium">
              Manage platform system users, provision new admin accounts, monitor job listings, and control applicant submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* DEDICATED ADD NEW ADMIN BUTTON */}
            <button
              onClick={() => openAddUserModalWithRole('admin', 'Add New Administrator Account')}
              className="btn bg-white text-emerald-900 hover:bg-slate-100 py-2.5 px-4 text-xs font-extrabold shadow-xl flex items-center gap-2 border-0"
              title="Add New Admin Account"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Add New Admin
            </button>

            <button
              onClick={() => openAddUserModalWithRole('user', 'Provision New User Account')}
              className="btn bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-white/30 py-2.5 px-4 text-xs font-bold flex items-center gap-2 backdrop-blur-md"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" /> Provision User
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overview Stats
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          User Accounts ({usersDb.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Jobs Directory ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'applications' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('hired')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'hired' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hired Candidates ({hiredCount})
        </button>
        <button
          onClick={() => setActiveTab('mentor_approval')}
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'mentor_approval' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mentorship ({mentorApps.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total System Users</h4>
                <Users className="w-5 h-5 text-indigo-500 opacity-90" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{usersDb.length}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{applicants.length} Applicants • {employers.length} Recruiters • {admins.length} Admins</p>
            </div>

            <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Jobs</h4>
                <Briefcase className="w-5 h-5 text-amber-500 opacity-90" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{jobs.length}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Listings Published</p>
            </div>

            <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submissions</h4>
                <FileText className="w-5 h-5 text-purple-500 opacity-90" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{applications.length}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{interviewCount} Interview Scheduled</p>
            </div>

            <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Hires</h4>
                <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-90" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{hiredCount}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Successful Placements</p>
            </div>
          </div>
        </div>
      )}

      {/* USER ACCOUNTS MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Platform User Database ({usersDb.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage permissions, role assignments, or delete accounts.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field text-xs !pl-9 py-2 bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800"
                />
              </div>
              
              {/* Dedicated Add Admin Button in Table Bar */}
              <button
                onClick={() => openAddUserModalWithRole('admin', 'Add New Administrator Account')}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 text-xs font-bold shadow-md flex items-center gap-1.5 keep-white border-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> + Add Admin
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Gmail Address</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Change Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredUsers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          user.name ? user.name.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                        user.role === 'admin' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                        user.role === 'employer' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                        user.role === 'mentor' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' :
                        'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.email, e.target.value)}
                        className="form-select text-[11px] py-1 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="user">Applicant</option>
                        <option value="employer">Employer</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteUser(user.email)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" /> Platform Listings Directory ({jobs.length})
          </h3>
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company} • {job.type}</p>
                </div>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete Job Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> System Candidate Submissions ({applications.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrators can change the status of any application directly (Applied, Shortlisted, Interview, Hired, Rejected).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center font-medium">No application records found.</p>
            ) : (
              applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Applicant: {app.applicantName}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase border ${
                          app.status === 'Hired' || app.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                          app.status === 'Shortlisted' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' :
                          app.status === 'Interview' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' :
                          app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        }`}>
                          {app.status || 'Applied'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                        Position: <span className="font-bold text-slate-900 dark:text-white">{job?.title || 'Platform Position'}</span> • Company: {job?.company || 'Employer'}
                      </p>
                      {app.interviewSchedule && (
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Interview: {app.interviewSchedule}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Update Status:</span>
                        <select 
                          value={app.status || 'Applied'} 
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-1.5 font-bold cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                        >
                          <option value="Applied">Applied / Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview Stage</option>
                          <option value="Hired">Hired / Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                        title="Delete Submission Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* HIRED CANDIDATES TAB */}
      {activeTab === 'hired' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Successful Placements & Hired Candidates ({hiredCount})
          </h3>
          <div className="space-y-3">
            {applications.filter(a => a.status === 'Hired' || a.status === 'Shortlisted').length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center">No hired or shortlisted candidates recorded yet.</p>
            ) : (
              applications.filter(a => a.status === 'Hired' || a.status === 'Shortlisted').map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {app.applicantName} 
                        <span className="text-[10px] bg-emerald-600 text-white keep-white px-2 py-0.5 rounded font-extrabold uppercase">
                          {app.status}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        Position: {job?.title || 'Job Listing'} • Company: {job?.company || 'Employer'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Admin Status:</span>
                      <select 
                        value={app.status || 'Hired'} 
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-1.5 font-bold cursor-pointer focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                      >
                        <option value="Applied">Applied / Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview Stage</option>
                        <option value="Hired">Hired / Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MENTORSHIP APPROVAL TAB */}
      {activeTab === 'mentor_approval' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-500" /> Mentor Applications for Internships & Jobs ({mentorApps.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review mentors who applied to offer mentorship for internships. Once approved, mentorship will show on the applicant dashboard!
          </p>

          <div className="space-y-3">
            {mentorApps.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center">No mentor applications pending.</p>
            ) : (
              mentorApps.map(m => (
                <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.mentorName}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                        m.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                        m.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Position: <span className="font-bold text-slate-900 dark:text-white">{m.jobTitle}</span> ({m.company})
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      Mentorship Fee: {m.mentorshipFee}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{m.description}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status !== 'Approved' && (
                      <button
                        onClick={() => approveMentorApp(m.id)}
                        className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold shadow-md keep-white border-0"
                      >
                        Approve Mentorship
                      </button>
                    )}
                    {m.status !== 'Rejected' && (
                      <button
                        onClick={() => rejectMentorApp(m.id)}
                        className="btn bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 py-1.5 px-3 text-xs font-bold border border-rose-500/30"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PROVISION USER / ADD NEW ADMIN MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> {modalTitle}
              </h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. System Administrator"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Gmail Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin2@gmail.com"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="form-select text-xs py-2.5 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="admin">System Administrator (Admin)</option>
                  <option value="user">Applicant</option>
                  <option value="employer">Employer</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn secondary py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 text-xs font-bold shadow-lg shadow-emerald-500/25 keep-white border-0"
                >
                  Create {newUser.role === 'admin' ? 'Admin' : 'User'} Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
