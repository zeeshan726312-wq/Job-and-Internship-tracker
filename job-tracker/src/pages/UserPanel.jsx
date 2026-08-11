import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileText, 
  GraduationCap, 
  Video, 
  ExternalLink, 
  Sparkles,
  Briefcase,
  Upload,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  X,
  FileCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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

const UserPanel = ({ defaultTab = 'all' }) => {
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
  
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Modal State for Applying with Link & CV Upload
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLink, setApplicantLink] = useState('');
  const [cvFile, setCvFile] = useState(null); // { name, data, size }
  const [coverNote, setCoverNote] = useState('');
  
  const [applyError, setApplyError] = useState('');
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

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

  const currentApplicantName = currentUser?.name || currentUser?.username || 'User';

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setApplicantName(currentUser?.name || currentUser?.username || '');
    setApplicantEmail(currentUser?.email || '');
    setApplicantPhone(currentUser?.mobile || '');
    setApplicantLink('');
    setCvFile(null);
    setCoverNote('');
    setApplyError('');
    setShowApplyModal(true);
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setApplyError('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
      }
      setApplyError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvFile({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          data: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplyError('');

    if (!selectedJob) return;

    if (selectedJob.isExternal && selectedJob.externalUrl) {
      window.open(selectedJob.externalUrl, '_blank', 'noopener,noreferrer');
    }

    if (!applicantLink.trim()) {
      setApplyError('Please provide a Portfolio or LinkedIn link.');
      return;
    }

    if (!cvFile) {
      setApplyError('Please upload your CV / Resume file.');
      return;
    }

    applyForJob(selectedJob.id, applicantName.trim() || currentApplicantName, {
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      applicantLink: applicantLink.trim(),
      resumeFileName: cvFile.name,
      resumeFileData: cvFile.data,
      coverNote: coverNote.trim()
    });

    setApplySuccessMsg(`Application for "${selectedJob.title}" submitted successfully with your CV and portfolio link!`);
    setShowApplyModal(false);
    setTimeout(() => setApplySuccessMsg(''), 4500);
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
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Applicant Portal & Career Suite
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight flex items-center gap-2">
              Applicant Dashboard — <span className="text-emerald-200">{currentApplicantName}</span>
            </h2>
            <p className="text-slate-200 text-xs mt-1 font-medium">
              Explore available platform jobs & internships, submit custom applications with CV upload & portfolio links, and request mentorships.
            </p>
          </div>
        </div>
      </div>

      {applySuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {applySuccessMsg}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> All Options
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Jobs Available ({safeJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('mentorship')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mentorship'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Apply for Mentorship ({safeCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> My Applications & Status ({myApplications.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Jobs & Mentorships */}
        <div className={`lg:col-span-7 space-y-6 ${activeTab === 'applications' ? 'hidden lg:block' : ''}`}>
          
          {/* Section 1: Available Jobs */}
          {(activeTab === 'all' || activeTab === 'jobs') && (
            <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" /> Jobs Available ({safeJobs.length})
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Apply with Link & CV</span>
              </div>

              <div className="list max-h-[500px] overflow-y-auto pr-1 space-y-4">
                {safeJobs.length === 0 ? <p className="text-slate-500 text-sm">No job listings available.</p> : null}
                {safeJobs.map(job => {
                  const isApplied = myApplications.some(app => app.jobId === job.id);
                  const isAdminJob = job.postedBy === 'Admin' || job.company === 'System Admin';

                  return (
                    <div key={job.id} className="list-item flex-col items-start gap-3 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="item-info w-full flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                            {job.title}
                            <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold border border-indigo-500/20">{job.type || 'Job'}</span>
                            {isAdminJob && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                                Official Admin Listing
                              </span>
                            )}
                            {job.isExternal && (
                              <span className="text-[10px] bg-sky-500/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded font-bold border border-sky-500/30 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> External Link
                              </span>
                            )}
                          </h4>
                          <p className="text-slate-500 text-xs font-medium mt-0.5">{job.company}</p>
                        </div>

                        <button 
                          className={`h-10 px-4 shrink-0 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 opacity-90 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 border-0 keep-white'
                          }`} 
                          onClick={() => openApplyModal(job)}
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" /> 
                          <span>{isApplied ? 'Update Application / Applied' : 'Apply Now'}</span>
                        </button>
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
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Mentorship Courses */}
          {(activeTab === 'all' || activeTab === 'mentorship') && (
            <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-500" /> Apply for Mentorship & Courses ({safeCourses.length})
                </h3>
              </div>

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
                          onClick={() => requestMentorship(course.id, course.mentorName, currentApplicantName)}
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
          )}
        </div>

        {/* RIGHT COLUMN: My Platform Applications & Status */}
        <div className={`lg:col-span-5 ${activeTab === 'jobs' || activeTab === 'mentorship' ? 'hidden lg:block' : ''}`}>
          <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> My Applications & Status ({myApplications.length})
              </h3>
            </div>

            <div className="list max-h-[600px] overflow-y-auto pr-1 space-y-3.5">
              {myApplications.length === 0 ? <p className="text-slate-500 text-sm py-4 text-center">No platform applications yet.</p> : null}
              {myApplications.map(app => {
                const job = safeJobs.find(j => j && j.id === app.jobId);
                const statusStr = app?.status || 'Pending';

                return (
                  <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="w-full flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job?.title || app.jobTitle || 'Platform Listing'}</h4>
                        <p className="text-xs text-slate-500">{job?.company || app.company || 'Direct Employer'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`status text-xs px-2.5 py-0.5 rounded font-bold ${statusStr.toLowerCase()}`}>{statusStr}</span>
                        <StatusIcon status={statusStr} />
                      </div>
                    </div>

                    {/* Link & CV Attachment Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                      {app.applicantLink && (
                        <a 
                          href={app.applicantLink.startsWith('http') ? app.applicantLink : `https://${app.applicantLink}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold hover:underline"
                        >
                          <LinkIcon className="w-3.5 h-3.5" /> Portfolio Link ↗
                        </a>
                      )}

                      {app.resumeFileName && (
                        <a 
                          href={app.resumeFileData || '#'} 
                          download={app.resumeFileName}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold hover:underline"
                          title="Download submitted CV"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> CV: {app.resumeFileName}
                        </a>
                      )}
                    </div>
                    
                    {app.interviewSchedule && (
                      <div className="w-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 rounded-lg p-2.5 text-xs">
                        <span className="font-bold">Interview Scheduled:</span> {new Date(app.interviewSchedule).toLocaleString()}
                      </div>
                    )}
                    
                    {app.feedback && (
                      <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
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

      {/* JOB APPLICATION MODAL (DETAILS, LINK & CV UPLOAD) */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Job Application</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" /> {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedJob.company} • {selectedJob.type || 'Job'}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {applyError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              {/* Applicant Name */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Applicant Full Name *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Your Full Name"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Applicant Gmail */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Gmail Address *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Applicant Phone */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Contact / Phone Number *</label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Portfolio / Professional Profile Link */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">
                  Portfolio / LinkedIn Link *
                </label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={applicantLink}
                    onChange={(e) => setApplicantLink(e.target.value)}
                    placeholder="https://linkedin.com/in/username or portfolio link"
                    className="input-field w-full !pl-10 text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Choose File Option for CV / Resume */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Upload CV / Resume (PDF, DOCX, Image) *
                </label>
                
                {cvFile ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{cvFile.name}</p>
                        <p className="text-[10px] text-slate-500">{cvFile.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-slate-50 dark:bg-slate-950/60">
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleCvChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      required
                    />
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Click or drag file to choose CV
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, PNG, JPG (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Cover Note (Optional) */}
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Brief Cover Note / Pitch (Optional)</label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself or highlight key skills..."
                  rows={2}
                  className="input-field w-full text-xs p-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn secondary flex-1 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/25 keep-white border-0"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
