import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { PlusCircle, Check, X } from 'lucide-react';

const EmployerPanel = () => {
  const { jobs, addJob, applications, updateApplicationStatus } = useContext(AppContext);
  
  const employerName = 'TechCorp'; // Mock employer name

  const [newJob, setNewJob] = useState({ title: '', company: employerName, type: 'Job', status: 'Open' });

  const handlePostJob = (e) => {
    e.preventDefault();
    if (newJob.title) {
      addJob(newJob);
      setNewJob({ ...newJob, title: '' });
      alert('Job posted!');
    }
  };

  const myJobs = jobs.filter(j => j.company === employerName);
  const myJobIds = myJobs.map(j => j.id);
  const myApplications = applications.filter(app => myJobIds.includes(app.jobId));

  return (
    <div className="panel-container">
      <h2 className="panel-title">Employer Dashboard</h2>
      
      <div className="grid-2">
        <div className="card">
          <h3>Post a New Job/Internship</h3>
          <form onSubmit={handlePostJob} className="form-group">
            <input 
              type="text" 
              placeholder="Job Title" 
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="input-field"
            />
            <select 
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              className="input-field"
            >
              <option value="Job">Job</option>
              <option value="Internship">Internship</option>
            </select>
            <button type="submit" className="btn primary mt-2">
              <PlusCircle className="icon-sm" /> Post Listing
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Applications for My Listings</h3>
          <div className="list">
            {myApplications.length === 0 ? <p>No applications yet.</p> : null}
            {myApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="list-item">
                  <div className="item-info">
                    <h4>{app.applicantName}</h4>
                    <p>Applied for: {job?.title}</p>
                    <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
                  </div>
                  {app.status === 'Pending' && (
                    <div className="action-btns">
                      <button className="btn-icon text-green" onClick={() => updateApplicationStatus(app.id, 'Approved')}>
                        <Check />
                      </button>
                      <button className="btn-icon text-red" onClick={() => updateApplicationStatus(app.id, 'Rejected')}>
                        <X />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPanel;
