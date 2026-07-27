import React, { createContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

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
  { id: 201, mentorName: 'Mentor Demo', menteeName: 'User Demo', courseId: 401, status: 'Approved' }
];

const initialMentorApps = [
  { 
    id: 501, 
    jobId: 2, 
    jobTitle: 'React Intern', 
    company: 'StartupInc', 
    mentorName: 'Mentor Demo', 
    mentorEmail: 'mentor@gmail.com', 
    mentorshipFee: 'PKR 5,000 / month', 
    description: '1-on-1 weekly mentorship, code reviews, and React interview guidance.',
    status: 'Approved' 
  }
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
  // Theme State
  const [theme, setTheme] = useState(() => getStoredItem('jt_theme', 'dark'));

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('jt_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => getStoredItem('currentUser', null));
  const [usersDb, setUsersDb] = useState(() => getStoredItem('jt_users_db', mockUsers) || mockUsers);
  
  // Data State with LocalStorage initialization & safe array fallbacks
  const [jobs, setJobs] = useState(() => getStoredItem('jt_jobs', initialJobs) || initialJobs);
  const [applications, setApplications] = useState(() => getStoredItem('jt_applications', initialApplications) || initialApplications);
  const [personalApps, setPersonalApps] = useState(() => getStoredItem('jt_personal_apps', initialPersonalApps) || initialPersonalApps);
  const [courses, setCourses] = useState(() => getStoredItem('jt_courses', initialCourses) || initialCourses);
  const [mentorships, setMentorships] = useState(() => getStoredItem('jt_mentorships', initialMentorships) || initialMentorships);
  const [mentorApps, setMentorApps] = useState(() => getStoredItem('jt_mentor_apps', initialMentorApps) || initialMentorApps);

  // Sync to Database & Storage Service whenever state changes
  useEffect(() => { dbService.syncCollection('jt_jobs', jobs); }, [jobs]);
  useEffect(() => { dbService.syncCollection('jt_applications', applications); }, [applications]);
  useEffect(() => { dbService.syncCollection('jt_personal_apps', personalApps); }, [personalApps]);
  useEffect(() => { dbService.syncCollection('jt_users_db', usersDb); }, [usersDb]);
  useEffect(() => { dbService.syncCollection('jt_courses', courses); }, [courses]);
  useEffect(() => { dbService.syncCollection('jt_mentorships', mentorships); }, [mentorships]);
  useEffect(() => { dbService.syncCollection('jt_mentor_apps', mentorApps); }, [mentorApps]);

  // Fetch latest live data from Firebase Cloud on startup across all devices
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const cloudUsers = await dbService.getItem('jt_users_db', null);
        if (cloudUsers && Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          setUsersDb(cloudUsers);
        }
        const cloudJobs = await dbService.getItem('jt_jobs', null);
        if (cloudJobs && Array.isArray(cloudJobs) && cloudJobs.length > 0) {
          setJobs(cloudJobs);
        }
        const cloudApps = await dbService.getItem('jt_applications', null);
        if (cloudApps && Array.isArray(cloudApps) && cloudApps.length > 0) {
          setApplications(cloudApps);
        }
        const cloudMentorApps = await dbService.getItem('jt_mentor_apps', null);
        if (cloudMentorApps && Array.isArray(cloudMentorApps) && cloudMentorApps.length > 0) {
          setMentorApps(cloudMentorApps);
        }
      } catch (err) {
        console.warn('[Cloud Initial Sync Error]:', err);
      }
    };
    fetchCloudData();
  }, []);

  // Auth Actions
  const login = (email, password, role) => {
    const user = usersDb.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials or role selection.' };
  };

  const signup = (userData) => {
    const existing = usersDb.find(u => u.email === userData.email);
    if (existing) {
      return { success: false, message: 'Gmail address already registered.' };
    }
    const newUser = { ...userData };
    setUsersDb(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  const resetPassword = (email, newPassword) => {
    const user = usersDb.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'Gmail address not found in system database.' };
    }
    setUsersDb(prev => prev.map(u => u.email === email ? { ...u, password: newPassword } : u));
    return { success: true, message: 'Password updated successfully! You can now sign in.' };
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

  const deleteJob = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  // Application Actions (Applicant submitting for Job)
  const applyForJob = (jobId, applicantName) => {
    const existing = applications.find(a => a.jobId === jobId && a.applicantName === applicantName);
    if (!existing) {
      setApplications(prev => [...prev, { 
        id: Date.now(), 
        jobId, 
        applicantName: applicantName || currentUser?.name || 'User Demo', 
        status: 'Applied', 
        interviewSchedule: '', 
        feedback: '' 
      }]);
    }
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const updateApplicationDetails = (appId, updatedFields) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, ...updatedFields } : app));
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

  const editPersonalApp = (appId, updatedFields) => {
    setPersonalApps(prev => prev.map(app => app.id === appId ? { ...app, ...updatedFields } : app));
  };

  const deletePersonalApp = (id) => {
    setPersonalApps(prev => prev.filter(a => a.id !== id));
  };

  // Mentor Application to Offer Mentorship for an Internship / Job
  const applyToMentorJob = (jobId, jobTitle, company, mentorshipFee, description) => {
    const newMentorApp = {
      id: Date.now(),
      jobId,
      jobTitle,
      company,
      mentorName: currentUser?.name || 'Mentor Demo',
      mentorEmail: currentUser?.email || 'mentor@gmail.com',
      mentorshipFee: mentorshipFee || 'Free',
      description: description || 'Mentorship program for internship candidates.',
      status: 'Pending'
    };
    setMentorApps(prev => [...prev, newMentorApp]);
  };

  const approveMentorApp = (id) => {
    setMentorApps(prev => prev.map(m => m.id === id ? { ...m, status: 'Approved' } : m));
  };

  const rejectMentorApp = (id) => {
    setMentorApps(prev => prev.map(m => m.id === id ? { ...m, status: 'Rejected' } : m));
  };

  // Student Mentee requesting an Approved Mentorship Program
  const requestMentorshipProgram = (mentorAppId, mentorName, jobTitle, mentorshipFee) => {
    const menteeName = currentUser?.name || 'User Demo';
    const existing = mentorships.find(m => m.mentorAppId === mentorAppId && m.menteeName === menteeName);
    if (!existing) {
      setMentorships(prev => [...prev, {
        id: Date.now(),
        mentorAppId,
        mentorName,
        menteeName,
        jobTitle,
        mentorshipFee,
        status: 'Approved'
      }]);
    }
  };

  // Mentor & Course Actions
  const addCourse = (course) => {
    setCourses(prev => [...prev, { ...course, id: Date.now(), mentorName: currentUser?.name || 'Mentor' }]);
  };

  const requestMentorship = (courseId, mentorName, menteeName) => {
    setMentorships(prev => [...prev, { id: Date.now(), courseId, mentorName, menteeName, status: 'Approved' }]);
  };

  const updateMentorshipStatus = (mentorshipId, newStatus) => {
    setMentorships(prev => prev.map(m => m.id === mentorshipId ? { ...m, status: newStatus } : m));
  };

  const deleteMentorship = (id) => {
    setMentorships(prev => prev.filter(m => m.id !== id));
  };

  // User Profile Update (Picture & Details)
  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setUsersDb(prev => {
      const updatedList = prev.map(u => u.email === currentUser.email ? { ...u, ...updatedFields } : u);
      localStorage.setItem('jt_users_db', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      currentUser, login, signup, resetPassword, logout, usersDb, deleteUser, updateUserRole, updateUserProfile,
      jobs, addJob, deleteJob,
      applications, applyForJob, updateApplicationStatus, updateApplicationDetails, deleteApplication,
      personalApps, addPersonalApp, updatePersonalAppStatus, editPersonalApp, deletePersonalApp,
      courses, addCourse,
      mentorships, requestMentorship, updateMentorshipStatus, deleteMentorship,
      mentorApps, applyToMentorJob, approveMentorApp, rejectMentorApp, requestMentorshipProgram
    }}>
      {children}
    </AppContext.Provider>
  );
};
