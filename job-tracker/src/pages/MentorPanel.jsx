import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Check, X, Calendar, PlusCircle, BookOpen } from 'lucide-react';

const MentorPanel = () => {
  const { 
    mentorships, updateMentorshipStatus, 
    courses, addCourse, currentUser,
    applications, personalApps, jobs
  } = useContext(AppContext);
  
  const mentorName = currentUser?.name || 'mentor';

  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  const handlePostCourse = (e) => {
    e.preventDefault();
    if (newCourse.title && newCourse.description) {
      addCourse(newCourse);
      setNewCourse({ title: '', description: '' });
      alert('Course posted!');
    }
  };

  const myRequests = mentorships.filter(m => m.mentorName === mentorName);
  const myCourses = courses.filter(c => c.mentorName === mentorName);
  
  // Get all unique mentees whose mentorship status is 'Accepted'
  const acceptedMentees = [...new Set(myRequests.filter(m => m.status === 'Accepted').map(m => m.menteeName))];

  return (
    <div className="panel-container">
      <h2 className="panel-title">Mentor Dashboard</h2>
      
      <div className="grid-2">
        <div className="card">
          <h3>Offer a New Course/Mentorship</h3>
          <form onSubmit={handlePostCourse} className="form-group">
            <input 
              type="text" 
              placeholder="Course Title" 
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="input-field"
              required
            />
            <textarea
              placeholder="Course Description & Goals..."
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="input-field min-h-[100px] resize-y"
              required
            ></textarea>
            <button type="submit" className="btn primary mt-2">
              <PlusCircle className="icon-sm" /> Post Course
            </button>
          </form>

          <h3 className="mt-6 mb-4">My Offered Courses</h3>
          <div className="list">
            {myCourses.length === 0 ? <p className="text-sm text-secondaryText">No courses posted.</p> : null}
            {myCourses.map(c => (
              <div key={c.id} className="list-item flex-col items-start bg-black/20">
                <h4 className="font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4 text-secondary"/> {c.title}</h4>
                <p className="text-sm text-secondaryText mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3>Mentorship Enrollment Requests</h3>
            <div className="list">
              {myRequests.length === 0 ? <p className="text-sm text-secondaryText">No mentorship requests yet.</p> : null}
              {myRequests.map(req => {
                const requestedCourse = courses.find(c => c.id === req.courseId);
                return (
                  <div key={req.id} className="list-item flex-col items-start gap-2">
                    <div className="item-info w-full flex justify-between">
                      <div>
                        <h4>{req.menteeName}</h4>
                        <p className="text-sm text-secondaryText">Course: {requestedCourse?.title}</p>
                      </div>
                      <span className={`status ${req.status.toLowerCase()}`}>{req.status}</span>
                    </div>
                    
                    {req.status === 'Pending' && (
                      <div className="action-btns flex gap-2 w-full justify-end">
                        <button className="btn-icon text-green bg-green-500/10 hover:bg-green-500/20" onClick={() => updateMentorshipStatus(req.id, 'Accepted')}>
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="btn-icon text-red bg-red-500/10 hover:bg-red-500/20" onClick={() => updateMentorshipStatus(req.id, 'Declined')}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3>My Mentees' Applications (Monitoring)</h3>
            <p className="text-sm text-secondaryText mb-4">Review the progress of students you are mentoring.</p>
            <div className="list max-h-[400px] overflow-y-auto">
              {acceptedMentees.length === 0 ? <p className="text-sm text-secondaryText">No active mentees.</p> : null}
              {acceptedMentees.map(menteeName => {
                const menteeApps = applications.filter(a => a.applicantName === menteeName);
                const menteePersonalApps = personalApps.filter(a => a.applicantName === menteeName);
                
                return (
                  <div key={menteeName} className="mb-6 last:mb-0">
                    <h4 className="font-semibold text-primaryText border-b border-borderC pb-2 mb-3">{menteeName}</h4>
                    
                    {menteeApps.length > 0 && <div className="text-xs font-semibold text-secondaryText mb-2 uppercase">Platform Apps</div>}
                    {menteeApps.map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="bg-black/20 p-2 rounded border border-borderC mb-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{job?.title} @ {job?.company}</span>
                            <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                          </div>
                        </div>
                      )
                    })}

                    {menteePersonalApps.length > 0 && <div className="text-xs font-semibold text-secondaryText mb-2 mt-4 uppercase">Personal Tracked Apps</div>}
                    {menteePersonalApps.map(app => (
                      <div key={app.id} className="bg-black/20 p-2 rounded border border-borderC mb-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{app.title} @ {app.company}</span>
                          <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                        </div>
                      </div>
                    ))}
                    
                    {menteeApps.length === 0 && menteePersonalApps.length === 0 && (
                      <p className="text-xs text-secondaryText italic">No applications found for {menteeName}.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPanel;
