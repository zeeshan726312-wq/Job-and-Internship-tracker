import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle,
  X,
  Building2,
  Code2,
  Phone,
  Mail,
  RefreshCw,
  KeyRound,
  Lock,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

const KNOWLEDGE_BASE = {
  passwords: `### 🔒 Security & Password Privacy Policy

• **Strict Confidentiality:** For personal privacy and platform security, user passwords for all panels are confidential and **NEVER** displayed, logged, or shared by the AI Assistant.
• **Signing In:** Please enter your personal password created during account registration or assigned by your administrator.
• **Forgot or Need to Change Password?**
  1. Click **Forgot Password?** on the Sign In page.
  2. Enter your registered Gmail address.
  3. Complete verification with your registered CNIC & Mobile Phone number.
  4. Create your new private password securely.`,

  authHelp: `### 🛡️ How to Sign In, Register & Recover Account

• **1. How to Sign In:**
  - Select your role (**User**, **Employer**, **Mentor**, **Admin**).
  - Enter your registered Gmail address & Password.
  - Check "Keep me signed in" if desired and click **Sign In**.

• **2. How to Register a New Account:**
  - Toggle to **Create Account** mode above.
  - Fill in Username, Gmail (\`@gmail.com\`), CNIC / ID Card number, Phone number, and Password.
  - Select your role (**User**, **Employer**, or **Mentor**) and submit.

• **3. Account Recovery (Forgot Password):**
  - Click **Forgot Password?** under the Password field.
  - Enter your registered Gmail.
  - Verify your registered CNIC & Mobile Phone number.
  - Set a new password and sign in immediately!`,

  founder: `• **Founder & Developer:** **Zeeshan Haider**
• **Role:** Visionary Founder, Web Developer & Mobile App Developer
• **Education:** Student at **COMSATS University Sahiwal Campus**
• **Registration Number:** \`SP24-BCS-077(B)\`
• **Email Address:** \`zeeshan726312@gmail.com\`
• **Phone Number:** \`0325-9819864\`
• **Detailed Profile:** He is the visionary founder, a skilled web and app developer, who designed the Job & Internship Tracker project with a strong emphasis on frontend development. The system was crafted to deliver a smooth graphical user interface and flawless workflow, ensuring that every action executes seamlessly without errors. Built with secure authentication and robust data protection, it safeguards user information while providing reliability and trust. By converting the entire manual process into a modern web-based solution, the project not only streamlines application tracking but also empowers mentors with opportunities to guide students more effectively. His dedication to frontend design, usability, and security reflects both technical expertise and a passion for creating tools that inspire growth and innovation.`,

  facultySupervisor: `• **Faculty Supervisor & Mentor:** **Sana Farooq**
• **Designation:** Professor at **COMSATS University Sahiwal Campus**
• **Profession & Skills:** Web Developer & Educator
• **Email Address:** \`sanafarooq@cuisahiwal.edu.pk\`
• **Detailed Profile:** Sana Farooq is a dedicated teacher and skilled web developer who brings both technical expertise and a passion for education into the classroom. As a university faculty supervisor, she guides students with patience and vision, helping them connect academic theory with real-world practice. Her dual role allows her to inspire innovation, foster teamwork, and mentor learners toward professional excellence in the field of web development.`,

  siteSupervisor: `• **Site Supervisor / Internship Mentor:** **Muhammad Usman**
• **Designation:** Full Stack Engineer at **Zynvex Solutions**
• **Contact Number:** \`03078370302\`
• **Email Address:** \`muhammad.usman@zynvexsolutions.com\`
• **Internship Details:** 6-Week Internship Project under Certificate ID \`ZYNVEX-CERT-0299\`.
• **Detailed Profile:** He is a passionate mentor and full-stack engineer who dedicates himself to guiding students through their internship journey. With a commitment to daily mentoring, he carefully checks progress, evaluates weekly reports, and provides constructive feedback that helps students grow both technically and professionally. His encouragement motivates learners to pursue their projects with even greater enthusiasm, while his expertise in full-stack development ensures they gain practical, industry-relevant skills. By blending discipline with inspiration, he fosters an environment where students strive for excellence and innovation.`,

  internship: `• **Organization:** **ZYNVEX (Zynvex Solutions)**
• **Internship ID / Certificate:** \`ZYNVEX-CERT-0299\`
• **Project Duration:** **6 Weeks**
• **Site Supervisor (Zynvex):** **Muhammad Usman** (Full Stack Engineer, Contact: \`03078370302\`, Email: \`muhammad.usman@zynvexsolutions.com\`)
• **Faculty Supervisor (COMSATS):** **Sana Farooq** (Professor & Web Developer, Email: \`sanafarooq@cuisahiwal.edu.pk\`)`,

  mentors: `• **1. University Faculty Supervisor (Project Mentor):** **Sana Farooq**
  - Designation: Professor at COMSATS University Sahiwal Campus
  - Role: Project Mentor & Academic Supervisor (Email: \`sanafarooq@cuisahiwal.edu.pk\`)
  - Note: Oversees academic theory, student guidance, and project development for this software project.

• **2. Site Supervisor (Project Mentor):** **Muhammad Usman**
  - Designation: Full Stack Engineer, Zynvex Solutions
  - Role: Project Mentor & Industry Supervisor (Contact: \`03078370302\`, Email: \`muhammad.usman@zynvexsolutions.com\`)
  - Note: Guides daily internship progress, report evaluations, and code reviews under \`ZYNVEX-CERT-0299\`.`,

  node: `### 🟢 Node.js & npm (Runtime & Package Manager)

• **What Node.js is:** Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 engine. npm is Node Package Manager.
• **Why Node.js is used in this project:**
  1. **Development Environment & Tooling:** Drives the local development server (Vite 8), package installation, and asset building.
  2. **Package & Dependency Management:** Manages project dependencies (\`react\`, \`react-dom\`, \`react-router-dom\`, \`firebase\`, \`tailwindcss\`, \`lucide-react\`) in \`package.json\`.
  3. **Build Execution:** Executes compilation and build scripts (\`npm run dev\`, \`npm run build\`) for deployment to Vercel.`,

  react: `### ⚛️ React 19 (Frontend UI Framework)

• **What React 19 is:** Meta's latest open-source component-based JavaScript library for building responsive user interfaces.
• **Why React 19 is used in this project:**
  1. **Modular Architecture:** Breaks the app into reusable components (\`AuthPage.jsx\`, \`DashboardOverview.jsx\`, \`ApplicationsList.jsx\`, \`EmployerPanel.jsx\`, \`MentorPanel.jsx\`, \`AdminPanel.jsx\`, \`AiAskBox.jsx\`).
  2. **Hooks & State Management:** Uses \`useState\`, \`useEffect\`, \`useRef\`, and \`useContext\` (\`AppContext.jsx\`) for authentication, role routing, theme toggling, and database sync.
  3. **Virtual DOM:** High-speed UI updates without full browser reloads.`,

  vite: `### ⚡ Vite 8 (Build Tool & Dev Server)

• **What Vite is:** A next-generation, ultra-fast build tool created by Evan You (creator of Vue.js) using native ES Modules (ESM).
• **Why Vite 8 is used in this project:**
  1. **Instant Dev Server Start:** Serves the app in milliseconds.
  2. **Hot Module Replacement (HMR):** Updates React components live without reloading state.
  3. **Rollup Production Bundling:** Optimizes JSX, CSS, and assets for Vercel cloud hosting.`,

  tailwind: `### 🎨 Tailwind CSS 3.4 (Styling Framework)

• **What Tailwind CSS is:** A utility-first CSS framework offering low-level utility classes directly inside HTML/JSX.
• **Why Tailwind CSS is used in this project:**
  1. **Modern Glassmorphic UI:** Enables sleek dark-mode glassmorphism (\`backdrop-blur-2xl\`, \`bg-slate-900/90\`, \`border-slate-800\`).
  2. **Custom Tokens & Utilities:** Directives configured in \`index.css\` and \`tailwind.config.js\`.
  3. **Responsive Grid Layouts:** Flexible grid structures (\`grid-cols-1 lg:grid-cols-12\`).`,

  javascript: `### 🟨 JavaScript (ES6+) (Core Programming Language)

• **What JavaScript is:** High-level, dynamic, multi-paradigm programming language powering modern web applications.
• **Why JavaScript is used in this project:**
  1. **Application Logic:** Powers all data state mutations, user authentication, routing guards, and AI knowledge matching.
  2. **Modern ES6+ Features:** Arrow functions, Destructuring, Promises, Async/Await, Array Methods (\`.map()\`, \`.filter()\`, \`.find()\`), and LocalStorage API.`,

  firebase: `### 🔥 Firebase (Firestore & Auth Database)

• **What Firebase is:** Google's Backend-as-a-Service (BaaS) cloud platform providing NoSQL Firestore database and Authentication.
• **Why Firebase is used in this project:**
  1. **Real-time Cloud Sync:** Synchronizes jobs, applications, and mentor requests live across all devices.
  2. **Multi-Device Login:** Allows users to sign in from phone, laptop, or desktop seamlessly.`,

  vercel: `### 📐 Vercel (Cloud Deployment Platform)

• **What Vercel is:** Premier cloud platform for hosting single-page and frontend web applications.
• **Why Vercel is used in this project:**
  1. **SPA Rewrites:** Single-page routing rewrite rules in \`vercel.json\`.
  2. **Global CDN:** Instant SSL certificates, edge network caching, and continuous deployment.`,

  router: `### 🔀 React Router v7 (Client-Side Navigation)

• **What React Router is:** The standard routing library for React single-page applications.
• **Why React Router is used in this project:**
  1. **Client-Side Navigation:** Dynamic page switching without browser reloads.
  2. **Role-Based Guards:** \`ProtectedRoute.jsx\` restricts access based on user role (\`admin\`, \`employer\`, \`mentor\`, \`user\`).`,

  techStack: `• **Frontend Framework:** **React 19** (Functional Components & Hooks)
• **Build Tool & Dev Server:** **Vite 8**
• **IDE / Development Environment:** **Visual Studio Code (VS Code)**
• **Runtime & Package Manager:** **Node.js & npm**
• **Routing & Route Guards:** **React Router v7** with custom \`ProtectedRoute\` wrappers
• **Styling System:** **Tailwind CSS 3.4** with glassmorphism & custom dark-mode system
• **Iconography:** **Lucide React Icons**
• **Cloud Database & Multi-Device Sync:** **Firebase (Firestore Database & Auth)**
• **Cloud Deployment:** **Vercel** (\`vercel.json\`)
• **AI Assistant:** Built-in AI Knowledge Bot for instant project Q&A on the Sign In page`,

  dashboards: `• **1. Applicant / User Dashboard:** Track application pipelines (Applied ➔ Interview ➔ Offer ➔ Rejected), log external applications (LinkedIn, Indeed, etc.), browse platform jobs, and request mentorship.
• **2. Employer Dashboard:** Post new job/internship openings, review applicant profiles, schedule interviews, and log recruiter feedback.
• **3. Mentor Dashboard:** Publish mentorship programs/courses, review student requests, and guide mentees.
• **4. Admin Dashboard:** System-wide operational oversight, manage user accounts & roles dynamically, moderate content, and view platform analytics.`,

  contact: `• **Founder (Zeeshan Haider):** Email: \`zeeshan726312@gmail.com\` | Phone: \`0325-9819864\`
• **Faculty Supervisor (Sana Farooq):** Email: \`sanafarooq@cuisahiwal.edu.pk\` (COMSATS University Sahiwal)
• **Site Supervisor (Muhammad Usman):** Email: \`muhammad.usman@zynvexsolutions.com\` | Phone: \`03078370302\` (Zynvex Solutions)`
};

const AiAskBox = () => {
  const context = useContext(AppContext);
  const jobs = context?.jobs || [];
  const courses = context?.courses || [];
  const mentorApps = context?.mentorApps || [];

  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello! I am the **TrackerPro AI Knowledge Assistant**.\n\nAsk me about **How to Login/Register**, **Account Recovery**, **Mentorship Offerings & Fees**, **Jobs & Internships**, **Founder Zeeshan Haider**, or **Supervisors Sana Farooq & Muhammad Usman**!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const getDynamicMentorships = () => {
    let result = `### 🎓 Platform Mentorship Programs, Domains & Monthly Fees\n\n`;

    const platformOfferings = [
      {
        mentorName: 'Mentor Demo',
        domain: 'React & Frontend Masterclass',
        fee: 'PKR 5,000 / month',
        description: '1-on-1 weekly mentorship, code reviews, and React interview guidance.',
        email: 'mentor@gmail.com'
      }
    ];

    if (mentorApps && mentorApps.length > 0) {
      mentorApps.forEach(m => {
        if (!platformOfferings.some(o => o.mentorName.toLowerCase() === (m.mentorName || '').toLowerCase())) {
          platformOfferings.push({
            mentorName: m.mentorName || 'Mentor',
            domain: m.jobTitle || 'Mentorship Program',
            fee: m.mentorshipFee || 'Contact Mentor',
            description: m.description || '1-on-1 technical mentorship and career guidance.',
            email: m.mentorEmail || ''
          });
        }
      });
    }

    if (courses && courses.length > 0) {
      courses.forEach(c => {
        if (!platformOfferings.some(o => o.domain.toLowerCase() === (c.title || '').toLowerCase())) {
          platformOfferings.push({
            mentorName: c.mentorName || 'Mentor',
            domain: c.title || 'Course Mentorship',
            fee: c.fee || 'Free / Included',
            description: c.description || 'Structured course and practical training.',
            email: ''
          });
        }
      });
    }

    platformOfferings.forEach((item, idx) => {
      result += `• **${idx + 1}. ${item.mentorName} — ${item.domain}**\n`;
      result += `  - **Domain:** ${item.domain}\n`;
      result += `  - **Mentorship Fee:** \`${item.fee}\`\n`;
      result += `  - **Details:** ${item.description}\n`;
      if (item.email) result += `  - **Contact:** \`${item.email}\`\n`;
      result += `\n`;
    });

    result += `• **📌 Project Supervisors Note:** **Sana Farooq** (Faculty Supervisor, COMSATS Sahiwal) and **Muhammad Usman** (Site Supervisor, Zynvex Solutions) are the **Project Supervisors & Mentors** overseeing this software project, and do not offer paid mentorship course listings inside the app.`;

    return result;
  };

  const getDynamicJobs = () => {
    let result = `### 🏢 Jobs & Internships Offered by Organizations\n\n`;

    const defaultListings = [
      { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Job', status: 'Open', deadline: '2026-12-31', requirements: 'React, Tailwind, 2 years experience.' },
      { id: 2, title: 'React Intern', company: 'StartupInc', type: 'Internship', status: 'Open', deadline: '2026-08-15', requirements: 'Basic HTML/CSS, willing to learn.' },
      { id: 3, title: 'Full Stack Engineering Intern', company: 'Zynvex Solutions', type: '6-Week Internship', status: 'Active (Certificate ID: ZYNVEX-CERT-0299)', deadline: 'Ongoing', requirements: 'Full-stack development, Git, React & Node.js under mentor Muhammad Usman.' }
    ];

    const listings = (jobs && jobs.length > 0) ? jobs : defaultListings;

    listings.forEach((item, idx) => {
      result += `• **${idx + 1}. ${item.company} — ${item.title}**\n`;
      result += `  - **Opportunity Type:** **${item.type || 'Job'}**\n`;
      result += `  - **Organization:** **${item.company}**\n`;
      result += `  - **Status & Deadline:** ${item.status || 'Open'} ${item.deadline ? `(Deadline: \`${item.deadline}\`)` : ''}\n`;
      if (item.requirements) result += `  - **Requirements:** ${item.requirements}\n`;
      result += `\n`;
    });

    return result;
  };

  const generateAnswer = (query) => {
    const q = query.toLowerCase().trim();
    const isYesNoReq = q.includes('yes or no') || q.startsWith('is ') || q.startsWith('does ') || q.startsWith('can ') || q.startsWith('has ') || q.startsWith('are ') || q.startsWith('was ');

    // ── STRICT PRIVACY: NEVER EXPOSE PASSWORDS ───────────────────────
    if (
      q.includes('password') || 
      q.includes('passwords') || 
      q.includes('admin pass') || 
      q.includes('user pass') || 
      q.includes('employer pass') || 
      q.includes('mentor pass') ||
      q.includes('give me password') ||
      q.includes('show password') ||
      q.includes('panel password') ||
      q.includes('what is the password') ||
      q.includes('tell me password') ||
      q.includes('share password')
    ) {
      return KNOWLEDGE_BASE.passwords;
    }

    // ── LOGIN, REGISTER & RECOVERY MATCHERS ───────────────────────────
    if (
      q.includes('how to log') || 
      q.includes('how to sign') || 
      q.includes('forgot password') || 
      q.includes('reset password') || 
      q.includes('recover') || 
      q.includes('register') || 
      q.includes('create account') || 
      q.includes('sign up') || 
      q.includes('login help') || 
      q.includes('cannot login') ||
      q.includes('cant login') ||
      q.includes('credential') ||
      q.includes('gmail')
    ) {
      return KNOWLEDGE_BASE.authHelp;
    }

    // ── MENTORSHIP OFFERINGS, DOMAINS & FEES DETECTOR ──────────────────
    if (
      q.includes('offering mentorship') || 
      q.includes('offer mentorship') || 
      q.includes('mentorship fee') || 
      q.includes('mentorship domain') || 
      q.includes('fee in which domain') || 
      q.includes('mentorship course') || 
      q.includes('mentorship program') ||
      q.includes('mentorships offered')
    ) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, our verified mentors offer mentorship programs in multiple domains** (React, Frontend, Web Dev, Full-Stack) with transparent monthly fee details (e.g., PKR 5,000 / month, Free University Mentorship).`;
      }
      return getDynamicMentorships();
    }

    // ── JOBS & INTERNSHIPS BY ORGANIZATIONS DETECTOR ─────────────────
    if (
      q.includes('organization') || 
      q.includes('company') || 
      q.includes('offered by') || 
      q.includes('job listing') || 
      q.includes('internship listing') || 
      q.includes('jobs offered') || 
      q.includes('internships offered') || 
      q.includes('available job') || 
      q.includes('available internship') ||
      q.includes('hiring')
    ) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, organizations such as TechCorp, StartupInc, and Zynvex Solutions offer jobs and internships** directly on this platform.`;
      }
      return getDynamicJobs();
    }

    // ── SPECIFIC LANGUAGE / TOOL DETECTORS ─────────────────────────────
    if (q.includes('node') || q.includes('npm')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, Node.js and npm are used as the development runtime and package manager** to install project dependencies and execute build scripts.`;
      }
      return KNOWLEDGE_BASE.node;
    }

    if (q.includes('react')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, the application is built using React 19** with functional components, hooks, and Context API.`;
      }
      return KNOWLEDGE_BASE.react;
    }

    if (q.includes('vite')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, Vite 8 is used as the next-generation dev server and build tool** for fast HMR and bundling.`;
      }
      return KNOWLEDGE_BASE.vite;
    }

    if (q.includes('tailwind') || q.includes('css')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, Tailwind CSS 3.4 is used for utility-first styling**, glassmorphism, and dark mode.`;
      }
      return KNOWLEDGE_BASE.tailwind;
    }

    if (q.includes('javascript') || q.includes('js') || q.includes('es6')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, modern JavaScript (ES6+) is the core programming language** driving all client-side logic.`;
      }
      return KNOWLEDGE_BASE.javascript;
    }

    if (q.includes('firebase') || q.includes('firestore')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, Firebase (Firestore & Auth) is used for real-time cloud data sync** and multi-device login.`;
      }
      return KNOWLEDGE_BASE.firebase;
    }

    if (q.includes('vercel') || q.includes('deploy')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, the project is configured for cloud deployment on Vercel** using \`vercel.json\`.`;
      }
      return KNOWLEDGE_BASE.vercel;
    }

    if (q.includes('router') || q.includes('navigation')) {
      if (isYesNoReq) {
        return `**YES!** ✅\n\n**Yes, React Router v7 is used for single-page routing** and ProtectedRoute guards.`;
      }
      return KNOWLEDGE_BASE.router;
    }

    // ── SMART YES / NO INTENT DETECTOR ─────────────────────────────────
    if ((q.includes('sana') || q.includes('farooq') || q.includes('faculty') || q.includes('professor')) && isYesNoReq) {
      return `**YES!** ✅\n\n**Yes, Sana Farooq is the Faculty Supervisor & Mentor** at COMSATS University Sahiwal Campus (Email: \`sanafarooq@cuisahiwal.edu.pk\`).`;
    }

    if ((q.includes('usman') || q.includes('site supervisor') || q.includes('zynvex mentor')) && isYesNoReq) {
      return `**YES!** ✅\n\n**Yes, Muhammad Usman (Full Stack Engineer at Zynvex Solutions)** is the Site Supervisor & Internship Mentor for this project.`;
    }

    if ((q.includes('database') || q.includes('db')) && isYesNoReq) {
      return `**YES!** ✅\n\n**Yes, it is connected to a cloud database (Firebase Firestore)** for real-time data sync across all devices.`;
    }

    if ((q.includes('zeeshan') || q.includes('founder') || q.includes('developer')) && isYesNoReq) {
      return `**YES!** ✅\n\n**Yes, Zeeshan Haider is the Founder & Developer** of this project (COMSATS University Sahiwal, Reg: \`SP24-BCS-077(B)\`).`;
    }

    if (q.includes('yes or no')) {
      return `**YES!** ✅\n\n**Yes, all mentioned tech stack, database sync, and multi-role features are active in this project.**`;
    }

    // ── GENERAL TOPIC MATCHERS ─────────────────────────────────────────
    if (q.includes('sana') || q.includes('farooq') || q.includes('faculty') || q.includes('professor') || q.includes('university supervisor')) {
      return `### 👩‍🏫 University Faculty Supervisor\n\n${KNOWLEDGE_BASE.facultySupervisor}`;
    }

    if (q.includes('usman') || q.includes('site supervisor') || q.includes('zynvex mentor')) {
      return `### 👨‍💼 Site Supervisor (Zynvex)\n\n${KNOWLEDGE_BASE.siteSupervisor}`;
    }

    if (q.includes('mentor') || q.includes('supervisors') || q.includes('guides')) {
      return `### 👥 Project Mentors & Supervisors\n\n${KNOWLEDGE_BASE.mentors}`;
    }

    if (q.includes('founder') || q.includes('zeeshan') || q.includes('who made') || q.includes('developer') || q.includes('creator') || q.includes('comsats') || q.includes('reg')) {
      return `### 👨‍💻 Founder & Developer Details\n\n${KNOWLEDGE_BASE.founder}`;
    }

    if (q.includes('internship') || q.includes('zynvex') || q.includes('cert') || q.includes('duration') || q.includes('weeks')) {
      return `### 🏢 Internship Details\n\n${KNOWLEDGE_BASE.internship}`;
    }

    if (q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('code') || q.includes('vs code') || q.includes('tools')) {
      return `### ⚡ Technologies & Coding Languages\n\n${KNOWLEDGE_BASE.techStack}`;
    }

    if (q.includes('dashboard') || q.includes('role') || q.includes('feature') || q.includes('4') || q.includes('four')) {
      return `### 📊 Platform Roles & 4 Main Dashboards\n\n${KNOWLEDGE_BASE.dashboards}`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      return `### 📞 Contact Information\n\n${KNOWLEDGE_BASE.contact}`;
    }

    // Default Overview
    return `### 🚀 Job & Internship Tracker — AI Knowledge Base\n\n` +
      `• **Privacy & Security:** All user account passwords are strictly personal, encrypted, and protected.\n` +
      `• **Founder:** Zeeshan Haider (COMSATS Sahiwal, \`SP24-BCS-077(B)\`)\n` +
      `• **Supervisors:** Sana Farooq (Faculty Supervisor, COMSATS) & Muhammad Usman (Site Supervisor, Zynvex Solutions)\n` +
      `• **Tech Stack:** React 19, Vite 8, Tailwind CSS, Node.js, Firebase Firestore Cloud API, Vercel`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    if (!isOpen) setIsOpen(true);

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReplyText = generateAnswer(query);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiReplyText };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 300);
  };

  const quickQuestions = [
    "🔒 Password Privacy Policy",
    "🛡️ How to login & recover account",
    "🎓 Mentorship offerings & fees",
    "🏢 Jobs & Internships by organizations",
    "👨‍💻 Founder Zeeshan Haider",
    "👩‍🏫 Supervisors Sana & Usman"
  ];

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-extrabold text-xs sm:text-sm text-indigo-600 dark:text-indigo-300 mb-1 mt-1">{line.replace('### ', '')}</h4>;
      }
      
      const formattedLine = line.split(/(\*\*.*?\*\*|\`.*?\`)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] border border-indigo-200 dark:border-slate-800 font-bold">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      return <p key={idx} className="text-xs leading-relaxed my-0.5 text-slate-700 dark:text-slate-200">{formattedLine}</p>;
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/95 border border-indigo-200 dark:border-indigo-500/40 backdrop-blur-2xl rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* COMPACT DEFAULT CARD: Know about us */}
      {!isOpen ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-slate-50 via-indigo-50/80 to-slate-50 dark:from-slate-900 dark:via-indigo-950/70 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/40 rounded-3xl cursor-pointer transition-all duration-300 hover:border-indigo-400 shadow-md group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-600/25 border border-indigo-300 dark:border-indigo-400/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300 group-hover:scale-105 transition-transform shadow-sm">
              <Bot className="w-5 h-5 animate-pulse text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  AI Knowledge & Login Assistant
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Active
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Click to view Login Help, Account Recovery, Founder & Supervisors
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5 shrink-0 keep-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open AI Chat</span>
          </div>
        </div>
      ) : (
        /* EXPANDED FULL CHAT VIEW */
        <div className="space-y-0">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-100 via-indigo-100/80 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 border-b border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-400/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-sm">
                <Bot className="w-5 h-5 animate-pulse text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    AI Knowledge & Login Assistant
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">Login Guides, Account Recovery, Node, React, Vite, Firebase & Supervisors</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-950/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              title="Minimize chat box"
            >
              <X className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Minimize
            </button>
          </div>

          {/* Quick Recommended Question Chips */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Quick Topics:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-600/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-white text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <span>{q}</span>
                <ChevronRight className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              </button>
            ))}
          </div>

          {/* Chat History Container */}
          <div className="p-4 space-y-3.5 max-h-72 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs shadow-md leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-semibold keep-white'
                      : 'bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-indigo-500/30 text-slate-800 dark:text-slate-100 rounded-tl-none space-y-1.5'
                  }`}
                >
                  {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-600 dark:text-indigo-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-600 dark:text-slate-300 text-xs pl-2 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
                <span className="italic">AI Assistant is writing response...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Interactive Chat Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-indigo-500/30 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about Login Help, Account Recovery, Founder, Mentors, Node, React..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1 keep-white cursor-pointer"
              title="Send Question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAskBox;
