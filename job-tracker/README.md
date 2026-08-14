# 💼 Job & Internship Tracker (TrackerPro 2.0)

A comprehensive, full-stack client-side career command center built with **React 19**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Firebase Firestore REST Cloud API**. Deployed live on Vercel.

---

## 🌐 Live Demo & Deployment

- **Live URL:** [Job & Internship Tracker (Vercel)](https://job-and-internship-tracker-gamma.vercel.app/)

---

## 📸 GUI Screenshots & Application Previews

| Auth & AI Assistant | System Admin Panel |
| :---: | :---: |
| ![Auth Page](./GUI%20ScreenShots/Screenshot%202026-08-13%20134241.png) | ![Admin Panel](./GUI%20ScreenShots/Screenshot%202026-08-13%20134331.png) |

| Applicant Workspace | Employer & Recruiter Console |
| :---: | :---: |
| ![Applicant Workspace](./GUI%20ScreenShots/Screenshot%202026-08-13%20134404.png) | ![Employer Console](./GUI%20ScreenShots/Screenshot%202026-08-13%20134800.png) |

| Mentorship Portal |
| :---: |
| ![Mentorship Portal](./GUI%20ScreenShots/Screenshot%202026-08-13%20134850.png) |

---

## 📅 Weekly Development Progress Log (What Was Done)

### 🗓️ Week 1: Core Foundation & UI Architecture
- Initialized React 19 + Vite project with Tailwind CSS & custom dark-mode glassmorphic styling.
- Created `AppContext` with `localStorage` persistence for client-side state management.
- Implemented core routing, role-based layout system (`Layout.jsx`), and `ProtectedRoute` guards for 4 distinct user roles (Applicant, Employer, Mentor, Admin).
- Designed glassmorphic authentication forms (`AuthPage.jsx`) supporting Login, Registration, and Identity Verification Password Recovery.

### 🗓️ Week 2: Role Dashboards & Module Development
- Built **Applicant Workspace (`DashboardOverview.jsx`)** for viewing metrics, searching jobs, and tracking applications.
- Built **Employer Console (`EmployerPanel.jsx`)** for posting jobs/internships, reviewing candidate CVs, scheduling interviews, and leaving recruiter notes.
- Built **Mentor Portal (`MentorPanel.jsx`)** for posting standalone mentorship programs and reviewing student mentee applications.
- Built **Administrator Control Panel (`AdminPanel.jsx`)** with user database management, role assignments, job listings control, and mentorship approval workflow.
- Created **Dual-Mode Application Tracker (`ApplicationsList.jsx`)** supporting both platform applications and external job postings (LinkedIn, Indeed, Google, etc.).

### 🗓️ Week 3: Multi-Tab Realtime Sync & AI Assistant Integration
- Added **Interactive AI Assistant (`AiAskBox.jsx`)** trained on Founder details (Zeeshan Haider), Supervisors (Sana Farooq - COMSATS Sahiwal, Muhammad Usman - Zynvex Solutions), Zynvex Internship ID (`ZYNVEX-CERT-0299`), and platform capabilities.
- Implemented **BroadcastChannel API** for 0ms instant multi-tab same-browser synchronization across panels.
- Added candidate CV uploads (`.pdf`, `.docx`) and portfolio link submission capabilities.
- Implemented built-in Messaging Center across all user portals.

### 🗓️ Week 4: Firebase Cloud Database & Real-Time Sync Engine
- Integrated **Firebase Firestore REST Cloud API (`dbService.js`)** for cross-device & cross-browser data persistence.
- Enabled 2-second real-time polling to sync user accounts, listings, applications, and mentorship proposals live across multiple devices.
- Added user profile editing modal in `Layout.jsx` for updating display name, password, phone, CNIC, and profile photo.

### 🗓️ Week 5: Performance Optimization, Instant Option Actions & Cross-Device Avatar Sync
- **Instant (0ms) Registration & Status Actions**: Fixed 60-second HTTP REST caching by optimizing `dbService.getItem` headers (`Cache-Control: no-cache, no-store`).
- **Smart Data Merging**: Upgraded `syncFromCloud()` in `AppContext.jsx` to preserve fresh local user signups and status updates (`Approved`, `Rejected`, `Shortlisted`, `Hired`) without background polling rollbacks.
- **Cross-Device Profile DP Sync**: Integrated HTML5 Canvas image compression in `Layout.jsx` (200x200 JPEG, ~15KB) and sanitized legacy base64 strings to stay safely under Firestore's 1MB payload limit (`PATCH 200 OK`).
- **UI & Welcome Banner Cleanups**: Standardized panel welcome banners to cleanly display `Hi, <username>` across all dashboards.

---

## 🔮 Roadmap: What Needs To Be Added Next (Future Enhancements)

- [ ] **Automated Push Notifications & Email Alerts**: Send automated email notifications (via EmailJS or SendGrid) when an application status changes (e.g. `Interview Scheduled`, `Hired`, `Approved`).
- [ ] **Resume Builder & AI ATS Match Score**: Integrate a PDF resume generator tool and AI-driven ATS resume match score for job requirements.
- [ ] **Direct Chat / Video Meetings**: Add real-time 1-on-1 chat or WebRTC video interview links directly inside the Recruiter and Mentor portals.
- [ ] **Advanced Analytics & Export Reports**: Add CSV/PDF export for application history, recruiter hiring pipelines, and admin user activity logs.
- [ ] **Social Media / OAuth Sign-In**: Add Google / GitHub OAuth 2.0 single sign-on authentication.

---

## 🔑 Pre-Configured Demo Accounts

| Role | Gmail Address | Password |
| :--- | :--- | :--- |
| **Applicant (User)** | `user@gmail.com` | `user123` |
| **Employer** | `employer@gmail.com` | `emp123` |
| **Mentor** | `mentor@gmail.com` | `men123` |
| **System Admin** | `admin@gmail.com` | `admin123` |

---

## 🛠️ Project Setup & Installation

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```