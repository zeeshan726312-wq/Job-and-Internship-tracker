import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const AdminPanel = () => {
  const { jobs, applications, updateApplicationStatus, mentorships } = useContext(AppContext);

  return (
    <div className="panel-container">
      <h2 className="panel-title">Admin Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Jobs</h4>
          <h2>{jobs.length}</h2>
        </div>
        <div className="stat-card">
          <h4>Total Applications</h4>
          <h2>{applications.length}</h2>
        </div>
        <div className="stat-card">
          <h4>Mentorship Requests</h4>
          <h2>{mentorships.length}</h2>
        </div>
      </div>

      <div className="card mt-4 full-width">
        <h3>System Overview - All Applications</h3>
        <p>Admins can override and manage any application.</p>
        <div className="list mt-4">
          {applications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} className="list-item">
                <div className="item-info">
                  <h4>Applicant: {app.applicantName}</h4>
                  <p>Job/Internship: {job?.title} ({job?.company})</p>
                  <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
                </div>
                
                <div className="action-btns">
                  {app.status !== 'Approved' && (
                    <button className="btn secondary" onClick={() => updateApplicationStatus(app.id, 'Approved')}>
                      Approve
                    </button>
                  )}
                  {app.status !== 'Rejected' && (
                    <button className="btn outline text-red" onClick={() => updateApplicationStatus(app.id, 'Rejected')}>
                      Reject
                    </button>
                  )}
                  <ShieldAlert className="icon-sm text-gray" title="Admin Override" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
