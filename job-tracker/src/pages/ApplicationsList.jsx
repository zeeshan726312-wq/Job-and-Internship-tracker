import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Video, 
  XCircle, 
  Search, 
  ExternalLink,
  Briefcase,
  LayoutGrid,
  List,
  Calendar,
  Edit2,
  Trash2,
  X,
  Check,
  FileCheck,
  Link as LinkIcon
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let icon = <Clock className="w-3.5 h-3.5 text-slate-400" />;

  switch (status) {
    case 'Applied':
    case 'Pending':
      colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      icon = <Clock className="w-3.5 h-3.5 text-amber-400" />;
      break;
    case 'Shortlisted':
      colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
      break;
    case 'Interview':
      colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      icon = <Video className="w-3.5 h-3.5 text-purple-400" />;
      break;
    case 'Hired':
    case 'Offered':
    case 'Accepted':
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      break;
    case 'Rejected':
      colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${colorClasses}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
};

const ApplicationsList = () => {
  const { 
    jobs, 
    applications, 
    personalApps, 
    currentUser, 
    editPersonalApp,
    updateApplicationDetails,
    deletePersonalApp,
    deleteApplication
  } = useContext(AppContext);

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filterType, setFilterType] = useState('All'); // All, Job, Internship
  const [filterStatus, setFilterStatus] = useState('All'); // All, Applied, Interview, Hired, Rejected
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit Modal State
  const [editingApp, setEditingApp] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    company: '',
    type: 'Job',
    status: 'Applied',
    deadline: '',
    interviewSchedule: '',
    link: '',
    notes: ''
  });

  const isUserApp = (app) => {
    if (!app) return false;
    if (!currentUser) return true;
    if (currentUser.role === 'admin' || currentUser.role === 'employer') return true;

    const cName = (currentUser.name || '').toLowerCase().trim();
    const cUsername = (currentUser.username || '').toLowerCase().trim();
    const cEmail = (currentUser.email || '').toLowerCase().trim();
    
    const appName = (app.applicantName || '').toLowerCase().trim();
    const appEmail = (app.applicantEmail || '').toLowerCase().trim();

    if (appEmail && cEmail && appEmail === cEmail) return true;
    if (appName && (appName === cName || appName === cUsername || (cName && appName.includes(cName)))) return true;
    if (currentUser.role === 'user' && (!appName || appName === 'user demo' || appName === 'user')) return true;
    return false;
  };

  const safeApps = Array.isArray(applications) ? applications : [];
  const safePersonal = Array.isArray(personalApps) ? personalApps : [];
  const safeJobsList = Array.isArray(jobs) ? jobs : [];

  const myApplications = safeApps.filter(app => app && (isUserApp(app) || currentUser?.role === 'employer' || currentUser?.role === 'admin'));
  const myPersonalApps = safePersonal.filter(app => app && (isUserApp(app) || currentUser?.role === 'admin'));

  // Combine both sources into a unified list
  const combinedApps = [
    ...myApplications.map(app => {
      const job = safeJobsList.find(j => j && j.id === app.jobId);
      return {
        id: `plat-${app.id}`,
        originalId: app.id,
        source: 'Platform',
        title: job?.title || 'Platform Job',
        company: job?.company || 'Platform Company',
        type: job?.type || 'Job',
        status: app.status || 'Applied',
        deadline: job?.deadline || 'N/A',
        link: app.applicantLink || job?.externalUrl || '#',
        resumeFileName: app.resumeFileName || '',
        resumeFileData: app.resumeFileData || '',
        applicantPhone: app.applicantPhone || '',
        isExternal: job?.isExternal || false,
        externalUrl: job?.externalUrl || '',
        interviewSchedule: app.interviewSchedule || '',
        feedback: app.feedback || ''
      };
    }),
    ...myPersonalApps.map(app => ({
      id: `pers-${app.id}`,
      originalId: app.id,
      source: 'Personal',
      title: app.title,
      company: app.company,
      type: app.type || 'Job',
      status: app.status || 'Applied',
      deadline: app.deadline || 'N/A',
      link: app.link || '#',
      interviewSchedule: app.interviewSchedule || '',
      workMode: app.workMode,
      experienceLevel: app.experienceLevel,
      notes: app.notes || ''
    }))
  ];

  // Apply filters
  const filteredApps = combinedApps.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || app.type === filterType;
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (app) => {
    if (window.confirm(`Are you sure you want to delete "${app.title}" at ${app.company}?`)) {
      if (app.source === 'Personal') {
        deletePersonalApp(app.originalId);
      } else {
        deleteApplication(app.originalId);
      }
    }
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setEditFormData({
      title: app.title,
      company: app.company,
      type: app.type || 'Job',
      status: app.status || 'Applied',
      deadline: app.deadline === 'N/A' ? '' : app.deadline,
      interviewSchedule: app.interviewSchedule || '',
      link: app.link === '#' ? '' : app.link,
      notes: app.notes || app.feedback || ''
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingApp) return;

    if (editingApp.source === 'Personal') {
      editPersonalApp(editingApp.originalId, {
        title: editFormData.title,
        company: editFormData.company,
        type: editFormData.type,
        deadline: editFormData.deadline || 'N/A',
        interviewSchedule: editFormData.interviewSchedule,
        link: editFormData.link || '#',
        notes: editFormData.notes
      });
    } else {
      updateApplicationDetails(editingApp.originalId, {
        interviewSchedule: editFormData.interviewSchedule,
        feedback: editFormData.notes
      });
    }

    setEditingApp(null);
  };

  const kanbanColumns = [
    { key: 'Applied', label: 'Applied', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { key: 'Shortlisted', label: 'Shortlisted', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' },
    { key: 'Interview', label: 'Interview Stage', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
    { key: 'Hired', label: 'Hired / Offered', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { key: 'Rejected', label: 'Rejected', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' }
  ];

  return (
    <div className="panel-container space-y-6 font-sans">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-8 overflow-hidden text-white shadow-2xl darkblue-animated-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md float-icon">
              <FileText className="w-3.5 h-3.5 text-indigo-300" /> Live Application Pipeline
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Application Tracker & Status Board
            </h2>
            <p className="text-slate-200 text-xs mt-1 font-medium">
              View status updates assigned by employers, manage active job & internship submissions, and track interview schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-4 h-4" /> Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md keep-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Detailed List View"
              >
                <List className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card bg-white dark:bg-slate-900/80 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full !pl-10 text-xs bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select text-xs py-2 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="All">All Types (Jobs & Internships)</option>
              <option value="Job">Job Positions</option>
              <option value="Internship">Internships</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select text-xs py-2 bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Scheduled</option>
              <option value="Hired">Hired / Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const colApps = filteredApps.filter(app => 
              col.key === 'Applied' ? (app.status === 'Applied' || app.status === 'Pending') : app.status === col.key
            );

            return (
              <div key={col.key} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold text-xs ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white keep-white font-bold text-[11px]">
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {colApps.length === 0 ? (
                    <div className="border border-dashed border-slate-300 dark:border-slate-800/80 rounded-xl p-4 text-center text-slate-500 text-xs py-8">
                      No applications
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 p-4 rounded-xl space-y-2.5 shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                            app.type === 'Internship' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                            {app.type}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(app)}
                              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                              title="Edit Application Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(app)}
                              className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug flex flex-wrap items-center gap-1.5">
                            {app.title}
                            {app.isExternal && (
                              <span className="text-[9px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-bold border border-sky-500/30 flex items-center gap-1">
                                <ExternalLink className="w-2.5 h-2.5" /> External
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{app.company}</p>
                        </div>

                        {/* Deadline & Interview Schedule Tracking Fields */}
                        <div className="space-y-1 pt-1 text-[11px] text-slate-400">
                          {app.deadline && app.deadline !== 'N/A' && (
                            <div className="flex items-center gap-1.5 text-amber-300/90">
                              <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Deadline: {app.deadline}</span>
                            </div>
                          )}
                          {app.interviewSchedule && (
                            <div className="flex items-center gap-1.5 text-purple-300/90 font-semibold">
                              <Video className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>Interview: {app.interviewSchedule}</span>
                            </div>
                          )}
                        </div>

                        {/* Read-Only Status Display for Applicant */}
                        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <StatusBadge status={app.status} />

                            {app.link && app.link !== '#' && (
                              <a
                                href={app.link.startsWith('http') ? app.link : `https://${app.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-bold hover:underline"
                                title="Portfolio / Link"
                              >
                                <LinkIcon className="w-3 h-3" /> Link ↗
                              </a>
                            )}
                          </div>

                          {app.resumeFileName && (
                            <a
                              href={app.resumeFileData || '#'}
                              download={app.resumeFileName}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold hover:underline"
                              title="Download CV"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> CV: {app.resumeFileName}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredApps.length === 0 ? (
            <div className="card text-center py-12 border-slate-800">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-white">No Applications Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or apply to active listings on the dashboard.</p>
            </div>
          ) : (
            filteredApps.map(app => (
              <div 
                key={app.id}
                className="card bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl transition-all shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0">{app.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        app.type === 'Internship' 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      }`}>
                        {app.type}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        {app.source} Source
                      </span>
                      {app.isExternal && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded font-bold border border-sky-500/30 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> External Link
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {app.company}
                      </span>
                      {app.deadline && app.deadline !== 'N/A' && (
                        <span className="flex items-center gap-1 text-amber-300/90">
                          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Deadline: {app.deadline}
                        </span>
                      )}
                      {app.interviewSchedule && (
                        <span className="flex items-center gap-1 text-purple-300/90 font-semibold">
                          <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          Interview: {app.interviewSchedule}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    {/* Read-Only Status Display for Applicant */}
                    <StatusBadge status={app.status} />

                    <button
                      onClick={() => openEditModal(app)}
                      className="btn secondary py-1.5 px-3 text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(app)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 border border-slate-800 rounded-xl transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {app.link && app.link !== '#' && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn py-1.5 px-3 text-xs flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white border-0 keep-white"
                        title="Open External Job Posting"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> 
                        {app.isExternal ? 'Visit External Job' : 'Link'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" /> Edit Application Details
              </h3>
              <button
                onClick={() => setEditingApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Job Title</label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    disabled={editingApp.source === 'Platform'}
                    className="input-field text-xs bg-slate-950 border-slate-800 disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Company / Organization</label>
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    disabled={editingApp.source === 'Platform'}
                    className="input-field text-xs bg-slate-950 border-slate-800 disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Current Application Status (Employer Managed)</label>
                  <div className="pt-1">
                    <StatusBadge status={editFormData.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Status is updated by the employer/recruiter in their employer portal.
                  </p>
                </div>

                <div>
                  <label className="form-label text-xs">Application Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    disabled={editingApp.source === 'Platform'}
                    className="form-select text-xs bg-slate-950 border-slate-800 text-white disabled:opacity-60"
                  >
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Target Deadline</label>
                  <input
                    type="date"
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                    disabled={editingApp.source === 'Platform'}
                    className="input-field text-xs bg-slate-950 border-slate-800 disabled:opacity-60 text-white"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Interview Schedule Date / Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-08-10 at 10:00 AM"
                    value={editFormData.interviewSchedule}
                    onChange={(e) => setEditFormData({ ...editFormData, interviewSchedule: e.target.value })}
                    className="input-field text-xs bg-slate-950 border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">External Link / Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://company.com/careers"
                  value={editFormData.link}
                  onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                  className="input-field text-xs bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs">Notes / Candidate Preparation</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Add your preparation notes or application reminders..."
                  className="form-textarea text-xs bg-slate-950 border-slate-800 text-white min-h-[70px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="btn secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary py-2 px-5 text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
