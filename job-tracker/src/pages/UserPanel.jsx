import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Briefcase, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserPanel = () => {
  const { jobs, applications, applyForJob, requestMentorship } = useContext(AppContext);
  const [applicantName, setApplicantName] = useState('John Doe'); // Default mock user

  const handleApply = (jobId) => {
    applyForJob(jobId, applicantName);
    alert('Application submitted successfully!');
  };

  const myApplications = applications.filter(app => app.applicantName === applicantName);

  return (
    <div className="panel-container">
      <h2 className="panel-title">Applicant Dashboard</h2>
      
      <div className="grid-2">
        <div className="card">
          <h3>Available Jobs & Internships</h3>
          <div className="list">
            {jobs.map(job => (
              <div key={job.id} className="list-item">
                <div className="item-info">
                  <h4>{job.title}</h4>
                  <p>{job.company} • {job.type}</p>
                </div>
                <button className="btn primary" onClick={() => handleApply(job.id)}>
                  <Send className="icon-sm" /> Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>My Applications</h3>
          <div className="list">
            {myApplications.length === 0 ? <p>No applications yet.</p> : null}
            {myApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className="list-item">
                  <div className="item-info">
                    <h4>{job?.title || 'Unknown Job'}</h4>
                    <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
                  </div>
                  {app.status === 'Pending' && <Clock className="icon-sm text-yellow" />}
                  {app.status === 'Approved' && <CheckCircle className="icon-sm text-green" />}
                  {app.status === 'Rejected' && <XCircle className="icon-sm text-red" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3>Request Mentorship</h3>
        <p>Connect with industry experts.</p>
        <button className="btn secondary" onClick={() => {
          requestMentorship('Alice Johnson', applicantName);
          alert('Mentorship requested!');
        }}>
          Request Session with Alice
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
