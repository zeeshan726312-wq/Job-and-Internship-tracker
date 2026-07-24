import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import dashboardBg from '../../../Untitled design.png';
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
  const { jobs, applications, personalApps, currentUser } = useContext(AppContext);
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

  const applicantName = currentUser?.name || 'user';

  const myApplications = applications.filter(app => app.applicantName === applicantName);
  const myPersonalApps = personalApps.filter(app => app.applicantName === applicantName);

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
      {/* Welcome Banner with Photo Background */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-cover bg-center border border-indigo-500/30 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75)), url(${dashboardBg})` }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Student Applicant Workspace
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name || 'Applicant'}! 👋
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Track your active job & internship submissions, monitor recruiter interviews, and accelerate your career journey.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/apply"
              className="btn primary py-3 px-5 font-bold text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Log Application Form
            </Link>
            <Link
              to="/applications"
              className="btn secondary py-3 px-4 font-semibold text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-400" /> Pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Total Tracked</h4>
            <Briefcase className="w-5 h-5 text-indigo-400 opacity-80" />
          </div>
          <h2>{totalAppsCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Platform + Personal</span>
            <span className="text-indigo-400 font-semibold">{totalAppsCount} total</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>In Review</h4>
            <Clock className="w-5 h-5 text-amber-400 opacity-80" />
          </div>
          <h2>{inReviewCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Awaiting Review</span>
            <span className="text-amber-400 font-semibold">{inReviewCount} active</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalAppsCount > 0 ? (inReviewCount/totalAppsCount)*100 : 0}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Interviews</h4>
            <Video className="w-5 h-5 text-purple-400 opacity-80" />
          </div>
          <h2>{interviewCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Scheduled Meetings</span>
            <span className="text-purple-400 font-semibold">{interviewCount} live</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${totalAppsCount > 0 ? (interviewCount/totalAppsCount)*100 : 0}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Offers & Shortlists</h4>
            <Award className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
          <h2>{hiredCount}</h2>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Success Rate</span>
            <span className="text-emerald-400 font-semibold">{successRate}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${successRate}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid-2">
        {/* Left Column: Open Platform Opportunities */}
        <div className="card flex flex-col justify-between border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2 text-white">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Platform Listings ({jobs.length})
              </h3>
              <Link to="/apply" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                Custom Form <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="list max-h-[420px] overflow-y-auto pr-1 space-y-3">
              {jobs.length === 0 ? (
                <p className="text-slate-400 text-sm py-6 text-center">No platform listings available.</p>
              ) : (
                jobs.map(job => {
                  const hasApplied = myApplications.some(app => app.jobId === job.id);
                  return (
                    <div 
                      key={job.id} 
                      className="p-4 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            {job.title}
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
                              {job.type}
                            </span>
                          </h4>
                          <p className="text-slate-400 text-xs font-medium mt-0.5">{job.company}</p>
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

                      <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Deadline: {job.deadline || 'N/A'}</span>
                        </div>
                        <span className="text-emerald-400 font-semibold text-[11px]">{job.status || 'Active'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tracked Activity Feed */}
        <div className="card border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-purple-400" /> Application Pipeline
            </h3>
            <Link to="/applications" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
              View Tracker ({totalAppsCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="list max-h-[420px] overflow-y-auto pr-1 space-y-3">
            {myApplications.length === 0 && myPersonalApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <FileText className="w-10 h-10 mx-auto opacity-30 text-indigo-400" />
                <div>
                  <p className="text-sm font-bold text-white">No applications tracked yet</p>
                  <p className="text-xs text-slate-400 mt-1">Start by filling out your first job application form!</p>
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
                    <div key={`plat-${app.id}`} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-white">{job?.title || 'Platform Position'}</h4>
                        <p className="text-xs text-slate-400 font-medium">{job?.company || 'Company Listing'}</p>
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
                  <div key={`pers-${app.id}`} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white">{app.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{app.company} • External</p>
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
    </div>
  );
};

export default DashboardOverview;
