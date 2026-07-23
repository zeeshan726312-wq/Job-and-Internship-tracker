import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  FileText, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Video, 
  XCircle, 
  Search, 
  ExternalLink,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const ApplicationsList = () => {
  const { 
    jobs, 
    applications, 
    personalApps, 
    currentUser, 
    updatePersonalAppStatus, 
    updateApplicationStatus 
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('All'); // All, Job, Internship
  const [filterStatus, setFilterStatus] = useState('All'); // All, Applied, Interview, Hired, Rejected
  const [searchQuery, setSearchQuery] = useState('');

  const applicantName = currentUser?.name || 'user';

  const myApplications = applications.filter(app => app.applicantName === applicantName);
  const myPersonalApps = personalApps.filter(app => app.applicantName === applicantName);

  // Combine both sources into a unified list
  const combinedApps = [
    ...myApplications.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return {
        id: `plat-${app.id}`,
        originalId: app.id,
        source: 'Platform',
        title: job?.title || 'Platform Job',
        company: job?.company || 'Platform Company',
        type: job?.type || 'Job',
        status: app.status,
        deadline: job?.deadline || 'N/A',
        link: '#',
        interviewSchedule: app.interviewSchedule,
        feedback: app.feedback
      };
    }),
    ...myPersonalApps.map(app => ({
      id: `pers-${app.id}`,
      originalId: app.id,
      source: 'Personal',
      title: app.title,
      company: app.company,
      type: app.type || 'Job',
      status: app.status,
      deadline: app.deadline || 'N/A',
      link: app.link || '#',
      workMode: app.workMode,
      experienceLevel: app.experienceLevel
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

  const handleStatusChange = (app, newStatus) => {
    if (app.source === 'Personal') {
      updatePersonalAppStatus(app.originalId, newStatus);
    } else {
      updateApplicationStatus(app.originalId, newStatus);
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Applied':
      case 'Pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Shortlisted': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'Interview': return <Video className="w-4 h-4 text-purple-400" />;
      case 'Hired': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="panel-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primaryText flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Application Tracker & History
          </h2>
          <p className="text-sm text-secondaryText">
            Manage all your active and past job/internship applications in real-time.
          </p>
        </div>
        <button
          onClick={() => navigate('/apply')}
          className="btn primary py-2.5 px-4 text-sm font-semibold shadow-md shadow-primary/20"
        >
          <PlusCircle className="w-4 h-4" /> Add Application Form
        </button>
      </div>

      {/* Filter Controls */}
      <div className="card bg-slate-900/60 p-4 border border-border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10 text-sm"
            />
            <Search className="w-4 h-4 text-secondaryText absolute left-3 top-3" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondaryText whitespace-nowrap font-medium">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select text-xs py-2"
            >
              <option value="All">All Types (Job & Internship)</option>
              <option value="Job">Job Applications</option>
              <option value="Internship">Internship Programs</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondaryText whitespace-nowrap font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select text-xs py-2"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied / Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Stage</option>
              <option value="Hired">Hired / Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Grid / Table */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-secondaryText/40 mb-3" />
            <h3 className="text-lg font-semibold text-primaryText">No Applications Found</h3>
            <p className="text-sm text-secondaryText mt-1">Try adjusting your filters or submit a new application form.</p>
            <button
              onClick={() => navigate('/apply')}
              className="btn primary py-2 px-4 text-xs mt-4"
            >
              <PlusCircle className="w-4 h-4" /> Open Application Form
            </button>
          </div>
        ) : (
          filteredApps.map(app => (
            <div 
              key={app.id}
              className="card bg-slate-900/40 hover:bg-slate-800/60 border border-border/60 p-5 rounded-2xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-white mb-0">{app.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                      app.type === 'Internship' 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {app.type}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-secondaryText border border-border">
                      {app.source} Source
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <span>{app.company}</span>
                    {app.workMode && <span className="text-xs text-secondaryText">({app.workMode})</span>}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-border">
                    <StatusIcon status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className="bg-transparent text-xs font-semibold text-primaryText outline-none cursor-pointer"
                    >
                      <option value="Applied" className="bg-slate-900 text-amber-400">Applied</option>
                      <option value="Shortlisted" className="bg-slate-900 text-blue-400">Shortlisted</option>
                      <option value="Interview" className="bg-slate-900 text-purple-400">Interview</option>
                      <option value="Hired" className="bg-slate-900 text-emerald-400">Hired</option>
                      <option value="Rejected" className="bg-slate-900 text-rose-400">Rejected</option>
                    </select>
                  </div>

                  {app.link && app.link !== '#' && (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn secondary py-1.5 px-3 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
