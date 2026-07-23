import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
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
  Trash2
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
      case 'Applied': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Shortlisted': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'Interview': return <Video className="w-4 h-4 text-purple-400" />;
      case 'Hired': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  return (
    <div className="panel-container space-y-6 relative">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/70 border-amber-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Opportunity Provider Console
          </div>
          <h2 className="text-2xl font-bold text-white">Employer Management Portal</h2>
          <p className="text-sm text-secondaryText">
            Publish job/internship listings, evaluate candidate applications, and schedule interview stages.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Post Opportunity Form */}
        <div className="card space-y-4">
          <h3 className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" /> Post Job or Internship Listing
          </h3>

          {postSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
              Opportunity posted successfully! Candidates can now apply.
            </div>
          )}

          <form onSubmit={handlePostJob} className="space-y-3">
            <div>
              <label className="form-label text-xs">Opportunity Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Developer or UI/UX Intern" 
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label text-xs">Category Type</label>
                <select 
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="form-select text-xs"
                >
                  <option value="Job">Full-time Job</option>
                  <option value="Internship">Internship Program</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Application Deadline *</label>
                <input 
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="input-field w-full text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Requirements & Description *</label>
              <textarea
                placeholder="List required skills, experience level, tools, and responsibilities..."
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                className="form-textarea text-xs min-h-[90px]"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn primary w-full text-xs font-semibold py-2.5 shadow-md shadow-primary/20">
              <PlusCircle className="w-4 h-4" /> Publish Opportunity
            </button>
          </form>
        </div>

        {/* Candidate Applications Review */}
        <div className="card space-y-4">
          <h3 className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Candidate Submissions Review ({relevantApplications.length})
          </h3>

          <div className="list max-h-[480px] overflow-y-auto pr-1 space-y-3">
            {relevantApplications.length === 0 ? (
              <p className="text-secondaryText text-xs py-8 text-center">No student applications submitted yet.</p>
            ) : (
              relevantApplications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="list-item flex-col items-start gap-3 p-4 bg-slate-800/40 rounded-xl border border-border">
                    <div className="w-full flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.applicantName}</h4>
                        <p className="text-xs text-secondaryText">Position: {job?.title || 'Platform Job'}</p>
                      </div>

                      <select 
                        className="form-select text-xs py-1 px-2 font-semibold w-auto"
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      >
                        <option value="Applied" className="bg-slate-900 text-amber-400">Applied</option>
                        <option value="Shortlisted" className="bg-slate-900 text-blue-400">Shortlisted</option>
                        <option value="Interview" className="bg-slate-900 text-purple-400">Interview Stage</option>
                        <option value="Hired" className="bg-slate-900 text-emerald-400">Hired</option>
                        <option value="Rejected" className="bg-slate-900 text-rose-400">Rejected</option>
                      </select>
                    </div>

                    <div className="w-full flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg border border-border/40 text-xs">
                      <div className="text-secondaryText space-y-0.5">
                        {app.interviewSchedule ? (
                          <div className="text-purple-300 font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Interview: {new Date(app.interviewSchedule).toLocaleString()}
                          </div>
                        ) : (
                          <div>No interview date set.</div>
                        )}
                        {app.feedback && <div className="text-slate-300 italic text-[11px]">Feedback: "{app.feedback}"</div>}
                      </div>

                      <button 
                        className="btn secondary py-1 px-2.5 text-xs flex items-center gap-1 shrink-0"
                        onClick={() => openEditor(app)}
                      >
                        <MessageSquare className="w-3 h-3" /> Interview / Feedback
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Published Opportunities List */}
      <div className="card space-y-3">
        <h3 className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" /> Active Employer Listings ({companyJobs.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {companyJobs.map(job => (
            <div key={job.id} className="p-3.5 bg-slate-800/40 rounded-xl border border-border flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white text-sm">{job.title}</p>
                <p className="text-secondaryText">Type: {job.type} • Deadline: {job.deadline || 'N/A'}</p>
              </div>
              <button
                onClick={() => deleteJob(job.id)}
                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                title="Remove listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Interview Date & Feedback */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Schedule Interview & Candidate Feedback
            </h3>
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="form-label text-xs">Interview Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="input-field w-full text-xs"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label text-xs">Candidate Feedback / Notes</label>
                <textarea 
                  className="form-textarea w-full text-xs min-h-[90px]"
                  placeholder="Provide interview invitation details, test links, or evaluation notes..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" className="btn secondary text-xs" onClick={() => setEditingApp(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary text-xs font-semibold">
                  Save Interview Details
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
