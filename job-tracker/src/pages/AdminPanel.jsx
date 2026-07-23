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
  Edit2
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
    personalApps
  } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, applications, settings
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
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

  const hiredCount = applications.filter(a => a.status === 'Hired').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

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
      setFormSuccess(`User ${newUser.name} created successfully as ${newUser.role}!`);
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
      setFormError(res.error);
    }
  };

  return (
    <div className="panel-container space-y-6">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/70 border-emerald-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> System Manager Console
          </div>
          <h2 className="text-2xl font-bold text-white">Administrator Control Panel</h2>
          <p className="text-sm text-secondaryText">
            Full system authority to manage users, control job & internship listings, track applications, and generate analytics.
          </p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="btn primary py-2.5 px-4 font-semibold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Create New User Account
        </button>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Total Registered Users</h4>
            <Users className="w-5 h-5 text-primary opacity-80" />
          </div>
          <h2>{usersDb.length}</h2>
          <p className="text-xs text-secondaryText mt-1">
            {applicants.length} Applicants • {employers.length} Employers • {mentors.length} Mentors
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Active Job / Internship Listings</h4>
            <Briefcase className="w-5 h-5 text-amber-400 opacity-80" />
          </div>
          <h2>{jobs.length}</h2>
          <p className="text-xs text-secondaryText mt-1">Platform opportunities</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Platform Applications</h4>
            <FileText className="w-5 h-5 text-purple-400 opacity-80" />
          </div>
          <h2>{applications.length + personalApps.length}</h2>
          <p className="text-xs text-secondaryText mt-1">{applications.length} Platform + {personalApps.length} Personal</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Hired / Placed Students</h4>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
          <h2>{hiredCount}</h2>
          <p className="text-xs text-secondaryText mt-1">{interviewCount} in active interview stage</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { key: 'overview', label: 'System Overview & Analytics', icon: BarChart3 },
          { key: 'users', label: `Manage Users (${usersDb.length})`, icon: Users },
          { key: 'jobs', label: `Job Listings (${jobs.length})`, icon: Briefcase },
          { key: 'applications', label: `All Applications (${applications.length})`, icon: FileText },
          { key: 'settings', label: 'System Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-secondaryText hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" /> Create Account for System User
            </h3>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="form-label text-xs">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="form-select text-xs"
                >
                  <option value="user">🧑 Applicant / Student</option>
                  <option value="employer">🏢 Employer (Opportunity Provider)</option>
                  <option value="mentor">🎓 Mentor (Guide / Support)</option>
                  <option value="admin">👨💼 Admin (System Manager)</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Gmail Address</label>
                <input
                  type="email"
                  placeholder="sarah@gmail.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="input-field text-xs w-full"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn secondary text-xs flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary text-xs font-semibold flex-1"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {/* 1. OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="card space-y-4">
            <h3 className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> User Distribution Breakdown
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-white">🧑 Student Applicants</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold">{applicants.length}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-white">🏢 Employers / Recruiters</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold">{employers.length}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-white">🎓 Mentors & Advisors</span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold">{mentors.length}</span>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" /> Application Pipeline Report
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Applied / Pending Review
                </span>
                <span className="font-bold text-white">
                  {applications.filter(a => a.status === 'Applied' || a.status === 'Pending').length}
                </span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-purple-300 flex items-center gap-1">
                  <Video className="w-4 h-4" /> Active Interview Stage
                </span>
                <span className="font-bold text-white">{interviewCount}</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-border flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Offers / Hired
                </span>
                <span className="font-bold text-white">{hiredCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3>Registered System Users</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="btn primary py-1.5 px-3 text-xs"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Account
            </button>
          </div>

          <div className="list space-y-3">
            {usersDb.map(u => (
              <div key={u.email} className="list-item items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-border">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    {u.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      u.role === 'employer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      u.role === 'mentor' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </h4>
                  <p className="text-xs text-secondaryText">{u.email} • Mobile: {u.mobile || 'N/A'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.email, e.target.value)}
                    className="form-select text-xs py-1 px-2"
                  >
                    <option value="user">User/Applicant</option>
                    <option value="employer">Employer</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>

                  {u.email !== 'admin@gmail.com' && (
                    <button
                      onClick={() => deleteUser(u.email)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAGE JOBS */}
      {activeTab === 'jobs' && (
        <div className="card space-y-4">
          <h3>Platform Job & Internship Listings</h3>
          <div className="list space-y-3">
            {jobs.length === 0 ? (
              <p className="text-xs text-secondaryText">No listings currently published.</p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="list-item items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-border">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                        {job.type}
                      </span>
                    </h4>
                    <p className="text-xs text-secondaryText">{job.company} • Deadline: {job.deadline || 'None'}</p>
                  </div>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                    title="Remove Job Posting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. ALL APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="card space-y-4">
          <h3>System Applications Oversight</h3>
          <div className="list space-y-3">
            {applications.length === 0 ? (
              <p className="text-xs text-secondaryText">No applications submitted yet.</p>
            ) : (
              applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="list-item items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-border">
                    <div>
                      <h4 className="font-bold text-white text-sm">Applicant: {app.applicantName}</h4>
                      <p className="text-xs text-secondaryText">Target Listing: {job?.title || 'Platform Position'} ({job?.company || 'Employer'})</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="form-select text-xs py-1 px-2"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                        title="Delete Application"
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

      {/* 5. SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="card space-y-4">
          <h3>System Settings & Maintenance</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-800/40 rounded-xl border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">Platform Maintenance Mode</p>
                <p className="text-xs text-secondaryText">Restricts new user registration during upgrades</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Normal Operational
              </span>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">Automated Database Backups</p>
                <p className="text-xs text-secondaryText">Sync user database & job applications nightly</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
