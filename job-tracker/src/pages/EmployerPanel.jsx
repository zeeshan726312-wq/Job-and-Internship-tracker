import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  MessageSquare, 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Video, 
  Building2,
  Trash2,
  UserCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

const EmployerPanel = () => {
  const context = useContext(AppContext) || {};
  const { 
    jobs = [], 
    deleteJob = () => {}, 
    applications = [], 
    updateApplicationStatus = () => {}, 
    updateApplicationDetails = () => {}, 
    currentUser = null,
    mentorApps = [],
    approveMentorApp = () => {},
    rejectMentorApp = () => {}
  } = context;
  
  const employerCompany = currentUser?.name || 'Employer Demo';

  const [trainingOffers, setTrainingOffers] = useState({});
  const [offerSuccessMsg, setOfferSuccessMsg] = useState('');

  // State for Interview/Feedback Modal
  const [editingApp, setEditingApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleOfferTraining = (jobId, jobTitle) => {
    setTrainingOffers(prev => ({ ...prev, [jobId]: true }));
    setOfferSuccessMsg(`Training offer registered for "${jobTitle}"! Students and Admins will see ${employerCompany} as a training partner.`);
    setTimeout(() => setOfferSuccessMsg(''), 3000);
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (editingApp) {
      updateApplicationDetails(editingApp, { interviewSchedule: interviewDate, feedback });
      setEditingApp(null);
      setInterviewDate('');
      setFeedback('');
    }
  };

  const openEditor = (app) => {
    if (app && app.id) {
      setEditingApp(app.id);
      setInterviewDate(app.interviewSchedule || '');
      setFeedback(app.feedback || '');
    }
  };

  // Safe Array Calculations
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApps = Array.isArray(applications) ? applications : [];
  const safeMentorApps = Array.isArray(mentorApps) ? mentorApps : [];

  const companyJobs = safeJobs.filter(j => j && (j.company === employerCompany || j.postedBy === employerCompany));
  const relevantApplications = safeApps;
  const companyMentorApps = safeMentorApps.filter(m => m && companyJobs.some(j => j?.id === m.jobId));

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-900 text-white shadow-2xl border border-emerald-500/40"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-emerald-200" /> Employer & Recruiter Console
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Recruiter Command Hub ({employerCompany})
            </h2>
            <p className="text-emerald-100 text-xs mt-1 font-medium">
              Post job/internship listings, view Admin opportunities to offer employer training, and schedule candidate interviews.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Positions</h4>
            <Briefcase className="w-5 h-5 text-amber-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{companyJobs.length}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Open Company Listings</p>
        </div>

        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Applicants</h4>
            <Users className="w-5 h-5 text-indigo-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{relevantApplications.length}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Submissions Received</p>
        </div>

        <div className="stat-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews Set</h4>
            <Video className="w-5 h-5 text-purple-500 opacity-90" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{relevantApplications.filter(a => a?.status === 'Interview').length}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Scheduled Meetings</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Admin Job Posting Policy Info Card */}
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Platform Listing Management
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
              Admin Exclusive Posting
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
            <p className="font-semibold text-slate-900 dark:text-white">
              Official Job Posting Policy:
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All official jobs and internship opportunities are verified and published exclusively by System Administrators to ensure compliance and quality for all candidate applicants.
            </p>
            <div className="pt-2 text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Employers can review active listings below, manage incoming candidate applications, and schedule candidate interviews.</span>
            </div>
          </div>
        </div>

        {/* Existing Company Posted Jobs List */}
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Briefcase className="w-5 h-5 text-emerald-500" /> Published Company Listings ({companyJobs.length})
          </h3>

          <div className="list max-h-[360px] overflow-y-auto space-y-3 pr-1">
            {companyJobs.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs py-8 text-center">No active listings created by {employerCompany} yet.</p>
            ) : (
              companyJobs.map(job => (
                <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        {job.type}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Deadline: {job.deadline || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                    title="Remove Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ALL PLATFORM & ADMIN OPPORTUNITIES SECTION */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Sparkles className="w-5 h-5 text-indigo-500" /> All Platform & Admin Opportunities ({safeJobs.length})
          </h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
            Offer Employer Training
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Employers can review all jobs posted by Admin and offer employer training, teach applicant cohorts, or apply to partner for candidates.
        </p>

        {offerSuccessMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {offerSuccessMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeJobs.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center col-span-2">No platform listings found.</p>
          ) : (
            safeJobs.map(job => {
              const isOffered = trainingOffers[job.id];
              const isAdminJob = job.postedBy === 'Admin' || job.company === 'System Admin';
              return (
                <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {job.title}
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {job.type}
                        </span>
                      </h4>
                      {isAdminJob ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Admin Created
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          {job.company}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Deadline: {job.deadline || 'N/A'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{job.requirements}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isOffered ? '✓ Training Partner Attached' : 'Open for Teaching & Hiring'}
                    </span>
                    <button
                      onClick={() => handleOfferTraining(job.id, job.title)}
                      className={`btn py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 ${
                        isOffered
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md keep-white border-0'
                      }`}
                      disabled={isOffered}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {isOffered ? 'Training Offered' : 'Offer Training / Teach'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Candidate Applicants Table */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Users className="w-5 h-5 text-emerald-500" /> Candidate Submissions & Review Queue ({relevantApplications.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Applied Position</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Schedule / Feedback</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {relevantApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">No applicant submissions recorded yet.</td>
                </tr>
              ) : (
                relevantApplications.map(app => {
                  const job = safeJobs.find(j => j?.id === app?.jobId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        {app.applicantName}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{job?.title || 'Platform Position'}</td>
                      <td className="p-3">
                        <select
                          value={app.status || 'Applied'}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-slate-900 dark:text-white py-1 px-2.5 rounded-lg cursor-pointer outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {app.interviewSchedule ? `🗓️ ${app.interviewSchedule}` : 'No date set'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => openEditor(app)}
                          className="btn secondary py-1.5 px-3 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Update Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MENTOR APPLICATIONS FOR COMPANY POSITIONS */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <GraduationCap className="w-5 h-5 text-emerald-500" /> Mentor Applications for Positions ({companyMentorApps.length})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review mentors who applied to mentor applicants for your company's internship & job listings. Once accepted, their mentorship program will become visible to applicants!
        </p>

        <div className="space-y-3">
          {companyMentorApps.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center">No mentor applications received yet for your company listings.</p>
          ) : (
            companyMentorApps.map(m => (
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
                    Mentorship Target Position: <span className="font-bold text-slate-900 dark:text-white">{m.jobTitle}</span>
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
                      onClick={() => approveMentorApp(m.id)}
                      className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold shadow-md keep-white border-0"
                    >
                      Accept Mentorship
                    </button>
                  )}
                  {m.status !== 'Rejected' && (
                    <button
                      onClick={() => rejectMentorApp(m.id)}
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

      {/* Modal for Interview & Feedback */}
      {editingApp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" /> Update Candidate Schedule & Feedback
            </h3>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="input-field w-full text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Recruiter Feedback / Notes</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Notes for applicant..."
                  className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[90px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="btn secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 text-xs font-bold keep-white border-0"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerPanel;
