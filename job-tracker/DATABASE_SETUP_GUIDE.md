# 🗄️ TrackerPro 2.0 Database Setup Guide

This guide provides step-by-step instructions to connect your **TrackerPro 2.0** application to a cloud database (Firebase, Supabase, or MongoDB).

---

## ⚡ Quick Start Options

| Database Engine | Type | Setup Time | Real-time | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **LocalStorage (Default)** | Offline / In-Browser | 0 mins | No | Demo, Portfolio & Offline Testing |
| **Firebase Firestore** | NoSQL Cloud | 3 mins | Yes | Direct React integration (No backend server code needed) |
| **Supabase** | PostgreSQL SQL | 5 mins | Yes | Relational SQL queries & instant APIs |
| **MongoDB Atlas** | NoSQL MERN | 10 mins | Yes | Custom Express / Node.js Backend Server |

---

## Option 1: Firebase Firestore Setup (Recommended for React)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Click **Create Project** -> Name it `trackerpro-suite`.
3. In the sidebar, click **Build** -> **Firestore Database** -> Click **Create Database**.
4. Select **Start in Test Mode** (allows read/write during development).

### Step 2: Register Web App & Get Keys
1. In Project Overview, click the **Web icon (`</>`)** to add an app.
2. Copy your `firebaseConfig` credentials.
3. In your project root, duplicate `.env.example` to `.env` and paste your keys:

```env
VITE_FIREBASE_API_KEY=AIzaSyD-exampleKey123
VITE_FIREBASE_AUTH_DOMAIN=trackerpro-suite.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trackerpro-suite
VITE_FIREBASE_STORAGE_BUCKET=trackerpro-suite.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=9876543210
VITE_FIREBASE_APP_ID=1:9876543210:web:123abc456def
```

---

## Option 2: Supabase (PostgreSQL) Setup

### Step 1: Create Supabase Project
1. Go to [Supabase Console](https://supabase.com).
2. Click **New Project** -> Set project name `trackerpro-db` and set a database password.

### Step 2: Get API Keys
1. Go to **Project Settings** -> **API**.
2. Copy **URL** and **anon public key**.
3. Add to `.env`:

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Database Schemas & Collections

### 1. `users` Collection
```json
{
  "email": "user@gmail.com",
  "password": "user123",
  "role": "user", // "user" | "employer" | "mentor" | "admin"
  "name": "User Demo",
  "mobile": "+923001234567",
  "idCard": "12345-1234567-1",
  "avatarUrl": "data:image/png;base64,..."
}
```

### 2. `jobs` Collection
```json
{
  "id": 1,
  "title": "Frontend Developer",
  "company": "TechCorp",
  "type": "Job", // "Job" | "Internship"
  "status": "Open",
  "deadline": "2026-12-31",
  "requirements": "React, Tailwind, 2 years experience."
}
```

### 3. `applications` Collection
```json
{
  "id": 101,
  "jobId": 1,
  "applicantName": "User Demo",
  "status": "Applied", // "Applied" | "Shortlisted" | "Interview" | "Hired" | "Rejected"
  "interviewSchedule": "2026-08-10T14:00",
  "feedback": "Strong React skills demonstrated."
}
```

### 4. `mentor_applications` Collection
```json
{
  "id": 501,
  "jobId": 2,
  "jobTitle": "React Intern",
  "company": "StartupInc",
  "mentorName": "Mentor Demo",
  "mentorEmail": "mentor@gmail.com",
  "mentorshipFee": "PKR 5,000 / month",
  "description": "1-on-1 weekly mentorship, code reviews, and React interview guidance.",
  "status": "Approved" // "Pending" | "Approved" | "Rejected"
}
```
