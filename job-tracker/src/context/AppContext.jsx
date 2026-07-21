import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const initialJobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Job', status: 'Open' },
  { id: 2, title: 'React Intern', company: 'StartupInc', type: 'Internship', status: 'Open' },
];

const initialApplications = [
  { id: 101, jobId: 1, applicantName: 'John Doe', status: 'Pending' },
  { id: 102, jobId: 2, applicantName: 'Jane Smith', status: 'Reviewed' },
];

const initialMentorships = [
  { id: 201, mentorName: 'Alice Johnson', menteeName: 'Bob Williams', status: 'Pending' }
];

export const AppProvider = ({ children }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [mentorships, setMentorships] = useState(initialMentorships);

  // Actions
  const addJob = (job) => {
    setJobs([...jobs, { ...job, id: Date.now() }]);
  };

  const applyForJob = (jobId, applicantName) => {
    setApplications([...applications, { id: Date.now(), jobId, applicantName, status: 'Pending' }]);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const requestMentorship = (mentorName, menteeName) => {
    setMentorships([...mentorships, { id: Date.now(), mentorName, menteeName, status: 'Pending' }]);
  };

  const updateMentorshipStatus = (mentorshipId, newStatus) => {
    setMentorships(mentorships.map(m => m.id === mentorshipId ? { ...m, status: newStatus } : m));
  };

  return (
    <AppContext.Provider value={{
      jobs, addJob,
      applications, applyForJob, updateApplicationStatus,
      mentorships, requestMentorship, updateMentorshipStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
