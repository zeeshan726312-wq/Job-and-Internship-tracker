import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Mock Initial Data
const initialJobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Job', status: 'Open', deadline: '2026-12-31', requirements: 'React, Tailwind, 2 years experience.' },
  { id: 2, title: 'React Intern', company: 'StartupInc', type: 'Internship', status: 'Open', deadline: '2026-08-15', requirements: 'Basic HTML/CSS, willing to learn.' },
];

const initialApplications = [
  { id: 101, jobId: 1, applicantName: 'user', status: 'Applied', interviewSchedule: '', feedback: '' },
];

const initialPersonalApps = [
  { id: 301, applicantName: 'user', title: 'Software Engineer', company: 'Google', status: 'Applied', link: 'https://careers.google.com' }
];

const initialCourses = [
  { id: 401, mentorName: 'mentor', title: 'React Masterclass', description: 'Advanced React concepts and interview prep.' }
];

const initialMentorships = [
  { id: 201, mentorName: 'mentor', menteeName: 'user', courseId: 401, status: 'Pending' }
];

// Hardcoded Mock Users for Demo
const mockUsers = [
  { email: 'user@gmail.com', password: 'user123', role: 'user', name: 'User Demo', mobile: '+923001234567', idCard: '12345-1234567-1' },
  { email: 'employer@gmail.com', password: 'emp123', role: 'employer', name: 'Employer Demo', mobile: '+923007654321', idCard: '12345-7654321-1' },
  { email: 'mentor@gmail.com', password: 'men123', role: 'mentor', name: 'Mentor Demo', mobile: '+923001122334', idCard: '12345-1122334-1' },
  { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Admin Demo', mobile: '+923009988776', idCard: '12345-9988776-1' },
];

export const AppProvider = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [usersDb, setUsersDb] = useState(mockUsers);
  
  // Data State
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [personalApps, setPersonalApps] = useState(initialPersonalApps);
  const [mentorships, setMentorships] = useState(initialMentorships);
  const [courses, setCourses] = useState(initialCourses);

  useEffect(() => {
    // Check local storage for remember me
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
    return { success: false, error: 'Invalid email, password, or role' };
  };

  const signup = (userData) => {
    if (usersDb.some(u => u.email === userData.email)) {
      return { success: false, error: 'User already registered with this email' };
    }
    if (usersDb.some(u => u.password === userData.password)) {
      return { success: false, error: 'Password already exists, please choose a different one' };
    }
    
    const newUser = { ...userData, registrationDate: new Date().toISOString().split('T')[0] };
    setUsersDb([...usersDb, newUser]);
    
    if (!currentUser || currentUser.role !== 'admin') {
      setCurrentUser(newUser);
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const deleteUser = (email) => {
    setUsersDb(usersDb.filter(u => u.email !== email));
  };

  // Job Actions
  const addJob = (job) => {
    setJobs([...jobs, { ...job, id: Date.now() }]);
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
    setApplications(applications.filter(a => a.jobId !== id));
  };

  // Application Actions (Platform)
  const applyForJob = (jobId, applicantName) => {
    setApplications([...applications, { id: Date.now(), jobId, applicantName, status: 'Applied', interviewSchedule: '', feedback: '' }]);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const updateApplicationDetails = (appId, details) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, ...details } : app));
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  // Personal Tracker Actions
  const addPersonalApp = (app) => {
    setPersonalApps([...personalApps, { ...app, id: Date.now(), applicantName: currentUser.name }]);
  };

  const updatePersonalAppStatus = (appId, newStatus) => {
    setPersonalApps(personalApps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  // Mentor & Course Actions
  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: Date.now(), mentorName: currentUser.name }]);
  };

  const requestMentorship = (courseId, mentorName, menteeName) => {
    setMentorships([...mentorships, { id: Date.now(), courseId, mentorName, menteeName, status: 'Pending' }]);
  };

  const updateMentorshipStatus = (mentorshipId, newStatus) => {
    setMentorships(mentorships.map(m => m.id === mentorshipId ? { ...m, status: newStatus } : m));
  };

  const deleteMentorship = (id) => {
    setMentorships(mentorships.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, signup, logout, usersDb, deleteUser,
      jobs, addJob, deleteJob,
      applications, applyForJob, updateApplicationStatus, updateApplicationDetails, deleteApplication,
      personalApps, addPersonalApp, updatePersonalAppStatus,
      courses, addCourse,
      mentorships, requestMentorship, updateMentorshipStatus, deleteMentorship
    }}>
      {children}
    </AppContext.Provider>
  );
};
