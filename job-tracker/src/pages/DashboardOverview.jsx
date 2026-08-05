import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Video, 
  XCircle, 
  FileText, 
  Calendar, 
  Send, 
  ArrowRight,
  Sparkles,
  Award,
  Building2,
  X,
  MessageSquare,
  Bell,
  ExternalLink
} from 'lucide-react';

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

const DashboardOverview = () => {
  const { jobs = [], applications = [], personalApps = [], currentUser, applyForJob, mentorApps = [], mentorships = [], requestMentorshipProgram, messages = [], markMessageRead } = useContext(AppContext);
  const navigate = useNavigate();
  const [applySuccessMsg, setApplySuccessMsg] = useState('');
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Redirect non-applicant roles to their specific dedicated panels
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (currentUser?.role === 'employer') {
      navigate('/employer', { replace: true });
    } else if (currentUser?.role === 'mentor') {
      navigate('/mentor', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleDirectApply = (job) => {
    const applicantName = currentUser?.name || currentUser?.username || 'User';
    if (job.isExternal && job.externalUrl) {
      // Open external link in new tab
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
      // Also track it in the pipeline
      applyForJob(job.id, applicantName);
      setApplySuccessMsg(`Opened "${job.title}" external page! Application tracked in your pipeline.`);
    } else {
      applyForJob(job.id, applicantName);
      setApplySuccessMsg(`Application for "${job.title}" submitted successfully! Real-time status update saved.`);
    }
    setTimeout(() => setApplySuccessMsg(''), 4000);
  };

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

  const myApplications = (applications || []).filter(isUserApp);
  const myPersonalApps = (personalApps || []).filter(isUserApp);

  const totalAppsCount = myApplications.length + myPersonalApps.length;
  const inReviewCount = myApplications.filter(a => a.status === 'Applied' || a.status === 'Pending').length + 
                        myPersonalApps.filter(a => a.status === 'Applied' || a.status === 'Pending').length;
  const interviewCount = myApplications.filter(a => a.status === 'Interview').length + 
                         myPersonalApps.filter(a => a.status === 'Interview').length;
  const hiredCount = myApplications.filter(a => a.status === 'Hired' || a.status === 'Shortlisted').length + 
                     myPersonalApps.filter(a => a.status === 'Hired' || a.status === 'Shortlisted').length;

  const successRate = totalAppsCount > 0 ? Math.round(((interviewCount + hiredCount) / totalAppsCount) * 100) : 0;

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-8 overflow-hidden colorful-banner text-white shadow-2xl border border-indigo-500/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold backdrop-blur-md float-icon">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Student Applicant Workspace
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Hi, {currentUser?.name || 'User'} 👋
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl leading-relaxed font-medium">
              View official platform opportunities posted by Admin, click any listing for full details, apply with 1-click, and monitor your live application status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/applications"
              className="btn bg-white text-emerald-800 hover:bg-slate-100 py-3 px-5 font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 border-0"
            >
              <FileText className="w-4 h-4 text-emerald-800" /> View Application Pipeline ({totalAppsCount})
            </Link>
          </div>
        </div>
      </div>

      {applySuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {applySuccessMsg}
        </div>
      )}

      {/* Metrics Stats Grid */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tracked */}
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tracked</h4>
            <Briefcase className="w-5 h-5 text-indigo-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalAppsCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Platform Submissions</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{totalAppsCount} total</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2: In Review */}
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">In Review</h4>
            <Clock className="w-5 h-5 text-amber-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{inReviewCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Awaiting Review</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{inReviewCount} active</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalAppsCount > 0 ? (inReviewCount/totalAppsCount)*100 : 0}%` }} />
          </div>
        </div>

        {/* Card 3: Interviews */}
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews</h4>
            <Video className="w-5 h-5 text-purple-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{interviewCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Scheduled Meetings</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">{interviewCount} live</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${totalAppsCount > 0 ? (interviewCount/totalAppsCount)*100 : 0}%` }} />
          </div>
        </div>

        {/* Card 4: Offers & Shortlists */}
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Offers & Shortlists</h4>
            <Award className="w-5 h-5 text-emerald-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{hiredCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Success Rate</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{successRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${successRate}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid-2">
        {/* Left Column: Open Platform Opportunities */}
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Briefcase className="w-5 h-5 text-indigo-500" /> Platform Opportunities ({jobs.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click Card for Full Details</span>
            </div>

            <div className="list max-h-[420px] overflow-y-auto pr-1 space-y-3">
              {jobs.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm py-6 text-center">No platform listings available.</p>
              ) : (
                jobs.map(job => {
                  const hasApplied = myApplications.some(app => app.jobId === job.id);
                  const isAdminJob = job.postedBy === 'Admin' || job.company === 'System Admin';
                  return (
                    <div 
                      key={job.id} 
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover-glow-card space-y-3 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="cursor-pointer" onClick={() => setSelectedJobDetail(job)}>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center flex-wrap gap-2 hover:text-indigo-500 transition-colors">
                            {job.title}
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
                              {job.type}
                            </span>
                            {isAdminJob && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                                Official Admin Listing
                              </span>
                            )}
                            {job.isExternal && (
                              <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded font-extrabold border border-sky-500/30 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> External Link
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">Company: {job.company}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedJobDetail(job)}
                            className="btn secondary py-1.5 px-2.5 text-xs font-bold"
                            title="View Full Details"
                          >
                            Details
                          </button>
                          {job.isExternal ? (
                            <button
                              onClick={() => handleDirectApply(job)}
                              className="btn py-1.5 px-3.5 text-xs font-bold transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-md border-0 keep-white flex items-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {hasApplied ? 'Visit Again ↗' : 'Apply on Site ↗'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDirectApply(job)}
                              className={`btn py-1.5 px-3.5 text-xs font-bold transition-all ${
                                hasApplied ? 'secondary opacity-70 cursor-default' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-0 keep-white'
                              }`}
                              disabled={hasApplied}
                            >
                              <Send className="w-3.5 h-3.5" />
                              {hasApplied ? 'Applied' : 'Apply Now'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Deadline: {job.deadline || 'N/A'}</span>
                          </div>
                          {job.workMode && (
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                              {job.workMode}
                            </span>
                          )}
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">{job.status || 'Active'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tracked Activity Feed */}
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <FileText className="w-5 h-5 text-purple-500" /> Application Pipeline
            </h3>
            <Link to="/applications" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1">
              View Tracker ({totalAppsCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="list max-h-[420px] overflow-y-auto pr-1 space-y-3">
            {myApplications.length === 0 && myPersonalApps.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto opacity-30 text-indigo-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No applications submitted yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select any platform opportunity listing on the left and click "Apply Now".</p>
                </div>
              </div>
            ) : (
              <>
                {myApplications.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={`plat-${app.id}`} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400/40 transition-colors">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job?.title || 'Platform Position'}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job?.company || 'Company Listing'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="status uppercase text-[10px]">
                          <StatusIcon status={app.status} /> {app.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {myPersonalApps.map(app => (
                  <div key={`pers-${app.id}`} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400/40 transition-colors">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{app.company} • External</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="status uppercase text-[10px]">
                        <StatusIcon status={app.status} /> {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: APPROVED MENTORSHIP PROGRAMS & FEES */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-500" /> Approved Career Mentorship Programs & Fees ({mentorApps.filter(m => m.status === 'Approved').length})
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Verified Mentors
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Apply for 1-on-1 career mentorship from approved mentors. Fees and curriculum notes are set directly by mentors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentorApps.filter(m => m.status === 'Approved').length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center col-span-2">No mentorship programs currently approved.</p>
          ) : (
            mentorApps.filter(m => m.status === 'Approved').map(m => {
              const myRequest = mentorships?.find(req => req.mentorAppId === m.id && (req.menteeName === currentUser?.name || req.menteeEmail === currentUser?.email));
              const hasApplied = !!myRequest;
              const requestStatus = myRequest?.status; // 'Pending' | 'Approved' | 'Rejected'

              return (
                <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.jobTitle} Mentorship</h4>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                        {m.mentorshipFee}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">Mentor: <span className="font-bold text-slate-900 dark:text-white">{m.mentorName}</span> ({m.company})</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">"{m.description}"</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    {/* Application status badge */}
                    {hasApplied ? (
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase border ${
                        requestStatus === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : requestStatus === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {requestStatus === 'Approved' ? '✓ Accepted by Mentor' : requestStatus === 'Rejected' ? '✕ Rejected by Mentor' : '⏳ Awaiting Mentor Review'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Open — Not Applied</span>
                    )}

                    {/* Apply button — only if not yet applied */}
                    {!hasApplied && (
                      <button
                        onClick={() => requestMentorshipProgram(m.id, m.mentorName, m.jobTitle, m.mentorshipFee)}
                        className="btn py-1.5 px-3.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md keep-white border-0"
                      >
                        Apply for Mentorship
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION 4: INBOX — Messages from Mentors & Employers */}
      {(() => {
        const email = currentUser?.email;
        const myMessages = messages.filter(msg =>
          msg.recipients === 'all' || msg.recipientEmails.includes(email)
        );
        const unread = myMessages.filter(msg => !msg.readBy.includes(email)).length;
        return (
          <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <MessageSquare className="w-5 h-5 text-indigo-500" /> Inbox
              </h3>
              {unread > 0 && (
                <span className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full font-bold animate-pulse">
                  <Bell className="w-3.5 h-3.5" /> {unread} New
                </span>
              )}
            </div>
            <div className="space-y-3">
              {myMessages.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No messages yet. Messages from mentors and employers will appear here.</p>
              ) : (
                myMessages.map(msg => {
                  const isUnread = !msg.readBy.includes(email);
                  return (
                    <div
                      key={msg.id}
                      onClick={() => isUnread && markMessageRead(msg.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isUnread
                          ? 'bg-indigo-500/5 border-indigo-500/30 hover:bg-indigo-500/10'
                          : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>}
                        <span className={`font-bold text-sm ${isUnread ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{msg.subject}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium capitalize">{msg.senderRole}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{msg.body}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5">From: <span className="font-semibold">{msg.senderName}</span> &bull; {new Date(msg.sentAt).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })()}

      {/* FULL JOB DETAILS MODAL */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
                    {selectedJobDetail.type || 'Job'}
                  </span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-500/30">
                    Official Admin Posted Opportunity
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedJobDetail.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Posted by: <span className="text-slate-900 dark:text-white font-bold">{selectedJobDetail.company || 'System Admin'}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedJobDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Compulsory Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Work Mode</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedJobDetail.workMode || 'Remote'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedJobDetail.experienceLevel || 'Entry Level'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Salary / Stipend</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{selectedJobDetail.salary || 'Competitive'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Deadline</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedJobDetail.deadline || 'No Deadline'}</span>
              </div>
            </div>

            {/* External Job Callout */}
            {selectedJobDetail.isExternal && selectedJobDetail.externalUrl && (
              <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300">External Application Page</span>
                </div>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">This is an external job posting. Clicking Apply will open the employer's official page in a new tab.</p>
                <a
                  href={selectedJobDetail.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 underline hover:text-sky-500 break-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {selectedJobDetail.externalUrl}
                </a>
              </div>
            )}

            {/* Full Requirements & Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Requirements & Detailed Description:
              </h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedJobDetail.requirements || 'No detailed requirements specified.'}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="btn secondary py-2.5 px-4 text-xs font-bold"
              >
                Close
              </button>
              {selectedJobDetail.isExternal ? (
                <button
                  onClick={() => {
                    handleDirectApply(selectedJobDetail);
                    setSelectedJobDetail(null);
                  }}
                  className="btn py-2.5 px-5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/25 border-0 keep-white flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply on External Site ↗
                </button>
              ) : (
                (() => {
                  const hasApplied = myApplications.some(app => app.jobId === selectedJobDetail.id);
                  return (
                    <button
                      onClick={() => {
                        handleDirectApply(selectedJobDetail);
                        setSelectedJobDetail(null);
                      }}
                      className={`btn py-2.5 px-5 text-xs font-bold transition-all ${
                        hasApplied 
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default border-0' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 border-0 keep-white'
                      }`}
                      disabled={hasApplied}
                    >
                      <Send className="w-4 h-4" />
                      {hasApplied ? '✓ Already Applied' : 'Submit 1-Click Application'}
                    </button>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
