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
  ArrowRight
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
    <div className="panel-container space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border-primary/20 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Student Applicant Workspace
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h2>
            <p className="text-secondaryText text-sm max-w-xl">
              Track your job and internship applications, submit new details, and monitor interview progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/apply"
              className="btn primary py-2.5 px-5 font-semibold text-sm shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
            >
              <PlusCircle className="w-4 h-4" /> Log Application Form
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Total Applications</h4>
            <Briefcase className="w-5 h-5 text-primary opacity-80" />
          </div>
          <h2>{totalAppsCount}</h2>
          <p className="text-xs text-secondaryText mt-1">Platform + Personal Tracked</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>In Review / Pending</h4>
            <Clock className="w-5 h-5 text-amber-400 opacity-80" />
          </div>
          <h2>{inReviewCount}</h2>
          <p className="text-xs text-secondaryText mt-1">Awaiting responses</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Interviews Scheduled</h4>
            <Video className="w-5 h-5 text-purple-400 opacity-80" />
          </div>
          <h2>{interviewCount}</h2>
          <p className="text-xs text-secondaryText mt-1">Active interview stages</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h4>Shortlisted / Offers</h4>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
          <h2>{hiredCount}</h2>
          <p className="text-xs text-secondaryText mt-1">Successful milestones</p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid-2">
        {/* Left Column: Platform Open Jobs */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Open Opportunities ({jobs.length})
              </h3>
              <Link to="/apply" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                Custom Form <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="list max-h-[380px] overflow-y-auto pr-1 space-y-3">
              {jobs.length === 0 ? (
                <p className="text-secondaryText text-sm py-4 text-center">No platform listings available.</p>
              ) : (
                jobs.map(job => {
                  const hasApplied = myApplications.some(app => app.jobId === job.id);
                  return (
                    <div key={job.id} className="list-item flex-col items-start gap-3 p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-border/50 rounded-xl transition-all">
                      <div className="w-full flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-base flex items-center gap-2 text-white">
                            {job.title}
                            <span className="text-[11px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/30">
                              {job.type}
                            </span>
                          </h4>
                          <p className="text-secondaryText text-xs font-medium mt-0.5">{job.company}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/apply?jobId=${job.id}`)}
                          className={`btn py-1.5 px-3.5 text-xs font-medium ${
                            hasApplied ? 'secondary opacity-70' : 'primary shadow-sm'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          {hasApplied ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>

                      <div className="w-full bg-slate-900/60 rounded-lg p-2.5 border border-border/40 text-xs text-secondaryText flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>Deadline: {job.deadline || 'N/A'}</span>
                        </div>
                        <span className="text-emerald-400 font-medium">{job.status || 'Active'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tracked Applications Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" /> Recent Application Activity
            </h3>
            <Link to="/applications" className="text-xs text-secondary hover:underline flex items-center gap-1 font-medium">
              View All ({totalAppsCount}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="list max-h-[380px] overflow-y-auto pr-1 space-y-3">
            {myApplications.length === 0 && myPersonalApps.length === 0 ? (
              <div className="text-center py-8 text-secondaryText">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-secondaryText" />
                <p className="text-sm font-medium">No applications logged yet.</p>
                <p className="text-xs text-secondaryText mt-1">Use the Application Form to start tracking!</p>
                <button
                  onClick={() => navigate('/apply')}
                  className="btn primary py-1.5 px-4 text-xs mt-3"
                >
                  <PlusCircle className="w-4 h-4" /> Open Application Form
                </button>
              </div>
            ) : (
              <>
                {myApplications.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={`plat-${app.id}`} className="list-item items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-border/40">
                      <div>
                        <h4 className="font-semibold text-sm text-white">{job?.title || 'Platform Position'}</h4>
                        <p className="text-xs text-secondaryText">{job?.company || 'Company Listing'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-primaryText border border-border flex items-center gap-1.5">
                          <StatusIcon status={app.status} /> {app.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {myPersonalApps.map(app => (
                  <div key={`pers-${app.id}`} className="list-item items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-border/40">
                    <div>
                      <h4 className="font-semibold text-sm text-white">{app.title}</h4>
                      <p className="text-xs text-secondaryText">{app.company} • Personal Tracked</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-primaryText border border-border flex items-center gap-1.5">
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
