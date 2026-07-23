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
  Clock
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
    <div className="panel-container space-y-6">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-slate-900 via-slate-800 to-purple-950/70 border-purple-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Career Guidance Portal
          </div>
          <h2 className="text-2xl font-bold text-white">Mentor Dashboard</h2>
          <p className="text-sm text-secondaryText">
            Monitor student applications, provide career guidance feedback, track interview readiness, and offer courses.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Course Creation */}
        <div className="card space-y-4">
          <h3 className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" /> Offer Mentorship Program / Course
          </h3>

          {coursePostedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs">
              Course / Mentorship program posted successfully! Students can now request enrollment.
            </div>
          )}

          <form onSubmit={handlePostCourse} className="space-y-3">
            <div>
              <label className="form-label text-xs">Course / Program Title *</label>
              <input 
                type="text" 
                placeholder="e.g. React Masterclass & Resume Review" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="input-field w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="form-label text-xs">Program Description & Goals *</label>
              <textarea
                placeholder="Describe mentorship curriculum, interview preparation strategies, mock interview availability..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="form-textarea text-xs min-h-[90px]"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn primary w-full text-xs font-semibold py-2.5 shadow-md shadow-primary/20">
              <PlusCircle className="w-4 h-4" /> Publish Mentorship Program
            </button>
          </form>

          <h3 className="text-sm font-semibold text-white pt-2 border-t border-border">Offered Mentorship Programs ({myCourses.length})</h3>
          <div className="list space-y-2">
            {myCourses.map(c => (
              <div key={c.id} className="p-3 bg-slate-800/40 rounded-xl border border-border text-xs space-y-1">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" /> {c.title}
                </h4>
                <p className="text-secondaryText">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Requests & Monitoring */}
        <div className="space-y-6 flex flex-col">
          <div className="card space-y-4">
            <h3 className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" /> Mentorship Requests ({myRequests.length})
            </h3>
            <div className="list max-h-[220px] overflow-y-auto pr-1 space-y-2">
              {myRequests.length === 0 ? (
                <p className="text-xs text-secondaryText py-2">No pending requests.</p>
              ) : (
                myRequests.map(req => {
                  const requestedCourse = courses.find(c => c.id === req.courseId);
                  return (
                    <div key={req.id} className="p-3 bg-slate-800/40 rounded-xl border border-border flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-white">{req.menteeName}</h4>
                        <p className="text-secondaryText">Program: {requestedCourse?.title || 'General Mentorship'}</p>
                      </div>

                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => updateMentorshipStatus(req.id, 'Accepted')}
                            className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg"
                            title="Accept Student"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateMentorshipStatus(req.id, 'Declined')}
                            className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg"
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
          <div className="card space-y-4 flex-1">
            <h3 className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Mentees' Application Progress Monitoring
            </h3>
            <p className="text-xs text-secondaryText">Review student applications, track interview readiness, and give feedback.</p>
            
            <div className="list max-h-[300px] overflow-y-auto pr-1 space-y-4">
              {allStudents.map(menteeName => {
                const menteeApps = applications.filter(a => a.applicantName === menteeName);
                const menteePersonalApps = personalApps.filter(a => a.applicantName === menteeName);
                
                return (
                  <div key={menteeName} className="p-3.5 bg-slate-900/60 rounded-xl border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="font-bold text-white text-sm">🧑 Student: {menteeName}</span>
                      <span className="text-[11px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                        {menteeApps.length + menteePersonalApps.length} Active Applications
                      </span>
                    </div>

                    {menteeApps.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="p-2.5 bg-slate-800/50 rounded-lg flex justify-between items-center text-xs">
                          <div>
                            <p className="font-semibold text-slate-200">{job?.title || 'Position'} @ {job?.company || 'Company'}</p>
                            <p className="text-[11px] text-secondaryText">Status: <span className="text-amber-400 font-medium">{app.status}</span></p>
                          </div>
                        </div>
                      );
                    })}

                    {menteePersonalApps.map(app => (
                      <div key={app.id} className="p-2.5 bg-slate-800/50 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{app.title} @ {app.company}</p>
                          <p className="text-[11px] text-secondaryText">Status: <span className="text-blue-400 font-medium">{app.status}</span></p>
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
