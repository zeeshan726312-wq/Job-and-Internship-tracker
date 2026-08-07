import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Clock, CheckCircle, XCircle, Calendar, FileText, GraduationCap, Video, ExternalLink, Sparkles } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Applied':
    case 'Pending': return <Clock className="w-4 h-4 text-amber-400" />;
    case 'Shortlisted': return <CheckCircle className="w-4 h-4 text-indigo-400" />;
    case 'Interview': return <Video className="w-4 h-4 text-purple-400" />;
    case 'Hired': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'Rejected': return <XCircle className="w-4 h-4 text-rose-400" />;
    default: return <Clock className="w-4 h-4 text-slate-400" />;
  }
};

const UserPanel = () => {
  const context = useContext(AppContext) || {};
  const { 
    jobs = [], 
    applications = [], 
    applyForJob = () => {}, 
    courses = [], 
    requestMentorship = () => {}, 
    mentorships = [],
    currentUser = null 
  } = context;
  
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApplications = Array.isArray(applications) ? applications : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeMentorships = Array.isArray(mentorships) ? mentorships : [];

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

  const applicantName = currentUser?.name || currentUser?.username || 'User';

  const handleApply = (job) => {
    if (!job) return;
    if (job.isExternal && job.externalUrl) {
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
      applyForJob(job.id, applicantName);
    } else {
      applyForJob(job.id, applicantName);
      alert('Application submitted successfully!');
    }
  };

  const myApplications = safeApplications.filter(isUserApp);
  const myMentorships = safeMentorships.filter(m => isUserApp({ applicantName: m?.menteeName }));

  return (
    <div className="panel-container space-y-6 font-sans">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-8 overflow-hidden text-white shadow-2xl darkblue-animated-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md float-icon">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Applicant Portal & Courses
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Applicant Dashboard — {applicantName} 👋
            </h2>
            <p className="text-slate-200 text-xs mt-1 font-medium">
              Explore available platform jobs & internships, enroll in mentorship courses, and track direct applications.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Available Platform Jobs & Internships</h3>
            <div className="list max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {safeJobs.length === 0 ? <p className="text-slate-500 text-sm">No listings available.</p> : null}
              {safeJobs.map(job => (
                <div key={job.id} className="list-item flex-col items-start gap-3 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="item-info w-full flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                        {job.title}
                        <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold border border-indigo-500/20">{job.type || 'Job'}</span>
                        {job.isExternal && (
                          <span className="text-[10px] bg-sky-500/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded font-bold border border-sky-500/30 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> External Link
                          </span>
                        )}
                      </h4>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">{job.company}</p>
                    </div>
                    {job.isExternal ? (
                      <button 
                        className="h-10 w-32 shrink-0 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 border-0 transition-all duration-200 flex items-center justify-center gap-1.5 keep-white cursor-pointer" 
                        onClick={() => handleApply(job)}
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" /> 
                        <span className="truncate">{myApplications.some(app => app.jobId === job.id) ? 'Visit Again ↗' : 'Apply on Site ↗'}</span>
                      </button>
                    ) : (
                      <button 
                        className={`h-10 w-32 shrink-0 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          myApplications.some(app => app.jobId === job.id)
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 opacity-90 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-sky-600/20 border-0 keep-white'
                        }`} 
                        onClick={() => handleApply(job)}
                        disabled={myApplications.some(app => app.jobId === job.id)}
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" /> 
                        <span>{myApplications.some(app => app.jobId === job.id) ? 'Applied' : 'Apply Now'}</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="w-full bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">Deadline:</span> {job.deadline || 'No deadline set'}
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <FileText className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Requirements:</span>
                        <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">{job.requirements || 'No requirements specified.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Mentorship & Courses</h3>
            <div className="list space-y-4">
              {safeCourses.length === 0 ? <p className="text-slate-500 text-sm">No courses available.</p> : null}
              {safeCourses.map(course => {
                const isRequested = myMentorships.some(m => m.courseId === course.id);
                return (
                  <div key={course.id} className="list-item flex-col items-start p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-full flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500">Mentor: <span className="font-bold text-slate-700 dark:text-slate-300">{course.mentorName}</span></p>
                        </div>
                      </div>
                      <button 
                        className={`h-9 px-4 shrink-0 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isRequested 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 border-0 keep-white'
                        }`}
                        onClick={() => requestMentorship(course.id, course.mentorName, applicantName)}
                        disabled={isRequested}
                      >
                        {isRequested ? 'Requested' : 'Enroll & Request Mentorship'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{course.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">My Platform Applications</h3>
            <div className="list max-h-[400px] overflow-y-auto pr-2 space-y-3">
              {myApplications.length === 0 ? <p className="text-slate-500 text-sm">No applications yet.</p> : null}
              {myApplications.map(app => {
                const job = safeJobs.find(j => j && j.id === app.jobId);
                const statusStr = app?.status || 'Pending';
                return (
                  <div key={app.id} className="list-item flex-col items-start gap-2 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-full flex justify-between items-start">
                      <div className="item-info">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job?.title || app.jobTitle || 'Platform Listing'}</h4>
                        <p className="text-xs text-slate-500">{job?.company || app.company || 'Direct Employer'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`status text-xs px-2 py-0.5 rounded font-bold ${statusStr.toLowerCase()}`}>{statusStr}</span>
                          <StatusIcon status={statusStr} />
                        </div>
                      </div>
                    </div>
                    
                    {app.interviewSchedule && (
                      <div className="w-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 rounded-lg p-2 text-xs mt-2">
                        <span className="font-bold">Interview Scheduled:</span> {new Date(app.interviewSchedule).toLocaleString()}
                      </div>
                    )}
                    
                    {app.feedback && (
                      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-xs text-slate-700 dark:text-slate-300 mt-1 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white">Employer Feedback:</span> {app.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
