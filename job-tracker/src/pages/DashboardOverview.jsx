import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Video, 
  XCircle, 
  PlusCircle, 
  FileText, 
  Calendar, 
  Send, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const DashboardOverview = () => {
  const { jobs = [], applications = [], personalApps = [], currentUser, mentorApps = [], requestMentorshipProgram, mentorships = [] } = useContext(AppContext);
  const navigate = useNavigate();

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

  const isUserApp = (app) => {
    if (!app || !currentUser) return false;
    const cName = (currentUser.name || '').toLowerCase().trim();
    const cUsername = (currentUser.username || '').toLowerCase().trim();
    const cEmail = (currentUser.email || '').toLowerCase().trim();
    
    const appName = (app.applicantName || '').toLowerCase().trim();
    const appEmail = (app.applicantEmail || '').toLowerCase().trim();

    if (appEmail && cEmail && appEmail === cEmail) return true;
    if (appName && (appName === cName || appName === cUsername || appName === cEmail)) return true;
    if (currentUser.role === 'user' && (appName === 'user demo' || appName === 'user')) return true;
    return false;
  };

  const applicantName = currentUser?.name || currentUser?.username || 'user';

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

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-900 text-white shadow-2xl border border-emerald-500/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> Student Applicant Workspace
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Hi, {currentUser?.name || 'User'}
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl leading-relaxed font-medium">
              Track your active job & internship submissions, monitor recruiter interviews, and accelerate your career journey.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/apply"
              className="btn bg-white text-emerald-800 hover:bg-slate-100 py-3 px-5 font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 border-0"
            >
              <PlusCircle className="w-4 h-4 text-emerald-800" /> Log Application Form
            </Link>
            <Link
              to="/applications"
              className="btn bg-emerald-950/40 hover:bg-emerald-950/60 text-white border border-white/30 py-3 px-4 font-semibold text-sm flex items-center gap-2 backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-emerald-200" /> Pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid - High Contrast for Light & Dark Mode */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tracked */}
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tracked</h4>
            <Briefcase className="w-5 h-5 text-indigo-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalAppsCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Platform + Personal</span>
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
                <Briefcase className="w-5 h-5 text-indigo-500" /> Platform Listings ({jobs.length})
              </h3>
              <Link to="/apply" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                Custom Form <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="list max-h-[420px] overflow-y-auto pr-1 space-y-3">
              {jobs.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm py-6 text-center">No platform listings available.</p>
              ) : (
                jobs.map(job => {
                  const hasApplied = myApplications.some(app => app.jobId === job.id);
                  return (
                    <div 
                      key={job.id} 
                      className="p-4 bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {job.title}
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
                              {job.type}
                            </span>
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">{job.company}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/apply?jobId=${job.id}`)}
                          className={`btn py-1.5 px-3.5 text-xs font-semibold ${
                            hasApplied ? 'secondary opacity-70 cursor-default' : 'primary shadow-md'
                          }`}
                          disabled={hasApplied}
                        >
                          <Send className="w-3.5 h-3.5" />
                          {hasApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Deadline: {job.deadline || 'N/A'}</span>
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
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto opacity-30 text-indigo-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No applications tracked yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Start by filling out your first job application form!</p>
                </div>
                <button
                  onClick={() => navigate('/apply')}
                  className="btn primary py-2 px-4 text-xs font-bold shadow-lg shadow-indigo-500/20"
                >
                  <PlusCircle className="w-4 h-4" /> Open Application Form
                </button>
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
              const hasEnrolled = mentorships?.some(req => req.mentorAppId === m.id && req.menteeName === currentUser?.name);
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

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Status: {hasEnrolled ? 'Enrolled / Mentee' : 'Open'}</span>
                    <button
                      onClick={() => requestMentorshipProgram(m.id, m.mentorName, m.jobTitle, m.mentorshipFee)}
                      className={`btn py-1.5 px-3.5 text-xs font-bold ${
                        hasEnrolled 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md keep-white border-0'
                      }`}
                      disabled={hasEnrolled}
                    >
                      {hasEnrolled ? '✓ Mentorship Requested' : 'Apply for Mentorship'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
