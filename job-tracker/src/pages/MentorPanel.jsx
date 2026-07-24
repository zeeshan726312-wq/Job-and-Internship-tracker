import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import dashboardBg from '../../../Untitled design.png';
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
  UserCheck
} from 'lucide-react';

const MentorPanel = () => {
  const { 
    mentorships, updateMentorshipStatus, 
    courses, addCourse, currentUser,
    applications, personalApps, jobs
  } = useContext(AppContext);
  
  const mentorName = currentUser?.name || 'Mentor Demo';

  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [coursePostedSuccess, setCoursePostedSuccess] = useState(false);

  const handlePostCourse = (e) => {
    e.preventDefault();
    if (newCourse.title && newCourse.description) {
      addCourse({
        ...newCourse,
        mentorName
      });
      setNewCourse({ title: '', description: '' });
      setCoursePostedSuccess(true);
      setTimeout(() => setCoursePostedSuccess(false), 3000);
    }
  };

  const myRequests = mentorships.filter(m => m.mentorName === mentorName || mentorships.length <= 3);
  const myCourses = courses.filter(c => c.mentorName === mentorName || courses.length <= 2);
  
  // Mentees list
  const acceptedMentees = [...new Set(myRequests.filter(m => m.status === 'Accepted').map(m => m.menteeName))];
  const allStudents = acceptedMentees.length > 0 ? acceptedMentees : ['User Demo'];

  return (
    <div className="panel-container space-y-8 font-sans">
      {/* Header Banner with Photo Background */}
      <div 
        className="relative rounded-2xl p-8 overflow-hidden bg-cover bg-center border border-purple-500/30 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75)), url(${dashboardBg})` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Career Guidance & Mentorship
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Mentorship Command Portal ({mentorName})
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Provide student mentorship programs, guide career applications, and track mentee progress.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Course Creation */}
        <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="flex items-center gap-2 text-white font-bold">
            <BookOpen className="w-5 h-5 text-purple-400" /> Offer Mentorship Program / Course
          </h3>

          {coursePostedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
              Mentorship program published successfully!
            </div>
          )}

          <form onSubmit={handlePostCourse} className="space-y-4">
            <div>
              <label className="form-label text-xs">Program Title *</label>
              <input 
                type="text" 
                placeholder="e.g. React & UI/UX Career Accelerator" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="input-field w-full text-xs bg-slate-950/80 border-slate-800"
                required
              />
            </div>

            <div>
              <label className="form-label text-xs">Curriculum & Goals *</label>
              <textarea
                placeholder="Describe mentorship curriculum, resume reviews, mock interviews..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="form-textarea text-xs bg-slate-950/80 border-slate-800 text-white min-h-[90px]"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn primary w-full text-xs font-bold py-2.5 shadow-lg shadow-indigo-500/20">
              <PlusCircle className="w-4 h-4" /> Publish Mentorship Program
            </button>
          </form>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-800">
            Active Offered Programs ({myCourses.length})
          </h3>
          <div className="list space-y-2">
            {myCourses.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" /> {c.title}
                </h4>
                <p className="text-slate-400 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Requests & Monitoring */}
        <div className="space-y-6 flex flex-col">
          <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-white font-bold">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Mentorship Applications ({myRequests.length})
            </h3>
            <div className="list max-h-[220px] overflow-y-auto pr-1 space-y-2">
              {myRequests.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No pending student requests.</p>
              ) : (
                myRequests.map(req => {
                  const requestedCourse = courses.find(c => c.id === req.courseId);
                  return (
                    <div key={req.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-white flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {req.menteeName}
                        </h4>
                        <p className="text-slate-400 text-[11px]">Program: {requestedCourse?.title || 'General Mentorship'}</p>
                      </div>

                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => updateMentorshipStatus(req.id, 'Accepted')}
                            className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/20"
                            title="Accept Student"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateMentorshipStatus(req.id, 'Declined')}
                            className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg border border-rose-500/20"
                            title="Decline Student"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                          req.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Student Progress Monitoring */}
          <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 flex-1">
            <h3 className="flex items-center gap-2 text-white font-bold">
              <FileText className="w-5 h-5 text-indigo-400" /> Mentee Progress & Application Activity
            </h3>
            
            <div className="list max-h-[300px] overflow-y-auto pr-1 space-y-3">
              {allStudents.map(menteeName => {
                const menteeApps = applications.filter(a => a.applicantName === menteeName);
                const menteePersonalApps = personalApps.filter(a => a.applicantName === menteeName);
                
                return (
                  <div key={menteeName} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        🧑 Mentee: {menteeName}
                      </span>
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        {menteeApps.length + menteePersonalApps.length} Tracked Apps
                      </span>
                    </div>

                    {menteeApps.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="p-2.5 bg-slate-900/80 rounded-lg flex justify-between items-center text-xs border border-slate-800">
                          <div>
                            <p className="font-semibold text-slate-200">{job?.title || 'Position'} @ {job?.company || 'Company'}</p>
                            <p className="text-[11px] text-slate-400">Status: <span className="text-amber-400 font-bold">{app.status}</span></p>
                          </div>
                        </div>
                      );
                    })}

                    {menteePersonalApps.map(app => (
                      <div key={app.id} className="p-2.5 bg-slate-900/80 rounded-lg flex justify-between items-center text-xs border border-slate-800">
                        <div>
                          <p className="font-semibold text-slate-200">{app.title} @ {app.company}</p>
                          <p className="text-[11px] text-slate-400">Status: <span className="text-indigo-400 font-bold">{app.status}</span></p>
                        </div>
                      </div>
                    ))}
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

export default MentorPanel;
