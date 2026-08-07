import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Trash2, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  CheckCircle2,
  Video,
  AlertCircle,
  Search,
  PlusCircle,
  X,
  UserCheck,
  ExternalLink
} from 'lucide-react';

const AdminPanel = () => {
  const { 
    jobs, 
    addJob,
    applications,
    updateApplicationStatus, 
    deleteApplication, 
    deleteJob,
    usersDb, 
    deleteUser, 
    updateUserRole,
    signup,
    mentorApps,
    approveMentorApp,
    rejectMentorApp
  } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs, applications, hired, mentor_approval
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobPostingMode, setJobPostingMode] = useState('standard'); // 'standard' | 'external'
  
  const [userSearch, setUserSearch] = useState('');
  const [modalTitle, setModalTitle] = useState('Add New Administrator Account');
  const [mentorApprovalMsg, setMentorApprovalMsg] = useState('');

  const handleApproveMentorship = (id) => {
    approveMentorApp(id);
    setMentorApprovalMsg("Mentorship program approved! It is now published live on the Applicant Dashboard.");
    setTimeout(() => setMentorApprovalMsg(''), 4000);
  };

  const handleRejectMentorship = (id) => {
    rejectMentorApp(id);
    setMentorApprovalMsg("Mentorship program status updated to Rejected.");
    setTimeout(() => setMentorApprovalMsg(''), 4000);
  };
  
  // Add Admin User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    mobile: '+92 300 0000000',
    idCard: '12345-1234567-1'
  });

  // Change Admin Email/Password State


  // Admin Public Job Form State with All Compulsory Details
  const [adminJob, setAdminJob] = useState({
    title: '',
    company: 'System Admin',
    type: 'Job',
    workMode: 'Remote',
    experienceLevel: 'Entry Level',
    salary: '',
    status: 'Open',
    deadline: '',
    requirements: '',
    externalUrl: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const applicants = usersDb.filter(u => u.role === 'user');
  const employers = usersDb.filter(u => u.role === 'employer');
  const admins = usersDb.filter(u => u.role === 'admin');

  const hiredCount = applications.filter(a => a.status === 'Hired' || a.status === 'Offered').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  const openAddAdminModal = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      mobile: '+92 300 0000000',
      idCard: '12345-1234567-1'
    });
    setModalTitle('Add New Administrator Account');
    setFormError('');
    setFormSuccess('');
    setShowAddUserModal(true);
  };

  const handleAddAdminUser = (e) => {
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
      setFormSuccess(`Administrator account for ${newUser.name} created successfully!`);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'admin',
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

  const handlePostAdminJob = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (jobPostingMode === 'external') {
      if (!adminJob.title.trim() || !adminJob.externalUrl.trim()) {
        setFormError('Please enter both the Job Title and the External Job Link (URL).');
        return;
      }

      let formattedUrl = adminJob.externalUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      addJob({
        ...adminJob,
        title: adminJob.title.trim(),
        company: adminJob.company.trim() || 'External Employer',
        type: adminJob.type || 'Job',
        workMode: adminJob.workMode || 'Remote',
        experienceLevel: adminJob.experienceLevel || 'Entry Level',
        salary: adminJob.salary.trim() || 'Competitive',
        deadline: adminJob.deadline || '',
        requirements: adminJob.requirements.trim() || 'Apply directly on the external job posting page.',
        externalUrl: formattedUrl,
        isExternal: true,
        postedBy: 'Admin',
        status: 'Open'
      });

      setFormSuccess(`External job opportunity "${adminJob.title}" published! Candidates will be directed to ${formattedUrl}`);
    } else {
      if (!adminJob.title.trim() || !adminJob.company.trim() || !adminJob.deadline || !adminJob.requirements.trim() || !adminJob.salary.trim()) {
        setFormError('Please fill in all compulsory job fields (Title, Company, Category, Work Mode, Experience Level, Salary/Stipend, Deadline, Requirements).');
        return;
      }

      addJob({
        ...adminJob,
        title: adminJob.title.trim(),
        company: adminJob.company.trim() || 'System Admin',
        type: adminJob.type || 'Job',
        workMode: adminJob.workMode || 'Remote',
        experienceLevel: adminJob.experienceLevel || 'Entry Level',
        salary: adminJob.salary.trim(),
        postedBy: 'Admin',
        status: 'Open'
      });

      setFormSuccess(`"${adminJob.title}" published successfully to all panels! Open for all candidates to apply.`);
    }

    setAdminJob({
      title: '',
      company: 'System Admin',
      type: 'Job',
      workMode: 'Remote',
      experienceLevel: 'Entry Level',
      salary: '',
      status: 'Open',
      deadline: '',
      requirements: '',
      externalUrl: ''
    });

    setTimeout(() => {
      setShowAddJobModal(false);
      setFormSuccess('');
    }, 1500);
  };

  const filteredUsers = usersDb.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const openAddStandardJobModal = () => {
    setFormError('');
    setFormSuccess('');
    setJobPostingMode('standard');
    setAdminJob({
      title: '',
      company: 'System Admin',
      type: 'Job',
      workMode: 'Remote',
      experienceLevel: 'Entry Level',
      salary: '',
      status: 'Open',
      deadline: '',
      requirements: '',
      externalUrl: ''
    });
    setShowAddJobModal(true);
  };

  const openAddExternalJobModal = () => {
    setFormError('');
    setFormSuccess('');
    setJobPostingMode('external');
    setAdminJob({
      title: '',
      company: 'System Admin',
      type: 'Job',
      workMode: 'Remote',
      experienceLevel: 'Entry Level',
      salary: '',
      status: 'Open',
      deadline: '',
      requirements: '',
      externalUrl: ''
    });
    setShowAddJobModal(true);
  };

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden text-white shadow-2xl darkblue-animated-header"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md float-icon">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" /> System Manager Console
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Administrator Control Panel
            </h2>
            <p className="text-emerald-100 text-xs mt-1 font-medium">
              Manage platform system users, log candidate applications, and control hiring statuses across all panels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* DEDICATED POST STANDARD JOB BUTTON */}
            <button
              onClick={openAddStandardJobModal}
              className="btn bg-white text-emerald-900 hover:bg-slate-100 py-2.5 px-4 text-xs font-extrabold shadow-xl flex items-center gap-1.5 border-0 transition-transform hover:scale-105"
              title="Post New Standard Opportunity for All Users"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" /> + Post Job
            </button>

            {/* DEDICATED POST EXTERNAL LINK JOB BUTTON */}
            <button
              onClick={openAddExternalJobModal}
              className="btn bg-sky-500 hover:bg-sky-400 text-white py-2.5 px-4 text-xs font-extrabold shadow-xl flex items-center gap-1.5 border-0 keep-white shimmer-effect transition-transform hover:scale-105"
              title="Post External Link Job Direct Page"
            >
              <ExternalLink className="w-4 h-4 text-white" /> + Post External Job Link
            </button>

            {/* DEDICATED ADD ADMIN ONLY BUTTON */}
            <button
              onClick={openAddAdminModal}
              className="btn bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/70 text-white keep-white border border-emerald-600 dark:border-white/30 py-2.5 px-4 text-xs font-bold flex items-center gap-2 backdrop-blur-md cursor-pointer shadow-md"
              title="Add New Administrator Account"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200 dark:text-emerald-300" /> + Add Admin
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
          All Applications ({applications.length})
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
          className={`flex-1 min-w-[110px] py-2 text-xs font-bold rounded-xl transition-all relative ${
            activeTab === 'mentor_approval' ? 'bg-emerald-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mentorship ({mentorApps.length})
          {mentorApps.filter(m => m.status === 'Pending').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-amber-500 text-black font-extrabold rounded-full animate-pulse">
              {mentorApps.filter(m => m.status === 'Pending').length} Pending
            </span>
          )}
        </button>
      </div>

      {mentorApprovalMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {mentorApprovalMsg}
        </div>
      )}

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
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mentorship Proposals</h4>
                <GraduationCap className="w-5 h-5 text-emerald-500 opacity-90" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{mentorApps.length}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{mentorApps.filter(m => m.status === 'Pending').length} Pending Approval</p>
            </div>
          </div>

          {/* PENDING MENTORSHIP APPROVALS SECTION ON OVERVIEW */}
          {mentorApps.filter(m => m.status === 'Pending').length > 0 && (
            <div className="card bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" /> Pending Mentorship Approvals Required ({mentorApps.filter(m => m.status === 'Pending').length})
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                The following mentorship offerings were submitted by mentors. Review and approve them so they will be published live on the student applicant dashboard.
              </p>

              <div className="space-y-3">
                {mentorApps.filter(m => m.status === 'Pending').map(m => (
                  <div key={`overview-${m.id}`} className="p-4 bg-white dark:bg-slate-900 border border-amber-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.mentorName}</h4>
                        <span className="text-[10px] px-2.5 py-0.5 rounded font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Program: <span className="font-bold text-slate-900 dark:text-white">{m.jobTitle}</span> ({m.company})
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        Mentorship Fee: {m.mentorshipFee}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        "{m.description}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveMentorship(m.id)}
                        className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 text-xs font-bold shadow-md keep-white border-0 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Mentorship
                      </button>
                      <button
                        onClick={() => handleRejectMentorship(m.id)}
                        className="btn bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 py-2 px-3 text-xs font-bold border border-rose-500/30"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              
              <button
                onClick={openAddAdminModal}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" /> Platform Listings Directory ({jobs.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All jobs posted by Admin and Employers automatically sync across all user panels.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openAddStandardJobModal}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3.5 text-xs font-bold shadow-md flex items-center gap-1.5 keep-white border-0"
              >
                <PlusCircle className="w-4 h-4 text-white" /> + Post Platform Job
              </button>
              <button
                onClick={openAddExternalJobModal}
                className="btn bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 text-xs font-bold shadow-md flex items-center gap-1.5 keep-white border-0"
              >
                <ExternalLink className="w-4 h-4 text-white" /> + Post External Job Link
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-6 text-center font-medium">No job listings found on the platform.</p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        {job.type}
                      </span>
                      {job.postedBy === 'Admin' || job.company === 'System Admin' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                          Admin Created
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                          Employer: {job.company}
                        </span>
                      )}
                      {job.externalUrl && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-extrabold flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-sky-500" /> External Link
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Company: {job.company} • Deadline: {job.deadline || 'N/A'}
                    </p>
                    {job.externalUrl && (
                      <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-0.5 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        Direct URL: <a href={job.externalUrl} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-sky-500 break-all">{job.externalUrl}</a>
                      </p>
                    )}
                    {job.requirements && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{job.requirements}</p>}
                  </div>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20 shrink-0"
                    title="Delete Job Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> System Candidate Submissions ({applications.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View candidate application submissions and update hiring statuses across all platform listings.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-6 text-center font-medium">No application records found.</p>
            ) : (
              applications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                          Applicant: {app.applicantName}
                        </h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold uppercase border ${
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
                      {app.applicantEmail && (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Email: {app.applicantEmail}</p>
                      )}
                      {app.interviewSchedule && (
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Interview: {app.interviewSchedule}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Set Status:</span>
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
            {applications.filter(a => a.status === 'Hired' || a.status === 'Shortlisted' || a.status === 'Offered').length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center">No hired or shortlisted candidates recorded yet.</p>
            ) : (
              applications.filter(a => a.status === 'Hired' || a.status === 'Shortlisted' || a.status === 'Offered').map(app => {
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
                        onClick={() => handleApproveMentorship(m.id)}
                        className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold shadow-md keep-white border-0"
                      >
                        Approve Mentorship
                      </button>
                    )}
                    {m.status !== 'Rejected' && (
                      <button
                        onClick={() => handleRejectMentorship(m.id)}
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

      {/* POST ADMIN PUBLIC JOB / OPPORTUNITY MODAL */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-500" /> Post Official Opportunity (Public Post)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  This public opportunity will be published across all user panels for all candidates to view and apply.
                </p>
              </div>
              <button 
                onClick={() => setShowAddJobModal(false)}
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

            <form onSubmit={handlePostAdminJob} className="space-y-4">
              {/* Job Posting Mode Segmented Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1">
                <button
                  type="button"
                  onClick={() => setJobPostingMode('standard')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    jobPostingMode === 'standard'
                      ? 'bg-emerald-600 text-white shadow-md keep-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Platform Job (1-Click Apply)
                </button>
                <button
                  type="button"
                  onClick={() => setJobPostingMode('external')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    jobPostingMode === 'external'
                      ? 'bg-sky-600 text-white shadow-md keep-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> External Link Job (Direct Page)
                </button>
              </div>

              {jobPostingMode === 'external' && (
                <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl space-y-2">
                  <label className="form-label text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-sky-500" /> External Job Link (URL) *
                  </label>
                  <input
                    type="url"
                    value={adminJob.externalUrl}
                    onChange={(e) => setAdminJob({ ...adminJob, externalUrl: e.target.value })}
                    placeholder="https://careers.google.com/jobs/results/123456789/"
                    className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-sky-300 dark:border-sky-800 font-semibold focus:ring-2 focus:ring-sky-500"
                    required={jobPostingMode === 'external'}
                  />
                  <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                    Applicants on the user panel will be taken directly to this external page URL when they click Apply.
                  </p>
                </div>
              )}

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Opportunity Title *</label>
                <input
                  type="text"
                  value={adminJob.title}
                  onChange={(e) => setAdminJob({ ...adminJob, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer or React Developer Intern"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company / Organization {jobPostingMode === 'external' ? '(Optional)' : '*'}
                  </label>
                  <input
                    type="text"
                    value={adminJob.company}
                    onChange={(e) => setAdminJob({ ...adminJob, company: e.target.value })}
                    placeholder={jobPostingMode === 'external' ? 'e.g. Google Careers' : 'System Admin or Organization Name'}
                    className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required={jobPostingMode !== 'external'}
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Category / Type *</label>
                  <select
                    value={adminJob.type}
                    onChange={(e) => setAdminJob({ ...adminJob, type: e.target.value })}
                    className="form-select text-xs py-2.5 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  >
                    <option value="Job">Full-time Job</option>
                    <option value="Internship">Internship Program</option>
                    <option value="Part-time">Part-time Job</option>
                    <option value="Contract">Contract Position</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Work Mode *</label>
                  <select
                    value={adminJob.workMode}
                    onChange={(e) => setAdminJob({ ...adminJob, workMode: e.target.value })}
                    className="form-select text-xs py-2.5 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Experience Level *</label>
                  <select
                    value={adminJob.experienceLevel}
                    onChange={(e) => setAdminJob({ ...adminJob, experienceLevel: e.target.value })}
                    className="form-select text-xs py-2.5 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">
                    Salary / Stipend {jobPostingMode === 'external' ? '(Optional)' : '*'}
                  </label>
                  <input
                    type="text"
                    value={adminJob.salary}
                    onChange={(e) => setAdminJob({ ...adminJob, salary: e.target.value })}
                    placeholder="e.g. $60,000/yr or PKR 30,000/mo"
                    className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required={jobPostingMode !== 'external'}
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">
                  Application Deadline {jobPostingMode === 'external' ? '(Optional)' : '*'}
                </label>
                <input
                  type="date"
                  value={adminJob.deadline}
                  onChange={(e) => setAdminJob({ ...adminJob, deadline: e.target.value })}
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required={jobPostingMode !== 'external'}
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">
                  Requirements & Detailed Description {jobPostingMode === 'external' ? '(Optional)' : '*'}
                </label>
                <textarea
                  value={adminJob.requirements}
                  onChange={(e) => setAdminJob({ ...adminJob, requirements: e.target.value })}
                  placeholder={jobPostingMode === 'external' ? 'Brief note or leave empty for external direct link apply...' : 'Key responsibilities, candidate qualifications, required tech stack...'}
                  className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[90px]"
                  required={jobPostingMode !== 'external'}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="btn secondary py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn py-2.5 px-5 text-xs font-bold shadow-lg keep-white border-0 ${
                    jobPostingMode === 'external'
                      ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                  }`}
                >
                  {jobPostingMode === 'external' ? (
                    <><ExternalLink className="w-4 h-4 inline-block mr-1.5" />Publish External Link Job</>
                  ) : (
                    'Publish Public Opportunity to All Panels'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW ADMIN MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
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

            <form onSubmit={handleAddAdminUser} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Administrator Full Name *</label>
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
                  Create Admin Account
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
