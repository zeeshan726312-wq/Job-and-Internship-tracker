import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Check, 
  X, 
  BookOpen, 
  PlusCircle, 
  GraduationCap, 
  FileText, 
  Award, 
  MessageCircle,
  Video,
  Clock,
  Sparkles,
  UserCheck,
  Briefcase,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

const MentorPanel = () => {
  const { 
    mentorships, updateMentorshipStatus, 
    courses, addCourse, currentUser,
    applications, personalApps, jobs,
    mentorApps, applyToMentorJob
  } = useContext(AppContext);
  
  const mentorName = currentUser?.name || 'Mentor Demo';

  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [coursePostedSuccess, setCoursePostedSuccess] = useState(false);

  // Apply to Mentor Internship Form State
  const [selectedJob, setSelectedJob] = useState(null);
  const [mentorshipFee, setMentorshipFee] = useState('PKR 5,000 / month');
  const [mentorshipNotes, setMentorshipNotes] = useState('');
  const [mentorAppSuccess, setMentorAppSuccess] = useState(false);

  const handlePostCourse = (e) => {
    e.preventDefault();
    if (newCourse.title && newCourse.description) {
      addCourse(newCourse);
      setNewCourse({ title: '', description: '' });
      setCoursePostedSuccess(true);
      setTimeout(() => setCoursePostedSuccess(false), 2000);
    }
  };

  const handleApplyToMentor = (e) => {
    e.preventDefault();
    if (selectedJob && mentorshipFee) {
      applyToMentorJob(
        selectedJob.id,
        selectedJob.title,
        selectedJob.company,
        mentorshipFee,
        mentorshipNotes || 'Mentorship program for student applicants.'
      );
      setMentorAppSuccess(true);
      setTimeout(() => {
        setMentorAppSuccess(false);
        setSelectedJob(null);
        setMentorshipNotes('');
      }, 1500);
    }
  };

  const myCourses = courses.filter(c => c.mentorName === mentorName);
  const myRequests = mentorships.filter(m => m.mentorName === mentorName);
  const myMentorProposals = mentorApps.filter(m => m.mentorEmail === currentUser?.email || m.mentorName === mentorName);

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-900 text-white shadow-2xl border border-emerald-500/40"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-200" /> Career Guidance & Mentorship
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Mentorship Command Portal ({mentorName})
            </h2>
            <p className="text-emerald-100 text-xs mt-1 font-medium">
              Explore open internships, apply to mentor specific positions, set mentorship fees, and guide student mentees.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: EXPLORE OFFERED INTERNSHIPS & APPLY FOR MENTORSHIP */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-500" /> Open Positions & Internships Available for Mentorship ({jobs.length})
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mentors can view open internships offered by employers and submit a mentorship application. Once approved by the Employer or Admin, your mentorship program & fee will display on the applicant panel!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => {
            const existingProposal = myMentorProposals.find(m => m.jobId === job.id);
            return (
              <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                        {job.type}
                      </span>
                    </h4>
                    {existingProposal && (
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                        existingProposal.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                        existingProposal.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {existingProposal.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{job.company} • Deadline: {job.deadline || 'N/A'}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{job.requirements}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {existingProposal ? `Fee: ${existingProposal.mentorshipFee}` : 'No mentor assigned'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold shadow-md keep-white border-0 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Apply to Mentor Position
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: MENTORSHIP COURSES & MENTEE REQUESTS */}
      <div className="grid-2">
        {/* Course Creation */}
        <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <BookOpen className="w-5 h-5 text-emerald-500" /> Create Mentorship Course / Program
          </h3>

          {coursePostedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              Mentorship program published successfully!
            </div>
          )}

          <form onSubmit={handlePostCourse} className="space-y-4">
            <div>
              <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Program Title *</label>
              <input 
                type="text" 
                placeholder="e.g. React & UI/UX Career Accelerator" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="input-field w-full text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Curriculum & Goals *</label>
              <textarea
                placeholder="Describe mentorship curriculum, resume reviews, mock interviews..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[90px]"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full text-xs font-bold py-2.5 shadow-lg shadow-emerald-500/20 keep-white border-0">
              <PlusCircle className="w-4 h-4" /> Publish Mentorship Program
            </button>
          </form>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
            Active Offered Programs ({myCourses.length})
          </h3>
          <div className="list space-y-2">
            {myCourses.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" /> {c.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Requests & Monitoring */}
        <div className="space-y-6 flex flex-col">
          <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-emerald-500" /> Student Mentee Applications ({myRequests.length})
            </h3>
            <div className="list max-h-[300px] overflow-y-auto pr-1 space-y-2">
              {myRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No pending student mentee requests.</p>
              ) : (
                myRequests.map(req => (
                  <div key={req.id} className="p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{req.menteeName}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Program: {req.jobTitle || 'Career Mentorship'}</p>
                      {req.mentorshipFee && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Fee: {req.mentorshipFee}</p>}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 uppercase">
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY TO MENTOR INTERNSHIP MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-500" /> Apply to Mentor Position
              </h3>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mentorAppSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Mentorship application submitted to Employer & Admin for approval!
              </div>
            )}

            <form onSubmit={handleApplyToMentor} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Target Position & Company</label>
                <input 
                  type="text"
                  value={`${selectedJob.title} (${selectedJob.company})`}
                  disabled
                  className="input-field w-full text-xs py-2.5 bg-slate-100 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-800 cursor-not-allowed opacity-80"
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Mentorship Fee *</label>
                <input 
                  type="text"
                  value={mentorshipFee}
                  onChange={(e) => setMentorshipFee(e.target.value)}
                  placeholder="e.g. PKR 5,000 / month or Free"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Mentorship Plan & Notes *</label>
                <textarea
                  value={mentorshipNotes}
                  onChange={(e) => setMentorshipNotes(e.target.value)}
                  placeholder="Describe your mentorship plan, code reviews, and interview prep for student applicants..."
                  className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[90px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="btn secondary py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 text-xs font-bold shadow-lg shadow-emerald-500/25 keep-white border-0 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorPanel;
