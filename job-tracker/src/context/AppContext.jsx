import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Mock Initial Data (Fallback if localStorage is empty)
const initialJobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Job', status: 'Open', deadline: '2026-12-31', requirements: 'React, Tailwind, 2 years experience.' },
  { id: 2, title: 'React Intern', company: 'StartupInc', type: 'Internship', status: 'Open', deadline: '2026-08-15', requirements: 'Basic HTML/CSS, willing to learn.' },
];

const initialApplications = [
  { id: 101, jobId: 1, applicantName: 'User Demo', status: 'Applied', interviewSchedule: '', feedback: '' },
];

const initialPersonalApps = [
  { id: 301, applicantName: 'User Demo', title: 'Software Engineer', company: 'Google', type: 'Job', status: 'Applied', link: 'https://careers.google.com' }
];

const initialCourses = [
  { id: 401, mentorName: 'Mentor Demo', title: 'React Masterclass', description: 'Advanced React concepts and interview prep.' }
];

const initialMentorships = [
  { id: 201, mentorName: 'Mentor Demo', menteeName: 'User Demo', courseId: 401, status: 'Pending' }
];

// Hardcoded Mock Users for Demo
const mockUsers = [
  { email: 'user@gmail.com', password: 'user123', role: 'user', name: 'User Demo', mobile: '+923001234567', idCard: '12345-1234567-1' },
  { email: 'employer@gmail.com', password: 'emp123', role: 'employer', name: 'Employer Demo', mobile: '+923007654321', idCard: '12345-7654321-1' },
  { email: 'mentor@gmail.com', password: 'men123', role: 'mentor', name: 'Mentor Demo', mobile: '+923001122334', idCard: '12345-1122334-1' },
  { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Admin Demo', mobile: '+923009988776', idCard: '12345-9988776-1' },
];

const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState(() => getStoredItem('currentUser', null));
  const [usersDb, setUsersDb] = useState(() => getStoredItem('jt_users_db', mockUsers));
  
  // Data State with LocalStorage initialization
  const [jobs, setJobs] = useState(() => getStoredItem('jt_jobs', initialJobs));
  const [applications, setApplications] = useState(() => getStoredItem('jt_applications', initialApplications));
  const [personalApps, setPersonalApps] = useState(() => getStoredItem('jt_personal_apps', initialPersonalApps));
  const [mentorships, setMentorships] = useState(() => getStoredItem('jt_mentorships', initialMentorships));
  const [courses, setCourses] = useState(() => getStoredItem('jt_courses', initialCourses));

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('jt_users_db', JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    localStorage.setItem('jt_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jt_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('jt_personal_apps', JSON.stringify(personalApps));
  }, [personalApps]);

  useEffect(() => {
    localStorage.setItem('jt_mentorships', JSON.stringify(mentorships));
  }, [mentorships]);

  useEffect(() => {
    localStorage.setItem('jt_courses', JSON.stringify(courses));
  }, [courses]);

  // Auth Actions
  const login = (email, password, role, rememberMe) => {
    const user = usersDb.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid email, password, or role selection' };
  };

  const signup = (userData) => {
    if (usersDb.some(u => u.email === userData.email)) {
      return { success: false, error: 'User already registered with this email' };
    }
    
    const newUser = { ...userData, registrationDate: new Date().toISOString().split('T')[0] };
    setUsersDb(prev => [...prev, newUser]);
    
    if (!currentUser || currentUser.role !== 'admin') {
      setCurrentUser(newUser);
    }
    return { success: true };
  };

  const resetPassword = (email, newPassword) => {
    const targetUserIndex = usersDb.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (targetUserIndex === -1) {
      return { success: false, error: 'No account registered with this email address.' };
    }
    
    const updatedUsers = [...usersDb];
    updatedUsers[targetUserIndex].password = newPassword;
    setUsersDb(updatedUsers);

    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const deleteUser = (email) => {
    setUsersDb(prev => prev.filter(u => u.email !== email));
  };

  const updateUserRole = (email, newRole) => {
    setUsersDb(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
  };

  // Job Actions
  const addJob = (job) => {
    setJobs(prev => [...prev, { ...job, id: Date.now() }]);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setApplications(prev => prev.filter(a => a.jobId !== id));
  };

  // Application Actions (Platform)
  const applyForJob = (jobId, applicantName) => {
    setApplications(prev => [...prev, { id: Date.now(), jobId, applicantName, status: 'Applied', interviewSchedule: '', feedback: '' }]);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const updateApplicationDetails = (appId, details) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, ...details } : app));
  };

  const deleteApplication = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  // Personal Tracker Actions
  const addPersonalApp = (app) => {
    setPersonalApps(prev => [...prev, { ...app, id: Date.now(), applicantName: currentUser?.name || 'user' }]);
  };

  const updatePersonalAppStatus = (appId, newStatus) => {
    setPersonalApps(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const deletePersonalApp = (id) => {
    setPersonalApps(prev => prev.filter(a => a.id !== id));
  };

  // Mentor & Course Actions
  const addCourse = (course) => {
    setCourses(prev => [...prev, { ...course, id: Date.now(), mentorName: currentUser?.name || 'Mentor' }]);
  };

  const requestMentorship = (courseId, mentorName, menteeName) => {
    setMentorships(prev => [...prev, { id: Date.now(), courseId, mentorName, menteeName, status: 'Pending' }]);
  };

  const updateMentorshipStatus = (mentorshipId, newStatus) => {
    setMentorships(prev => prev.map(m => m.id === mentorshipId ? { ...m, status: newStatus } : m));
  };

  const deleteMentorship = (id) => {
    setMentorships(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, signup, resetPassword, logout, usersDb, deleteUser, updateUserRole,
      jobs, addJob, deleteJob,
      applications, applyForJob, updateApplicationStatus, updateApplicationDetails, deleteApplication,
      personalApps, addPersonalApp, updatePersonalAppStatus, deletePersonalApp,
      courses, addCourse,
      mentorships, requestMentorship, updateMentorshipStatus, deleteMentorship
    }}>
      {children}
    </AppContext.Provider>
  );
};
