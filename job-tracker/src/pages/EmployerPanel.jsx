import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import dashboardBg from '../../../Untitled design.png';
import { 
  PlusCircle, 
  MessageSquare, 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Video, 
  XCircle, 
  Building2,
  Trash2,
  Sparkles,
  Send,
  UserCheck
} from 'lucide-react';

const EmployerPanel = () => {
  const { jobs, addJob, deleteJob, applications, updateApplicationStatus, updateApplicationDetails, currentUser } = useContext(AppContext);
  
  const employerCompany = currentUser?.name || 'TechCorp';

  const [newJob, setNewJob] = useState({ 
    title: '', 
    company: employerCompany, 
    type: 'Job', 
    status: 'Open',
    deadline: '',
    requirements: ''
  });

  const [postSuccess, setPostSuccess] = useState(false);

  // State for Interview/Feedback Modal
  const [editingApp, setEditingApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [feedback, setFeedback] = useState('');

  const handlePostJob = (e) => {
    e.preventDefault();
    if (newJob.title && newJob.deadline && newJob.requirements) {
      addJob({
        ...newJob,
        company: newJob.company || employerCompany
      });
      setNewJob({ 
        title: '', 
        company: employerCompany, 
        type: 'Job', 
        status: 'Open', 
        deadline: '', 
        requirements: '' 
      });
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    updateApplicationDetails(editingApp, { interviewSchedule: interviewDate, feedback });
    setEditingApp(null);
    setInterviewDate('');
    setFeedback('');
  };

  const openEditor = (app) => {
    setEditingApp(app.id);
    setInterviewDate(app.interviewSchedule || '');
    setFeedback(app.feedback || '');
  };

  // Find all jobs posted or all platform jobs for demo
  const companyJobs = jobs.filter(j => j.company === employerCompany || jobs.length <= 3);
  const companyJobIds = companyJobs.map(j => j.id);
  const relevantApplications = applications.filter(app => companyJobIds.includes(app.jobId) || applications.length <= 5);

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Applied': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'Shortlisted': return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Interview': return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'Hired': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner with Photo Background */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-cover bg-center border border-amber-500/30 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75)), url(${dashboardBg})` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" /> Employer & Recruiter Console
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Recruiter Command Hub ({employerCompany})
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Post new job/internship listings, review candidate submissions, and schedule interviews.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h4>Active Positions</h4>
            <Briefcase className="w-5 h-5 text-amber-400 opacity-80" />
          </div>
          <h2>{companyJobs.length}</h2>
          <p className="text-xs text-slate-400 mt-1">Open Listings</p>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h4>Total Applicants</h4>
            <Users className="w-5 h-5 text-indigo-400 opacity-80" />
          </div>
          <h2>{relevantApplications.length}</h2>
          <p className="text-xs text-slate-400 mt-1">Submissions Received</p>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center">
            <h4>Interviews Set</h4>
            <Video className="w-5 h-5 text-purple-400 opacity-80" />
          </div>
          <h2>{relevantApplications.filter(a => a.status === 'Interview').length}</h2>
          <p className="text-xs text-slate-400 mt-1">Scheduled Meetings</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Post Job Form Card */}
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-white font-bold">
            <PlusCircle className="w-5 h-5 text-amber-400" /> Post Opportunity Listing
          </h3>

          {postSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Position published successfully!
            </div>
          )}

          <form onSubmit={handlePostJob} className="space-y-4">
            <div>
              <label className="form-label text-xs">Job Title *</label>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="e.g. Senior React Developer"
                className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Category</label>
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="form-select text-xs py-2 bg-slate-950/80 border-slate-800 text-white"
                >
                  <option value="Job">Full-time Job</option>
                  <option value="Internship">Internship Program</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Deadline *</label>
                <input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="input-field w-full text-xs bg-slate-950/80 border-slate-800 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Requirements & Description *</label>
              <textarea
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                placeholder="Key skills, qualifications, and responsibilities..."
                className="form-textarea text-xs bg-slate-950/80 border-slate-800 text-white min-h-[90px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn primary py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/20"
            >
              Publish Opportunity Listing
            </button>
          </form>
        </div>

        {/* Existing Posted Jobs List */}
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-white font-bold">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Published Opportunities ({companyJobs.length})
          </h3>

          <div className="list max-h-[360px] overflow-y-auto space-y-3 pr-1">
            {companyJobs.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">No active listings created yet.</p>
            ) : (
              companyJobs.map(job => (
                <div key={job.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                        {job.type}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Deadline: {job.deadline || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
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

      {/* Candidate Applicants Table */}
      <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-white font-bold">
          <Users className="w-5 h-5 text-purple-400" /> Candidate Submissions & Review Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Applied Position</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Schedule / Feedback</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {relevantApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No applicant submissions recorded yet.</td>
                </tr>
              ) : (
                relevantApplications.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400" />
                        {app.applicantName}
                      </td>
                      <td className="p-3 text-slate-300 font-medium">{job?.title || 'Platform Position'}</td>
                      <td className="p-3">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-white py-1 px-2.5 rounded-lg cursor-pointer outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {app.interviewSchedule ? `🗓️ ${app.interviewSchedule}` : 'No date set'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => openEditor(app)}
                          className="btn secondary py-1.5 px-3 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Update Details
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

      {/* Modal for Interview & Feedback */}
      {editingApp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Update Candidate Schedule & Feedback
            </h3>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="form-label text-xs">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="input-field w-full text-xs bg-slate-950/80 border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs">Recruiter Feedback / Notes</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Notes for applicant..."
                  className="form-textarea text-xs bg-slate-950/80 border-slate-800 text-white min-h-[90px]"
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
                  className="btn primary py-2 px-4 text-xs font-bold"
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
