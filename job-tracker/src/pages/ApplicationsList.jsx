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
  GraduationCap,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  Filter,
  Calendar,
  Layers
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

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
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
        status: app.status || 'Applied',
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
      status: app.status || 'Applied',
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
      case 'Pending': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'Shortlisted': return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Interview': return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'Hired': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
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
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" /> Application Pipeline & Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor and manage all active job & internship submissions across stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Detailed List View"
            >
              <List className="w-4 h-4" /> List
            </button>
          </div>

          <button
            onClick={() => navigate('/apply')}
            className="btn primary py-2.5 px-4 text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Log Application
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card bg-slate-900/80 p-4 border border-slate-800 rounded-2xl space-y-3">
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
              className="input-field w-full !pl-10 text-xs bg-slate-950/80 border-slate-800"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap font-medium">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select text-xs py-2 bg-slate-950/80 border-slate-800 text-white"
            >
              <option value="All">All Types (Jobs & Internships)</option>
              <option value="Job">Job Positions</option>
              <option value="Internship">Internships</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap font-medium">Stage:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select text-xs py-2 bg-slate-950/80 border-slate-800 text-white"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Applied">Applied / Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Stage</option>
              <option value="Hired">Hired / Offered</option>
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
              <div key={col.key} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold text-xs ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 text-white text-[11px]">
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {colApps.length === 0 ? (
                    <div className="border border-dashed border-slate-800/80 rounded-xl p-4 text-center text-slate-500 text-xs py-8">
                      No applications
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-2.5 shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                            app.type === 'Internship' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                            {app.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {app.source}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-white leading-snug">{app.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{app.company}</p>
                        </div>

                        {/* Status Select inside Card */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 py-1 px-2 rounded-lg cursor-pointer outline-none hover:border-slate-700"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          {app.link && app.link !== '#' && (
                            <a
                              href={app.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-indigo-400 p-1"
                              title="External Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
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
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filter search terms or log a new application.</p>
              <button
                onClick={() => navigate('/apply')}
                className="btn primary py-2 px-4 text-xs font-bold mt-4"
              >
                <PlusCircle className="w-4 h-4" /> Open Application Form
              </button>
            </div>
          ) : (
            filteredApps.map(app => (
              <div 
                key={app.id}
                className="card bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 p-5 rounded-2xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white mb-0">{app.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        app.type === 'Internship' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                        {app.type}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {app.source} Source
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{app.company}</span>
                      {app.workMode && <span className="text-slate-500">({app.workMode})</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <StatusIcon status={app.status} />
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                      >
                        <option value="Applied" className="bg-slate-950 text-amber-400">Applied</option>
                        <option value="Shortlisted" className="bg-slate-950 text-indigo-400">Shortlisted</option>
                        <option value="Interview" className="bg-slate-950 text-purple-400">Interview</option>
                        <option value="Hired" className="bg-slate-950 text-emerald-400">Hired</option>
                        <option value="Rejected" className="bg-slate-950 text-rose-400">Rejected</option>
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
      )}
    </div>
  );
};

export default ApplicationsList;
