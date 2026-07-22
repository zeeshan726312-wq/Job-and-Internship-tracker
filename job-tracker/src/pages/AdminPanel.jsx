import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { 
    jobs, applications, updateApplicationStatus, deleteApplication, deleteJob,
    mentorships, deleteMentorship, usersDb, deleteUser, personalApps
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  const users = usersDb.filter(u => u.role === 'user');
  const employers = usersDb.filter(u => u.role === 'employer');
  const mentors = usersDb.filter(u => u.role === 'mentor');

  return (
    <div className="panel-container">
      <h2 className="panel-title">Admin Dashboard</h2>
      
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <h4>Registered Users</h4>
          <h2>{users.length}</h2>
        </div>
        <div className="stat-card">
          <h4>Registered Employers</h4>
          <h2>{employers.length}</h2>
        </div>
        <div className="stat-card">
          <h4>Total Jobs</h4>
          <h2>{jobs.length}</h2>
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b border-borderC pb-2 overflow-x-auto">
        {['users', 'employers', 'mentors', 'jobs', 'applications'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-secondaryText hover:bg-white/5'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card full-width">
        <div className="flex justify-between items-center mb-4">
          <h3>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          {['users', 'employers', 'mentors'].includes(activeTab) && (
            <button onClick={() => navigate('/auth')} className="btn primary py-1 px-3 text-sm" title="Log out to create a new user">
              <UserPlus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        <div className="list">
          {activeTab === 'users' && users.length === 0 && <p>No users found.</p>}
          {activeTab === 'users' && users.map(u => {
            const platformApps = applications.filter(a => a.applicantName === u.name).length;
            const customApps = personalApps.filter(a => a.applicantName === u.name).length;
            
            return (
              <div key={u.email} className="list-item flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="item-info flex-1">
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                </div>
                <div className="flex-1 text-sm text-secondaryText">
                  <p>Registered: {u.registrationDate}</p>
                  <p>Total Applications: {platformApps + customApps} ({platformApps} Platform, {customApps} Personal)</p>
                </div>
                <button className="btn-icon text-red shrink-0" onClick={() => deleteUser(u.email)}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )
          })}

          {activeTab === 'employers' && employers.length === 0 && <p>No employers found.</p>}
          {activeTab === 'employers' && employers.map(u => (
            <div key={u.email} className="list-item">
              <div className="item-info">
                <h4>{u.name}</h4>
                <p>{u.email}</p>
                <p className="text-xs text-secondaryText">Registered: {u.registrationDate}</p>
              </div>
              <button className="btn-icon text-red" onClick={() => deleteUser(u.email)}>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {activeTab === 'mentors' && mentors.length === 0 && <p>No mentors found.</p>}
          {activeTab === 'mentors' && mentors.map(u => (
            <div key={u.email} className="list-item">
              <div className="item-info">
                <h4>{u.name}</h4>
                <p>{u.email}</p>
                <p className="text-xs text-secondaryText">Registered: {u.registrationDate}</p>
              </div>
              <button className="btn-icon text-red" onClick={() => deleteUser(u.email)}>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {activeTab === 'jobs' && jobs.length === 0 && <p>No jobs found.</p>}
          {activeTab === 'jobs' && jobs.map(job => (
            <div key={job.id} className="list-item">
              <div className="item-info">
                <h4>{job.title} <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2">{job.type}</span></h4>
                <p>{job.company} • Deadline: {job.deadline}</p>
              </div>
              <button className="btn-icon text-red" onClick={() => deleteJob(job.id)}>
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {activeTab === 'applications' && applications.length === 0 && <p>No applications found.</p>}
          {activeTab === 'applications' && applications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} className="list-item">
                <div className="item-info">
                  <h4>Applicant: {app.applicantName}</h4>
                  <p>Job/Internship: {job?.title} ({job?.company})</p>
                  <p>Status: <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
                </div>
                
                <div className="action-btns">
                  <button className="btn-icon text-red" onClick={() => deleteApplication(app.id)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
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
