# Job & Internship Tracker — Project Documentation

**Project Title:** Job and Internship Tracker  
**Tech Stack:** React 19, Vite, React Router v7, Tailwind CSS, Lucide Icons, Context API  
**Date:** July 2026  
**Version:** 1.0.0  

---

## 1. Executive Summary

The **Job and Internship Tracker** is a feature-rich, full-stack client-side Web Application designed to streamline the career development process for job seekers, employers, mentors, and administrators. 

The platform offers a unified portal where job seekers can track their job/internship application pipeline, employers can post openings and evaluate applicants, mentors can offer guidance programs, and administrators retain complete operational oversight.

---

## 2. System Architecture & Tech Stack

### 2.1 Core Technologies
- **Frontend Framework:** React 19 (Functional Components, Hooks)
- **Build Tool & Dev Server:** Vite 8
- **Routing:** React Router v7 (`react-router-dom`) with custom `ProtectedRoute` route guards.
- **Styling System:** Tailwind CSS 3.4 with custom glassmorphism and modern dark-mode responsive styling.
- **Iconography:** Lucide React icons.
- **State Management & Persistence:** React Context API (`AppContext`) backed by `localStorage` persistence for offline capability without external backend dependencies.
- **Deployment Platform:** Vercel (Configured with single-page app `vercel.json` rewrites).

---

## 3. User Roles & Authentication

The application features a role-based access control system supporting 4 distinct user personas:

| Role | Access Level & Capabilities |
| :--- | :--- |
| **User (Job Seeker)** | Apply to platform jobs, track external application pipeline, request mentorship, view dashboard metrics. |
| **Employer** | Post new job/internship openings, review applicants, schedule interviews, provide feedback notes. |
| **Mentor** | Create mentorship courses/programs, review mentee requests, manage ongoing mentorship sessions. |
| **Admin** | Full system control, manage users & roles, delete jobs/applications, system-wide analytics. |

### 3.1 Demo Accounts Pre-Configured
- **User:** `user@gmail.com` | Password: `user123`
- **Employer:** `employer@gmail.com` | Password: `emp123`
- **Mentor:** `mentor@gmail.com` | Password: `men123`
- **Admin:** `admin@gmail.com` | Password: `admin123`

---

## 4. Key Modules & Features Implemented So Far

### 4.1 Authentication & Profile Module (`AuthPage.jsx` & `AiAskBox.jsx`)
- **Multi-Role Login & Registration:** Dedicated form with role selection, full name, mobile number, and national ID fields.
- **Password Reset Workflow:** Built-in account recovery allowing password reset via verified email or identity.
- **Remember Me Functionality:** Session persistence using `localStorage` & Firebase Authentication.
- **Interactive AI Assistant ("Know About Us"):** Built-in intelligent chatbot trained on Founder details (Zeeshan Haider), Faculty Supervisor (Sana Farooq - COMSATS Sahiwal), Site Supervisor (Muhammad Usman - Zynvex Solutions), Zynvex Internship ID (`ZYNVEX-CERT-0299`), Tech Stack, and 4 platform dashboards.

### 4.2 Navigation & Layout (`Layout.jsx` & `ProtectedRoute.jsx`)
- **Responsive Header Navigation:** Displays active page, logged-in user profile, role badge, and mobile drawer menu.
- **Route Guarding:** `ProtectedRoute` restricts access to specific portals based on active user role.

### 4.3 Dashboard Overview (`DashboardOverview.jsx`)
- **Metric Analytics Cards:** Real-time counters for Total Openings, Platform Applications, Personal Tracked Jobs, and Active Mentorships.
- **Job Search & Filtering:** Filter job listings by keyword, job type (`Job` vs `Internship`), and status.
- **Quick Apply Action:** One-click navigation to application form with pre-filled job data.

### 4.4 Application Form & Personal Tracker (`ApplicationForm.jsx` & `ApplicationsList.jsx`)
- **Dual-Mode Tracker:**
  1. *Platform Applications:* Apply directly to openings created by employers on the platform.
  2. *External Applications:* Log applications made on third-party sites (LinkedIn, Indeed, Google, etc.).
- **Pipeline Kanban/Status View:** Track progress across standard hiring stages:
  - `Applied` ➔ `Interview Scheduled` ➔ `Offer Received` ➔ `Rejected` / `Pending`.
- **Status Filter Tabs & Editing:** Filter by application stage, update status live, or delete records.

### 4.5 Employer Portal (`EmployerPanel.jsx`)
- **Job Posting Form:** Specify job title, company name, position type, requirements, and deadline.
- **Applicant Management:** Review candidates who applied to posted positions.
- **Interview Scheduling & Feedback:** Change candidate status, set interview dates/times, and leave recruiter notes.

### 4.6 Mentor Portal (`MentorPanel.jsx`)
- **Course & Program Creation:** Publish mentorship programs (e.g., *React Masterclass & Interview Prep*).
- **Mentorship Requests:** Review student requests, accept/decline applications, and track mentees.

### 4.7 Admin Control Panel (`AdminPanel.jsx`)
- **System Metrics & Oversight:** View platform stats across users, jobs, applications, and courses.
- **User Management Table:** Search users, modify user roles dynamically, and remove accounts.
- **Content Moderation:** Clean up outdated jobs, applications, or invalid entries.

---

## 5. Data Schema & Models

### 5.1 User Entity
```json
{
  "email": "string",
  "password": "string",
  "role": "user | employer | mentor | admin",
  "name": "string",
  "mobile": "string",
  "idCard": "string"
}
```

### 5.2 Job Opening Entity
```json
{
  "id": "number",
  "title": "string",
  "company": "string",
  "type": "Job | Internship",
  "status": "Open | Closed",
  "deadline": "YYYY-MM-DD",
  "requirements": "string"
}
```

### 5.3 Application Entity
```json
{
  "id": "number",
  "jobId": "number",
  "applicantName": "string",
  "status": "Applied | Interview Scheduled | Offer Received | Rejected",
  "interviewSchedule": "string",
  "feedback": "string"
}
```

---

## 6. Project Structure

```text
job-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # Global Header, Navigation, and Shell
│   │   └── ProtectedRoute.jsx   # Role-Based Guard Wrapper
│   ├── context/
│   │   └── AppContext.jsx       # State Management & LocalStorage Sync
│   ├── pages/
│   │   ├── AdminPanel.jsx       # Admin Controls & User Management
│   │   ├── ApplicationForm.jsx  # Apply / External Track Form
│   │   ├── ApplicationsList.jsx # Status Pipeline & Applications List
│   │   ├── AuthPage.jsx         # Login, Register, Forgot Password
│   │   ├── DashboardOverview.jsx# Overview Dashboard & Job Feed
│   │   ├── EmployerPanel.jsx    # Post Jobs & Review Applicants
│   │   ├── MentorPanel.jsx      # Mentorship Courses & Requests
│   │   └── UserPanel.jsx        # Candidate Profile Summary
│   ├── App.jsx                  # Main Router Setup
│   ├── index.css                # Tailwind Directives & Base Styles
│   └── main.jsx                 # Application Entry Point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json                  # SPA Rewrite Configuration for Vercel
```

---

## 7. How to Export This Document to PDF

1. **Option A (VS Code Extension):**
   - Install the extension **"Markdown PDF"** or **"Markdown Preview Enhanced"**.
   - Open `PROJECT_DOCUMENTATION.md`, right-click inside the editor, and select **Markdown PDF: Export (pdf)**.

2. **Option B (Browser Print to PDF):**
   - Open `PROJECT_DOCUMENTATION.md` in GitHub, VS Code preview, or your browser.
   - Press `Ctrl + P` (or `Cmd + P`), set Destination to **Save as PDF**, and click **Save**.

3. **Option C (Google Docs / Microsoft Word):**
   - Copy the content of `PROJECT_DOCUMENTATION.md`.
   - Paste into Google Docs or Word.
   - Go to `File > Download > PDF Document (.pdf)`.
