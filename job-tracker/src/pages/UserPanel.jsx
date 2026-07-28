import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Send, Clock, CheckCircle, XCircle, Calendar, FileText, PlusCircle, GraduationCap, Video } from 'lucide-react';

const UserPanel = () => {
  const { 
    jobs, applications, applyForJob, 
    courses, requestMentorship, mentorships,
    personalApps, addPersonalApp, updatePersonalAppStatus,
    currentUser 
  } = useContext(AppContext);
  
  const isUserApp = (app) => {
    if (!app || !currentUser) return false;
    const cName = (currentUser.name || '').toLowerCase().trim();
    const cUsername = (currentUser.username || '').toLowerCase().trim();
    const cEmail = (currentUser.email || '').toLowerCase().trim();
    
    const appName = (app.applicantName || '').toLowerCase().trim();
    const appEmail = (app.applicantEmail || '').toLowerCase().trim();

    if (appEmail && cEmail && appEmail === cEmail) return true;
    if (appName && (appName === cName || appName === cUsername || appName === cEmail)) return true;
    if (currentUser.role === 'user' && (appName === 'user demo' || appName === 'user')) return true;
    return false;
  };

  const applicantName = currentUser?.name || currentUser?.username || 'user';

  // Personal App State
  const [newPersonalApp, setNewPersonalApp] = useState({ title: '', company: '', link: '', status: 'Applied' });

  const handleApply = (jobId) => {
    applyForJob(jobId, applicantName);
    alert('Application submitted successfully!');
  };

  const handleAddPersonalApp = (e) => {
    e.preventDefault();
    if (newPersonalApp.title && newPersonalApp.company) {
      addPersonalApp(newPersonalApp);
      setNewPersonalApp({ title: '', company: '', link: '', status: 'Applied' });
    }
  };

  const myApplications = (applications || []).filter(isUserApp);
  const myPersonalApps = (personalApps || []).filter(isUserApp);
  const myMentorships = (mentorships || []).filter(m => isUserApp({ applicantName: m.menteeName }));

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Applied':
      case 'Pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'Shortlisted': return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'Interview': return <Video className="w-5 h-5 text-secondary" />;
      case 'Hired': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-danger" />;
      default: return null;
    }
  };

  return (
    <div className="panel-container">
      <h2 className="panel-title">Applicant Dashboard</h2>
      
      <div className="grid-2">
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3>Available Platform Jobs & Internships</h3>
            <div className="list max-h-[400px] overflow-y-auto pr-2">
              {jobs.length === 0 ? <p className="text-secondaryText text-sm">No listings available.</p> : null}
              {jobs.map(job => (
                <div key={job.id} className="list-item flex-col items-start gap-3">
                  <div className="item-info w-full flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        {job.title}
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-medium">{job.type}</span>
                      </h4>
                      <p className="text-secondaryText text-sm font-medium">{job.company}</p>
                    </div>
                    <button 
                      className="btn primary py-1.5 px-4 text-sm" 
                      onClick={() => handleApply(job.id)}
                      disabled={myApplications.some(app => app.jobId === job.id)}
                    >
                      <Send className="w-4 h-4" /> 
                      {myApplications.some(app => app.jobId === job.id) ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  
                  <div className="w-full bg-black/20 rounded-lg p-3 border border-borderC space-y-2">
                    <div className="flex items-center gap-2 text-sm text-secondaryText">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primaryText">Deadline:</span> {job.deadline || 'No deadline set'}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-secondaryText">
                      <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-primaryText block mb-1">Requirements:</span>
                        <p className="whitespace-pre-wrap">{job.requirements || 'No requirements specified.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Mentorship & Courses</h3>
            <div className="list">
              {courses.length === 0 ? <p className="text-secondaryText text-sm">No courses available.</p> : null}
              {courses.map(course => {
                const isRequested = myMentorships.some(m => m.courseId === course.id);
                return (
                  <div key={course.id} className="list-item flex-col items-start">
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-secondary" /> {course.title}
                        </h4>
                        <p className="text-sm text-secondaryText">Mentor: {course.mentorName}</p>
                      </div>
                      <button 
                        className="btn secondary py-1.5 px-3 text-sm"
                        onClick={() => requestMentorship(course.id, course.mentorName, applicantName)}
                        disabled={isRequested}
                      >
                        {isRequested ? 'Requested' : 'Enroll & Request Mentorship'}
                      </button>
                    </div>
                    <p className="text-sm mt-2">{course.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3>My Platform Applications</h3>
            <div className="list max-h-[300px] overflow-y-auto pr-2">
              {myApplications.length === 0 ? <p className="text-secondaryText text-sm">No applications yet.</p> : null}
              {myApplications.map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="list-item flex-col items-start gap-2">
                    <div className="w-full flex justify-between items-start">
                      <div className="item-info">
                        <h4 className="font-semibold">{job?.title || 'Unknown Listing'}</h4>
                        <p className="text-sm text-secondaryText">{job?.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                          <StatusIcon status={app.status} />
                        </div>
                      </div>
                    </div>
                    
                    {app.interviewSchedule && (
                      <div className="w-full bg-secondary/10 border border-secondary/30 rounded p-2 text-sm mt-2">
                        <span className="font-semibold text-secondary">Interview Scheduled:</span> {new Date(app.interviewSchedule).toLocaleString()}
                      </div>
                    )}
                    
                    {app.feedback && (
                      <div className="w-full bg-black/20 rounded p-2 text-sm mt-1">
                        <span className="font-semibold">Employer Feedback:</span> {app.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3>Personal Application Tracker</h3>
            <p className="text-sm text-secondaryText mb-4">Track jobs you applied to externally (e.g. LinkedIn).</p>
            
            <form onSubmit={handleAddPersonalApp} className="flex gap-2 mb-4">
              <input 
                type="text" placeholder="Role Title" className="input-field flex-1"
                value={newPersonalApp.title} onChange={e => setNewPersonalApp({...newPersonalApp, title: e.target.value})} required
              />
              <input 
                type="text" placeholder="Company" className="input-field flex-1"
                value={newPersonalApp.company} onChange={e => setNewPersonalApp({...newPersonalApp, company: e.target.value})} required
              />
              <button type="submit" className="btn primary px-3"><PlusCircle className="w-5 h-5"/></button>
            </form>

            <div className="list">
              {myPersonalApps.map(app => (
                <div key={app.id} className="list-item flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{app.title}</h4>
                    <p className="text-sm text-secondaryText">{app.company}</p>
                  </div>
                  <select 
                    className="bg-black/30 border border-borderC rounded px-2 py-1 text-sm outline-none"
                    value={app.status}
                    onChange={(e) => updatePersonalAppStatus(app.id, e.target.value)}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
