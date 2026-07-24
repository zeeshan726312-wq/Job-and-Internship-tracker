import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import dashboardBg from '../../../Untitled design.png';
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
  Sparkles
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
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, applications
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  
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

  const filteredUsers = usersDb.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner with Photo Background */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-cover bg-center border border-emerald-500/30 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75)), url(${dashboardBg})` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> System Manager Console
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Administrator Control Panel
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Manage platform system users, monitor job listings, and control applicant submissions.
            </p>
          </div>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="btn primary py-2.5 px-4 text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Provision New User
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview Stats
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          User Accounts ({usersDb.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Platform Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Applications ({applications.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="flex justify-between items-center">
                <h4>Registered Users</h4>
                <Users className="w-5 h-5 text-indigo-400 opacity-80" />
              </div>
              <h2>{usersDb.length}</h2>
              <p className="text-xs text-slate-400 mt-1">{applicants.length} Applicants • {employers.length} Recruiters</p>
            </div>

            <div className="stat-card">
              <div className="flex justify-between items-center">
                <h4>Active Jobs</h4>
                <Briefcase className="w-5 h-5 text-amber-400 opacity-80" />
              </div>
              <h2>{jobs.length}</h2>
              <p className="text-xs text-slate-400 mt-1">Platform Positions</p>
            </div>

            <div className="stat-card">
              <div className="flex justify-between items-center">
                <h4>Tracked Submissions</h4>
                <FileText className="w-5 h-5 text-purple-400 opacity-80" />
              </div>
              <h2>{applications.length + personalApps.length}</h2>
              <p className="text-xs text-slate-400 mt-1">Total System Pipeline</p>
            </div>

            <div className="stat-card">
              <div className="flex justify-between items-center">
                <h4>Hired Placements</h4>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
              </div>
              <h2>{hiredCount}</h2>
              <p className="text-xs text-slate-400 mt-1">{interviewCount} in interview stages</p>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Platform User Accounts Directory
            </h3>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Gmail Address</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 text-slate-300 font-medium">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-white py-1 px-2.5 rounded-lg outline-none cursor-pointer"
                      >
                        <option value="user">Applicant</option>
                        <option value="employer">Employer</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                        title="Delete User"
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
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" /> Platform Active Jobs
          </h3>

          <div className="space-y-3">
            {jobs.map(j => (
              <div key={j.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    {j.title}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      {j.type}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Company: {j.company} • Deadline: {j.deadline || 'N/A'}</p>
                </div>
                <button
                  onClick={() => deleteJob(j.id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
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
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> All Platform Submissions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Job ID / Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3 font-bold text-white">{app.applicantName}</td>
                    <td className="p-3 text-slate-300 font-medium">Job #{app.jobId}</td>
                    <td className="p-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-white py-1 px-2.5 rounded-lg outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
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

      {/* Provision User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" /> Provision Platform User Account
            </h3>

            {formError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Admin"
                  className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Gmail Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="newuser@gmail.com"
                  className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs">Role Assignment</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="form-select text-xs py-2.5 bg-slate-950/80 border-slate-800 text-white"
                >
                  <option value="user">Applicant</option>
                  <option value="employer">Employer</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary py-2 px-4 text-xs font-bold"
                >
                  Provision User
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
