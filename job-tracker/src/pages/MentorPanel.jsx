import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  X, 
  PlusCircle, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2,
  Send,
  Sparkles,
  Ban,
  MessageSquare,
  Users,
  Trash2
} from 'lucide-react';

const MentorPanel = () => {
  const { 
    mentorships, updateMentorshipStatus,
    currentUser,
    jobs,
    mentorApps, applyToMentorJob, postMentorshipProgram,
    messages = [], sendMessage, deleteMessage,
    usersDb = []
  } = useContext(AppContext);
  
  const mentorName = currentUser?.name || 'Mentor Demo';

  // Standalone Mentorship Program Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    jobTitle: '',
    company: 'Career Mentorship',
    mentorshipFee: 'PKR 5,000 / month',
    description: ''
  });
  const [programSuccessMsg, setProgramSuccessMsg] = useState('');

  // Apply to Mentor Internship Form State
  const [selectedJob, setSelectedJob] = useState(null);
  const [mentorshipFee, setMentorshipFee] = useState('PKR 5,000 / month');
  const [mentorshipNotes, setMentorshipNotes] = useState('');
  const [mentorAppSuccess, setMentorAppSuccess] = useState(false);
  const [declinedJobs, setDeclinedJobs] = useState({});

  // Message Center State
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgForm, setMsgForm] = useState({ subject: '', body: '', recipients: 'all', selectedEmails: [] });
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (newProgram.jobTitle && newProgram.description) {
      postMentorshipProgram(newProgram);
      setProgramSuccessMsg(`"${newProgram.jobTitle}" submitted successfully! Pending Admin Approval.`);
      setNewProgram({
        jobTitle: '',
        company: 'Career Mentorship',
        mentorshipFee: 'PKR 5,000 / month',
        description: ''
      });
      setShowCreateModal(false);
      setTimeout(() => setProgramSuccessMsg(''), 4000);
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

  const handleDeclineJob = (jobId) => {
    setDeclinedJobs(prev => ({ ...prev, [jobId]: true }));
  };

  const myRequests = mentorships.filter(m => m.mentorName === mentorName);
  const myMentorProposals = mentorApps.filter(m => m.mentorEmail === currentUser?.email || m.mentorName === mentorName);

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden text-white shadow-2xl darkblue-animated-header"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold mb-2 backdrop-blur-md float-icon">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" /> Career Guidance & Mentorship
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white keep-white tracking-tight">
              Mentorship Command Portal ({mentorName})
            </h2>
            <p className="text-emerald-100 text-xs mt-1 font-medium">
              Create custom mentorship offerings or apply to mentor platform positions. All mentorship offerings require Admin Approval before publishing to students.
            </p>
          </div>
        </div>
      </div>

      {programSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> {programSuccessMsg}
        </div>
      )}

      {/* DEDICATED SECTION: CREATE MENTORSHIP PROGRAM FOR ADMIN APPROVAL & TRACK STATUS */}
      <div className="card bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Submit New Mentorship Program for Admin Approval
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Create a custom mentorship offering or career track. Submitted programs are sent to the System Administrator for approval before publishing to students.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-5 shadow-lg shadow-emerald-600/30 flex items-center gap-2 border-0 keep-white shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> + Post Mentorship for Admin Approval
          </button>
        </div>

        {/* LIST OF MY SUBMITTED MENTORSHIP OFFERINGS & APPROVAL STATUSES */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My Submitted Mentorship Offerings & Approval Statuses ({myMentorProposals.length})
          </h4>

          {myMentorProposals.length === 0 ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              You haven't submitted any mentorship programs yet. Click "+ Post Mentorship for Admin Approval" above to create your first offering!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myMentorProposals.map(prop => (
                <div key={prop.id} className="p-4 bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{prop.jobTitle}</h5>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${
                        prop.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                        prop.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/40 animate-pulse'
                      }`}>
                        {prop.status === 'Approved' ? '✓ Approved & Live on Applicant Panel' :
                         prop.status === 'Rejected' ? 'Rejected by Admin' :
                         '⏳ Pending Admin Approval'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Domain / Company: {prop.company}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">Mentorship Fee: {prop.mentorshipFee}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">"{prop.description}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 1: EXPLORE OFFERED INTERNSHIPS & APPLY FOR MENTORSHIP */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" /> Open Platform Positions Available for Mentorship ({jobs.length})
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Admin & Employer Jobs
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mentors can review all jobs posted by Admins and Employers and submit a mentorship application. Once approved by the Employer or Admin, your mentorship program & fee will display on the applicant panel!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-xs py-4 text-center col-span-2">No positions available for mentorship.</p>
          ) : (
            jobs.map(job => {
              const existingProposal = myMentorProposals.find(m => m.jobId === job.id);
              const isDeclined = declinedJobs[job.id];
              const isAdminJob = job.postedBy === 'Admin' || job.company === 'System Admin';

              if (isDeclined) {
                return (
                  <div key={job.id} className="p-4 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/50 rounded-xl flex items-center justify-between opacity-60">
                    <div>
                      <h4 className="font-bold text-xs text-slate-500 line-through">{job.title}</h4>
                      <p className="text-[11px] text-slate-400">Mentorship Option Declined</p>
                    </div>
                    <button 
                      onClick={() => setDeclinedJobs(prev => ({ ...prev, [job.id]: false }))}
                      className="text-xs text-indigo-500 hover:underline font-semibold"
                    >
                      Undo
                    </button>
                  </div>
                );
              }

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
                      {isAdminJob ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                          Admin Listing
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          {job.company}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Entity: {job.company} • Deadline: {job.deadline || 'N/A'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{job.requirements}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {existingProposal ? `Proposal: ${existingProposal.status} (${existingProposal.mentorshipFee})` : 'No mentor assigned'}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeclineJob(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-slate-300 dark:border-slate-800"
                        title="Decline / Pass on Mentoring this Position"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className={`btn py-1.5 px-3 text-xs font-bold shadow-md flex items-center gap-1.5 border-0 ${
                          existingProposal?.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white keep-white'
                        }`}
                        disabled={existingProposal?.status === 'Approved'}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        {existingProposal ? `Status: ${existingProposal.status}` : 'Apply to Mentor Position'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION 2: STUDENT MENTEE APPLICATIONS */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <GraduationCap className="w-5 h-5 text-emerald-500" /> Student Mentee Applications ({myRequests.length})
          </h3>
          {myRequests.filter(r => r.status === 'Pending').length > 0 && (
            <span className="text-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
              {myRequests.filter(r => r.status === 'Pending').length} Awaiting Review
            </span>
          )}
        </div>

        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No student mentee applications yet.</p>
          ) : (
            myRequests.map(req => (
              <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{req.menteeName}</h4>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase border ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : req.status === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                    }`}>
                      {req.status === 'Approved' ? '✓ Approved' : req.status === 'Rejected' ? '✕ Rejected' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Program: <span className="font-semibold text-slate-700 dark:text-slate-300">{req.jobTitle || 'Career Mentorship'}</span></p>
                  {req.menteeEmail && <p className="text-slate-400 dark:text-slate-500">{req.menteeEmail}</p>}
                  {req.mentorshipFee && <p className="text-emerald-600 dark:text-emerald-400 font-bold">Fee: {req.mentorshipFee}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateMentorshipStatus(req.id, 'Approved')}
                    disabled={req.status === 'Approved'}
                    className={`btn py-2 px-4 text-xs font-bold flex items-center gap-1.5 border-0 ${
                      req.status === 'Approved'
                        ? 'bg-emerald-600 text-white keep-white cursor-default'
                        : 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {req.status === 'Approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateMentorshipStatus(req.id, 'Rejected')}
                    disabled={req.status === 'Rejected'}
                    className={`btn py-2 px-3 text-xs font-bold border ${
                      req.status === 'Rejected'
                        ? 'bg-rose-600 text-white keep-white border-rose-600 cursor-default'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border-rose-500/30'
                    }`}
                  >
                    {req.status === 'Rejected' ? 'Rejected' : 'Reject'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MESSAGE CENTER */}
      <div className="card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" /> Message Center
          </h3>
          <button
            onClick={() => setShowMsgModal(true)}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 flex items-center gap-2 border-0 keep-white shadow-md"
          >
            <Send className="w-3.5 h-3.5" /> Compose Message
          </button>
        </div>

        {/* Sent Messages List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Messages ({messages.filter(m => m.senderEmail === currentUser?.email).length})</h4>
          {messages.filter(m => m.senderEmail === currentUser?.email).length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No messages sent yet. Compose your first message above!</p>
          ) : (
            messages.filter(m => m.senderEmail === currentUser?.email).map(msg => (
              <div key={msg.id} className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      msg.recipients === 'all'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}>
                      {msg.recipients === 'all' ? <><Users className="w-3 h-3 inline mr-0.5" /> All Users</> : `${msg.recipientEmails.length} Selected`}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{msg.body}</p>
                <p className="text-[10px] text-slate-400">Sent {new Date(msg.sentAt).toLocaleString()} • Read by {msg.readBy.length} user(s)</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COMPOSE MESSAGE MODAL */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" /> Compose New Message
              </h3>
              <button onClick={() => { setShowMsgModal(false); setMsgForm({ subject: '', body: '', recipients: 'all', selectedEmails: [] }); }} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {msgSentSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Message sent successfully!
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!msgForm.subject.trim() || !msgForm.body.trim()) return;
              sendMessage({
                subject: msgForm.subject,
                body: msgForm.body,
                recipients: msgForm.recipients,
                recipientEmails: msgForm.recipients === 'all' ? [] : msgForm.selectedEmails
              });
              setMsgSentSuccess(true);
              setMsgForm({ subject: '', body: '', recipients: 'all', selectedEmails: [] });
              setTimeout(() => { setMsgSentSuccess(false); setShowMsgModal(false); }, 1500);
            }} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Important Update for All Mentees"
                  value={msgForm.subject}
                  onChange={e => setMsgForm(p => ({ ...p, subject: e.target.value }))}
                  className="input-field w-full text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Recipients *</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMsgForm(p => ({ ...p, recipients: 'all', selectedEmails: [] }))}
                    className={`btn py-2 px-4 text-xs font-bold flex items-center gap-1.5 ${msgForm.recipients === 'all' ? 'bg-emerald-600 text-white keep-white border-0' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Users className="w-3.5 h-3.5" /> All Users
                  </button>
                  <button type="button" onClick={() => setMsgForm(p => ({ ...p, recipients: 'selective' }))}
                    className={`btn py-2 px-4 text-xs font-bold ${msgForm.recipients === 'selective' ? 'bg-emerald-600 text-white keep-white border-0' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    Select Users
                  </button>
                </div>
              </div>

              {msgForm.recipients === 'selective' && (
                <div className="space-y-2">
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Select Recipients</label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {usersDb.filter(u => u.role === 'user').map(u => (
                      <label key={u.email} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-emerald-600"
                          checked={msgForm.selectedEmails.includes(u.email)}
                          onChange={e => setMsgForm(p => ({
                            ...p,
                            selectedEmails: e.target.checked
                              ? [...p.selectedEmails, u.email]
                              : p.selectedEmails.filter(em => em !== u.email)
                          }))}
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{u.name} <span className="text-slate-400">({u.email})</span></span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Message *</label>
                <textarea
                  placeholder="Write your message here..."
                  value={msgForm.body}
                  onChange={e => setMsgForm(p => ({ ...p, body: e.target.value }))}
                  className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[110px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowMsgModal(false)} className="btn secondary py-2.5 px-4 text-xs font-bold">Cancel</button>
                <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 text-xs font-bold shadow-lg keep-white border-0 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

      {/* POST STANDALONE MENTORSHIP PROGRAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-500" /> Post New Mentorship Program
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submitted programs will be sent to the Admin for approval before publishing on the applicant dashboard.
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Mentorship Program Title *</label>
                <input 
                  type="text"
                  value={newProgram.jobTitle}
                  onChange={(e) => setNewProgram({...newProgram, jobTitle: e.target.value})}
                  placeholder="e.g. Full-Stack Engineering & System Design Mentorship"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Domain / Organization Category *</label>
                <input 
                  type="text"
                  value={newProgram.company}
                  onChange={(e) => setNewProgram({...newProgram, company: e.target.value})}
                  placeholder="e.g. Software Engineering, Data Science, AI/ML"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Mentorship Fee / Stipend *</label>
                <input 
                  type="text"
                  value={newProgram.mentorshipFee}
                  onChange={(e) => setNewProgram({...newProgram, mentorshipFee: e.target.value})}
                  placeholder="e.g. PKR 5,000 / month or Free"
                  className="input-field w-full text-xs py-2.5 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800"
                  required
                />
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Program Overview & Curriculum Notes *</label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                  placeholder="Describe your weekly 1-on-1 sessions, project guidance, code reviews, and career coaching..."
                  className="form-textarea text-xs bg-white dark:bg-slate-950/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn secondary py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 text-xs font-bold shadow-lg shadow-emerald-500/25 keep-white border-0 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Submit for Admin Approval
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
