import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { PlusCircle, MessageSquare } from 'lucide-react';

const EmployerPanel = () => {
  const { jobs, addJob, applications, updateApplicationStatus, updateApplicationDetails, currentUser } = useContext(AppContext);
  
  const employerName = currentUser?.name || 'TechCorp';

  const [newJob, setNewJob] = useState({ 
    title: '', 
    company: employerName, 
    type: 'Job', 
    status: 'Open',
    deadline: '',
    requirements: ''
  });

  // State for Interview/Feedback Modal
  const [editingApp, setEditingApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [feedback, setFeedback] = useState('');

  const handlePostJob = (e) => {
    e.preventDefault();
    if (newJob.title && newJob.deadline && newJob.requirements) {
      addJob(newJob);
      setNewJob({ ...newJob, title: '', deadline: '', requirements: '' });
      alert('Job posted!');
    } else {
      alert('Please fill out all fields!');
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

  const myJobs = jobs.filter(j => j.company === employerName);
  const myJobIds = myJobs.map(j => j.id);
  const myApplications = applications.filter(app => myJobIds.includes(app.jobId));

  return (
    <div className="panel-container relative">
      <h2 className="panel-title">Employer Dashboard</h2>
      
      <div className="grid-2">
        <div className="card">
          <h3>Post a New Job/Internship</h3>
          <form onSubmit={handlePostJob} className="form-group">
            <input 
              type="text" 
              placeholder="Job/Internship Title" 
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="input-field"
              required
            />
            <div className="flex gap-2">
              <select 
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                className="input-field flex-1"
              >
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
              <input 
                type="date"
                title="Application Deadline"
                value={newJob.deadline}
                onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                className="input-field flex-1 text-secondaryText"
                required
              />
            </div>
            <textarea
              placeholder="Requirements (e.g. React, Tailwind, 2 years experience...)"
              value={newJob.requirements}
              onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
              className="input-field min-h-[100px] resize-y"
              required
            ></textarea>
            
            <button type="submit" className="btn primary mt-2">
              <PlusCircle className="icon-sm" /> Post Listing
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Review Applications</h3>
          <div className="list max-h-[500px] overflow-y-auto pr-2">
            {myApplications.length === 0 ? <p className="text-secondaryText text-sm">No applications yet.</p> : null}
            {myApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="list-item flex-col items-start gap-3">
                  <div className="item-info w-full flex justify-between">
                    <div>
                      <h4 className="font-semibold">{app.applicantName}</h4>
                      <p className="text-sm text-secondaryText">Applied for: {job?.title}</p>
                    </div>
                    <select 
                      className={`bg-black/30 border border-borderC rounded px-2 py-1 text-sm outline-none font-semibold ${
                        app.status === 'Applied' ? 'text-warning' :
                        app.status === 'Shortlisted' ? 'text-primary' :
                        app.status === 'Interview' ? 'text-secondary' :
                        app.status === 'Hired' ? 'text-success' : 'text-danger'
                      }`}
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                    >
                      <option value="Applied" className="text-primaryText">Applied</option>
                      <option value="Shortlisted" className="text-primaryText">Shortlisted</option>
                      <option value="Interview" className="text-primaryText">Interview</option>
                      <option value="Hired" className="text-primaryText">Hired</option>
                      <option value="Rejected" className="text-primaryText">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="w-full flex justify-between items-center bg-black/20 p-2 rounded border border-borderC">
                    <div className="text-xs text-secondaryText">
                      {app.interviewSchedule ? <div>Interview: {new Date(app.interviewSchedule).toLocaleString()}</div> : null}
                      {app.feedback ? <div>Feedback added.</div> : null}
                      {!app.interviewSchedule && !app.feedback ? 'No interview/feedback set.' : ''}
                    </div>
                    <button 
                      className="btn secondary py-1 px-3 text-xs"
                      onClick={() => openEditor(app)}
                    >
                      <MessageSquare className="w-3 h-3" /> Add Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingApp && (
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-sidebar p-6 rounded-xl border border-borderC w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Interview & Feedback</h3>
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="block text-sm text-secondaryText mb-1">Interview Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="input-field w-full"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-secondaryText mb-1">Feedback / Notes</label>
                <textarea 
                  className="input-field w-full min-h-[100px] resize-y"
                  placeholder="Provide feedback for the applicant..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn outline" onClick={() => setEditingApp(null)}>Cancel</button>
                <button type="submit" className="btn primary">Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerPanel;
