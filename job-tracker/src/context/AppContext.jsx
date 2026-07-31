import { createContext, useState, useEffect, useRef } from 'react';
import { dbService } from '../services/dbService';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// Mock Initial Data (Fallback if cloud & localStorage are empty)
const initialJobs = [
  { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Job', status: 'Open', deadline: '2026-12-31', requirements: 'React, Tailwind, 2 years experience.' },
  { id: 2, title: 'React Intern', company: 'StartupInc', type: 'Internship', status: 'Open', deadline: '2026-08-15', requirements: 'Basic HTML/CSS, willing to learn.' },
];

const initialApplications = [
  { id: 101, jobId: 1, applicantName: 'User Demo', applicantEmail: 'user@gmail.com', status: 'Applied', interviewSchedule: '', feedback: '' },
];

const initialPersonalApps = [
  { id: 301, applicantName: 'User Demo', applicantEmail: 'user@gmail.com', title: 'Software Engineer', company: 'Google', type: 'Job', status: 'Applied', link: 'https://careers.google.com' }
];

const initialCourses = [
  { id: 401, mentorName: 'Mentor Demo', title: 'React Masterclass', description: 'Advanced React concepts and interview prep.' }
];

const initialMentorships = [
  { id: 201, mentorName: 'Mentor Demo', menteeName: 'User Demo', menteeEmail: 'user@gmail.com', courseId: 401, status: 'Approved' }
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

const getStoredItem = (key, fallback, storage = localStorage) => {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Theme State — read directly (not via JSON.parse, as 'dark'/'light' are plain strings)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('jt_theme') || 'dark'; } catch { return 'dark'; }
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    try { localStorage.setItem('jt_theme', theme); } catch { /* ignore */ }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const sessionUser = getStoredItem('currentUser_session', null, sessionStorage);
    if (sessionUser) return sessionUser;

    const isRemembered = localStorage.getItem('jt_remember_me') === 'true';
    if (isRemembered) {
      return getStoredItem('currentUser', null, localStorage);
    }
    return null;
  });

  // Data States
  const [usersDb, setUsersDb] = useState(() => getStoredItem('jt_users_db', mockUsers) || mockUsers);
  const [jobs, setJobs] = useState(() => getStoredItem('jt_jobs', initialJobs) || initialJobs);
  const [applications, setApplications] = useState(() => getStoredItem('jt_applications', initialApplications) || initialApplications);
  const [personalApps, setPersonalApps] = useState(() => getStoredItem('jt_personal_apps', initialPersonalApps) || initialPersonalApps);
  const [courses, setCourses] = useState(() => getStoredItem('jt_courses', initialCourses) || initialCourses);
  const [mentorships, setMentorships] = useState(() => getStoredItem('jt_mentorships', initialMentorships) || initialMentorships);
  const [mentorApps, setMentorApps] = useState(() => getStoredItem('jt_mentor_apps', initialMentorApps) || initialMentorApps);
  const [messages, setMessages] = useState(() => getStoredItem('jt_messages', []) || []);

  // Refs to eliminate stale closure issues in interval callbacks
  const usersDbRef = useRef(usersDb);
  const jobsRef = useRef(jobs);
  const applicationsRef = useRef(applications);
  const personalAppsRef = useRef(personalApps);
  const coursesRef = useRef(courses);
  const mentorshipsRef = useRef(mentorships);
  const mentorAppsRef = useRef(mentorApps);
  const messagesRef = useRef(messages);

  // Keep refs synchronized with state
  useEffect(() => { usersDbRef.current = usersDb; }, [usersDb]);
  useEffect(() => { jobsRef.current = jobs; }, [jobs]);
  useEffect(() => { applicationsRef.current = applications; }, [applications]);
  useEffect(() => { personalAppsRef.current = personalApps; }, [personalApps]);
  useEffect(() => { coursesRef.current = courses; }, [courses]);
  useEffect(() => { mentorshipsRef.current = mentorships; }, [mentorships]);
  useEffect(() => { mentorAppsRef.current = mentorApps; }, [mentorApps]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // BroadcastChannel for instant multi-tab same-browser synchronization
  const broadcastSync = (key = 'ALL') => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('tracker_sync_channel');
        channel.postMessage({ key, timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // silent fallback
    }
  };

  // Centralized State Update + LocalStorage + Firebase Firestore Cloud Sync Helper
  const updateCollection = (key, newData, setter, ref) => {
    setter(newData);
    ref.current = newData;
    try {
      localStorage.setItem(key, JSON.stringify(newData));
    } catch (e) {
      console.warn(`[LocalStorage Error] Key: ${key}`, e);
    }
    dbService.setItem(key, newData);
    broadcastSync(key);
  };

  // Load latest live data from Firebase Cloud on startup & set up 2-second real-time polling
  useEffect(() => {
    let isMounted = true;

    const syncFromCloud = async () => {
      try {
        const allCloud = await dbService.fetchAllCollections();
        if (!isMounted) return;

        if (allCloud.jt_users_db && JSON.stringify(allCloud.jt_users_db) !== JSON.stringify(usersDbRef.current)) {
          setUsersDb(allCloud.jt_users_db);
          usersDbRef.current = allCloud.jt_users_db;
          localStorage.setItem('jt_users_db', JSON.stringify(allCloud.jt_users_db));

          // Sync currentUser's profile (avatar, name, etc.) from the updated db
          const sessionUser = sessionStorage.getItem('currentUser_session');
          if (sessionUser) {
            try {
              const parsed = JSON.parse(sessionUser);
              const freshProfile = allCloud.jt_users_db.find(u => u.email === parsed.email);
              if (freshProfile) {
                const merged = { ...parsed, ...freshProfile };
                if (JSON.stringify(merged) !== sessionUser) {
                  setCurrentUser(merged);
                  sessionStorage.setItem('currentUser_session', JSON.stringify(merged));
                  if (localStorage.getItem('jt_remember_me') === 'true') {
                    localStorage.setItem('currentUser', JSON.stringify(merged));
                  }
                }
              }
            } catch { /* ignore JSON parse errors */ }
          }
        }
        if (allCloud.jt_jobs && JSON.stringify(allCloud.jt_jobs) !== JSON.stringify(jobsRef.current)) {
          setJobs(allCloud.jt_jobs);
          jobsRef.current = allCloud.jt_jobs;
          localStorage.setItem('jt_jobs', JSON.stringify(allCloud.jt_jobs));
        }
        if (allCloud.jt_applications && JSON.stringify(allCloud.jt_applications) !== JSON.stringify(applicationsRef.current)) {
          setApplications(allCloud.jt_applications);
          applicationsRef.current = allCloud.jt_applications;
          localStorage.setItem('jt_applications', JSON.stringify(allCloud.jt_applications));
        }
        if (allCloud.jt_personal_apps && JSON.stringify(allCloud.jt_personal_apps) !== JSON.stringify(personalAppsRef.current)) {
          setPersonalApps(allCloud.jt_personal_apps);
          personalAppsRef.current = allCloud.jt_personal_apps;
          localStorage.setItem('jt_personal_apps', JSON.stringify(allCloud.jt_personal_apps));
        }
        if (allCloud.jt_courses && JSON.stringify(allCloud.jt_courses) !== JSON.stringify(coursesRef.current)) {
          setCourses(allCloud.jt_courses);
          coursesRef.current = allCloud.jt_courses;
          localStorage.setItem('jt_courses', JSON.stringify(allCloud.jt_courses));
        }
        if (allCloud.jt_mentorships && JSON.stringify(allCloud.jt_mentorships) !== JSON.stringify(mentorshipsRef.current)) {
          setMentorships(allCloud.jt_mentorships);
          mentorshipsRef.current = allCloud.jt_mentorships;
          localStorage.setItem('jt_mentorships', JSON.stringify(allCloud.jt_mentorships));
        }
        if (allCloud.jt_mentor_apps && JSON.stringify(allCloud.jt_mentor_apps) !== JSON.stringify(mentorAppsRef.current)) {
          setMentorApps(allCloud.jt_mentor_apps);
          mentorAppsRef.current = allCloud.jt_mentor_apps;
          localStorage.setItem('jt_mentor_apps', JSON.stringify(allCloud.jt_mentor_apps));
        }
        if (allCloud.jt_messages && JSON.stringify(allCloud.jt_messages) !== JSON.stringify(messagesRef.current)) {
          setMessages(allCloud.jt_messages);
          messagesRef.current = allCloud.jt_messages;
          localStorage.setItem('jt_messages', JSON.stringify(allCloud.jt_messages));
        }
      } catch (err) {
        console.warn('[Cloud Sync Error]:', err);
      }
    };

    // Initial load
    syncFromCloud();

    // High-frequency Real-Time Polling (Every 2 Seconds) across devices
    const pollInterval = setInterval(() => {
      syncFromCloud();
    }, 2000);

    // Multi-Tab Sync on Same Device via BroadcastChannel
    let channel;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('tracker_sync_channel');
      channel.onmessage = () => {
        setJobs(getStoredItem('jt_jobs', jobsRef.current));
        setApplications(getStoredItem('jt_applications', applicationsRef.current));
        setPersonalApps(getStoredItem('jt_personal_apps', personalAppsRef.current));
        setUsersDb(getStoredItem('jt_users_db', usersDbRef.current));
        setCourses(getStoredItem('jt_courses', coursesRef.current));
        setMentorships(getStoredItem('jt_mentorships', mentorshipsRef.current));
        setMentorApps(getStoredItem('jt_mentor_apps', mentorAppsRef.current));
        setMessages(getStoredItem('jt_messages', messagesRef.current));
      };
    }

    // Window storage listener fallback
    const handleStorageEvent = (e) => {
      if (!e.key) return;
      if (e.key === 'jt_jobs') setJobs(getStoredItem('jt_jobs', jobsRef.current));
      if (e.key === 'jt_applications') setApplications(getStoredItem('jt_applications', applicationsRef.current));
      if (e.key === 'jt_personal_apps') setPersonalApps(getStoredItem('jt_personal_apps', personalAppsRef.current));
      if (e.key === 'jt_users_db') setUsersDb(getStoredItem('jt_users_db', usersDbRef.current));
      if (e.key === 'jt_courses') setCourses(getStoredItem('jt_courses', coursesRef.current));
      if (e.key === 'jt_mentorships') setMentorships(getStoredItem('jt_mentorships', mentorshipsRef.current));
      if (e.key === 'jt_mentor_apps') setMentorApps(getStoredItem('jt_mentor_apps', mentorAppsRef.current));
      if (e.key === 'jt_messages') setMessages(getStoredItem('jt_messages', messagesRef.current));
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Sync CurrentUser role if updated by Admin
  useEffect(() => {
    if (currentUser && currentUser.email) {
      const dbUser = usersDb.find(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (dbUser && dbUser.role !== currentUser.role) {
        const updatedCurrent = { ...currentUser, role: dbUser.role };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(updatedCurrent);
        sessionStorage.setItem('currentUser_session', JSON.stringify(updatedCurrent));
        if (localStorage.getItem('jt_remember_me') === 'true') {
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersDb]);

  // Auth Actions
  const login = (email, password, role, rememberMe = false) => {
    const user = usersDbRef.current.find(u => u && u.email && u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('currentUser_session', JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('jt_remember_me', 'true');
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jt_remember_me');
      }
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials or role selection.' };
  };

  const signup = (userData) => {
    const existing = usersDbRef.current.find(u => u && u.email && u.email.toLowerCase() === (userData.email || '').toLowerCase());
    if (existing) {
      return { success: false, message: 'Gmail address already registered.' };
    }
    const newUser = { ...userData };
    const updatedUsers = [...usersDbRef.current, newUser];
    updateCollection('jt_users_db', updatedUsers, setUsersDb, usersDbRef);
    return { success: true, user: newUser };
  };

  const resetPassword = (email, newPassword) => {
    const user = usersDbRef.current.find(u => u && u.email && u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return { success: false, message: 'Gmail address not found in system database.' };
    }
    const updatedUsers = usersDbRef.current.map(u => (u && u.email && u.email.toLowerCase() === (email || '').toLowerCase()) ? { ...u, password: newPassword } : u);
    updateCollection('jt_users_db', updatedUsers, setUsersDb, usersDbRef);
    return { success: true, message: 'Password updated successfully! You can now sign in.' };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser_session');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jt_remember_me');
  };

  const deleteUser = (email) => {
    const updatedUsers = usersDbRef.current.filter(u => u.email !== email);
    updateCollection('jt_users_db', updatedUsers, setUsersDb, usersDbRef);
  };

  const updateUserRole = (email, newRole) => {
    const updatedUsers = usersDbRef.current.map(u => u.email === email ? { ...u, role: newRole } : u);
    updateCollection('jt_users_db', updatedUsers, setUsersDb, usersDbRef);
  };

  // Job Actions
  const addJob = (job) => {
    const newJob = { ...job, id: Date.now() };
    const updatedJobs = [...jobsRef.current, newJob];
    updateCollection('jt_jobs', updatedJobs, setJobs, jobsRef);
  };

  const deleteJob = (jobId) => {
    const updatedJobs = jobsRef.current.filter(j => String(j.id) !== String(jobId));
    updateCollection('jt_jobs', updatedJobs, setJobs, jobsRef);
  };

  // Application Actions
  const applyForJob = (jobId, applicantName) => {
    const nameToUse = applicantName || currentUser?.name || currentUser?.username || 'User Demo';
    const emailToUse = currentUser?.email || 'user@gmail.com';
    const existing = applicationsRef.current.find(a => String(a.jobId) === String(jobId) && 
      (a.applicantName === nameToUse || (emailToUse && a.applicantEmail === emailToUse))
    );
    if (!existing) {
      const newApp = { 
        id: Date.now(), 
        jobId, 
        applicantName: nameToUse, 
        applicantEmail: emailToUse,
        status: 'Applied', 
        interviewSchedule: '', 
        feedback: '' 
      };
      const updatedApps = [...applicationsRef.current, newApp];
      updateCollection('jt_applications', updatedApps, setApplications, applicationsRef);
    }
  };

  const addApplicationRecord = (appData) => {
    const newApp = { 
      id: Date.now(), 
      jobId: appData.jobId, 
      applicantName: appData.applicantName || 'Applicant', 
      applicantEmail: appData.applicantEmail || '',
      status: appData.status || 'Applied', 
      interviewSchedule: appData.interviewSchedule || '', 
      feedback: appData.feedback || '' 
    };
    const updatedApps = [...applicationsRef.current, newApp];
    updateCollection('jt_applications', updatedApps, setApplications, applicationsRef);
    return newApp;
  };

  const updateApplicationStatus = (appId, newStatus) => {
    const updatedApps = applicationsRef.current.map(app => String(app.id) === String(appId) ? { ...app, status: newStatus } : app);
    updateCollection('jt_applications', updatedApps, setApplications, applicationsRef);
  };

  const updateApplicationDetails = (appId, updatedFields) => {
    const updatedApps = applicationsRef.current.map(app => String(app.id) === String(appId) ? { ...app, ...updatedFields } : app);
    updateCollection('jt_applications', updatedApps, setApplications, applicationsRef);
  };

  const deleteApplication = (id) => {
    const updatedApps = applicationsRef.current.filter(a => String(a.id) !== String(id));
    updateCollection('jt_applications', updatedApps, setApplications, applicationsRef);
  };

  // Personal Tracker Actions
  const addPersonalApp = (app) => {
    const newApp = { 
      ...app, 
      id: Date.now(), 
      applicantName: app.applicantName || currentUser?.name || 'User Demo',
      applicantEmail: app.applicantEmail || currentUser?.email || 'user@gmail.com'
    };
    const updatedApps = [...personalAppsRef.current, newApp];
    updateCollection('jt_personal_apps', updatedApps, setPersonalApps, personalAppsRef);
  };

  const updatePersonalAppStatus = (appId, newStatus) => {
    const updatedApps = personalAppsRef.current.map(app => String(app.id) === String(appId) ? { ...app, status: newStatus } : app);
    updateCollection('jt_personal_apps', updatedApps, setPersonalApps, personalAppsRef);
  };

  const editPersonalApp = (appId, updatedFields) => {
    const updatedApps = personalAppsRef.current.map(app => String(app.id) === String(appId) ? { ...app, ...updatedFields } : app);
    updateCollection('jt_personal_apps', updatedApps, setPersonalApps, personalAppsRef);
  };

  const deletePersonalApp = (id) => {
    const updatedApps = personalAppsRef.current.filter(a => String(a.id) !== String(id));
    updateCollection('jt_personal_apps', updatedApps, setPersonalApps, personalAppsRef);
  };

  // Mentor Application Actions
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
    const updatedMentorApps = [...mentorAppsRef.current, newMentorApp];
    updateCollection('jt_mentor_apps', updatedMentorApps, setMentorApps, mentorAppsRef);
  };

  const postMentorshipProgram = ({ jobTitle, company, mentorshipFee, description }) => {
    const newMentorApp = {
      id: Date.now(),
      jobId: Date.now(),
      jobTitle,
      company: company || 'Career Mentorship',
      mentorName: currentUser?.name || 'Mentor Demo',
      mentorEmail: currentUser?.email || 'mentor@gmail.com',
      mentorshipFee: mentorshipFee || 'Free',
      description: description || 'Comprehensive mentorship program for students.',
      status: 'Pending'
    };
    const updatedMentorApps = [...mentorAppsRef.current, newMentorApp];
    updateCollection('jt_mentor_apps', updatedMentorApps, setMentorApps, mentorAppsRef);
  };

  const approveMentorApp = (id) => {
    const updatedMentorApps = mentorAppsRef.current.map(m => String(m.id) === String(id) ? { ...m, status: 'Approved' } : m);
    updateCollection('jt_mentor_apps', updatedMentorApps, setMentorApps, mentorAppsRef);
  };

  const rejectMentorApp = (id) => {
    const updatedMentorApps = mentorAppsRef.current.map(m => String(m.id) === String(id) ? { ...m, status: 'Rejected' } : m);
    updateCollection('jt_mentor_apps', updatedMentorApps, setMentorApps, mentorAppsRef);
  };

  // Student Mentee Actions
  const requestMentorshipProgram = (mentorAppId, mentorName, jobTitle, mentorshipFee) => {
    const menteeName = currentUser?.name || 'User Demo';
    const menteeEmail = currentUser?.email || 'user@gmail.com';
    const existing = mentorshipsRef.current.find(m => String(m.mentorAppId) === String(mentorAppId) && (m.menteeName === menteeName || m.menteeEmail === menteeEmail));
    if (!existing) {
      const newMentorship = {
        id: Date.now(),
        mentorAppId,
        mentorName,
        menteeName,
        menteeEmail,
        jobTitle,
        mentorshipFee,
        status: 'Pending'
      };
      const updatedMentorships = [...mentorshipsRef.current, newMentorship];
      updateCollection('jt_mentorships', updatedMentorships, setMentorships, mentorshipsRef);
    }
  };

  // Mentor & Course Actions
  const addCourse = (course) => {
    const newCourse = { ...course, id: Date.now(), mentorName: currentUser?.name || 'Mentor' };
    const updatedCourses = [...coursesRef.current, newCourse];
    updateCollection('jt_courses', updatedCourses, setCourses, coursesRef);
  };

  const requestMentorship = (courseId, mentorName, menteeName) => {
    const newMentorship = { id: Date.now(), courseId, mentorName, menteeName, status: 'Pending' };
    const updatedMentorships = [...mentorshipsRef.current, newMentorship];
    updateCollection('jt_mentorships', updatedMentorships, setMentorships, mentorshipsRef);
  };

  const updateMentorshipStatus = (mentorshipId, newStatus) => {
    const updatedMentorships = mentorshipsRef.current.map(m => String(m.id) === String(mentorshipId) ? { ...m, status: newStatus } : m);
    updateCollection('jt_mentorships', updatedMentorships, setMentorships, mentorshipsRef);
  };

  const deleteMentorship = (id) => {
    const updatedMentorships = mentorshipsRef.current.filter(m => String(m.id) !== String(id));
    updateCollection('jt_mentorships', updatedMentorships, setMentorships, mentorshipsRef);
  };

  // User Profile Update
  const updateUserProfile = (updatedFields) => {
    if (!currentUser) return;
    const oldEmail = currentUser.email;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    sessionStorage.setItem('currentUser_session', JSON.stringify(updatedUser));
    if (localStorage.getItem('jt_remember_me') === 'true') {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    const updatedList = usersDbRef.current.map(u => 
      (u && u.email && u.email.toLowerCase() === (oldEmail || '').toLowerCase()) 
        ? { ...u, ...updatedFields } 
        : u
    );
    updateCollection('jt_users_db', updatedList, setUsersDb, usersDbRef);
  };

  // ── MESSAGING ──
  const sendMessage = ({ subject, body, recipients, recipientEmails }) => {
    const newMsg = {
      id: Date.now(),
      senderName: currentUser?.name || 'Sender',
      senderEmail: currentUser?.email || '',
      senderRole: currentUser?.role || 'user',
      subject: subject || '(No Subject)',
      body,
      recipients,       // 'all' | 'selective'
      recipientEmails: recipientEmails || [],
      sentAt: new Date().toISOString(),
      readBy: []
    };
    const updated = [newMsg, ...messagesRef.current];
    updateCollection('jt_messages', updated, setMessages, messagesRef);
  };

  const markMessageRead = (msgId) => {
    const email = currentUser?.email;
    const updated = messagesRef.current.map(m =>
      String(m.id) === String(msgId) && !m.readBy.includes(email)
        ? { ...m, readBy: [...m.readBy, email] }
        : m
    );
    updateCollection('jt_messages', updated, setMessages, messagesRef);
  };

  const deleteMessage = (msgId) => {
    const updated = messagesRef.current.filter(m => String(m.id) !== String(msgId));
    updateCollection('jt_messages', updated, setMessages, messagesRef);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      currentUser, login, signup, resetPassword, logout, usersDb, deleteUser, updateUserRole, updateUserProfile,
      jobs, addJob, deleteJob,
      applications, applyForJob, addApplicationRecord, updateApplicationStatus, updateApplicationDetails, deleteApplication,
      personalApps, addPersonalApp, updatePersonalAppStatus, editPersonalApp, deletePersonalApp,
      courses, addCourse,
      mentorships, requestMentorship, updateMentorshipStatus, deleteMentorship,
      mentorApps, applyToMentorJob, postMentorshipProgram, approveMentorApp, rejectMentorApp, requestMentorshipProgram,
      messages, sendMessage, markMessageRead, deleteMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};
