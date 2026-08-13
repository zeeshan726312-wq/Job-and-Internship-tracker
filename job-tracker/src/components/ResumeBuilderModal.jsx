import { useState } from 'react';
import { X, FileText, Download, Sparkles, CheckCircle2, User, Briefcase, GraduationCap, Code } from 'lucide-react';

const ResumeBuilderModal = ({ currentUser, onClose }) => {
  const [resumeData, setResumeData] = useState({
    fullName: currentUser?.name || currentUser?.username || 'Zeeshan Haider',
    email: currentUser?.email || 'user@gmail.com',
    phone: currentUser?.mobile || '+92 300 1234567',
    location: 'Lahore, Pakistan',
    title: 'Full-Stack Software Engineer',
    summary: 'Passionate and results-driven software engineer with expertise in React, modern JavaScript, Tailwind CSS, and cloud integrations. Adept at building responsive web applications and scalable user experiences.',
    skills: 'React 19, JavaScript (ES6+), Node.js, Tailwind CSS, Firebase, REST APIs, Git, Vite, HTML5/CSS3',
    experience: 'Software Engineering Intern — Zynvex Solutions (Jul 2026 - Present)\n• Developed responsive UI components and state management architecture.\n• Integrated Firebase Firestore REST APIs for realtime cloud sync.\n\nFrontend Developer — TechCorp (2025)\n• Built reusable React components and optimized web app performance.',
    education: 'Bachelor of Science in Computer Science (BSCS) — COMSATS University (2022 - 2026)\n• Major: Software Engineering & Web Development',
    projects: 'Job & Internship Tracker Pro (TrackerPro 2.0)\n• Multi-role platform for candidates, recruiters, mentors, and administrators.'
  });

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

  const handlePrintPDF = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.fullName} — Resume</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 20px; }
            .name { font-size: 28px; font-weight: bold; color: #059669; margin: 0; }
            .title { font-size: 16px; font-weight: 600; color: #475569; margin: 5px 0; }
            .contact { font-size: 12px; color: #64748b; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; letter-spacing: 0.5px; }
            .content { font-size: 12px; color: #334155; white-space: pre-line; }
            .skills-badge { display: inline-block; background: #ecfdf5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 11px; margin: 2px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${resumeData.fullName}</h1>
            <div class="title">${resumeData.title}</div>
            <div class="contact">${resumeData.email} | ${resumeData.phone} | ${resumeData.location}</div>
          </div>

          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="content">${resumeData.summary}</div>
          </div>

          <div class="section">
            <div class="section-title">Key Skills</div>
            <div class="content">${resumeData.skills.split(',').map(s => `<span class="skills-badge">${s.trim()}</span>`).join('')}</div>
          </div>

          <div class="section">
            <div class="section-title">Work Experience</div>
            <div class="content">${resumeData.experience}</div>
          </div>

          <div class="section">
            <div class="section-title">Education</div>
            <div class="content">${resumeData.education}</div>
          </div>

          <div class="section">
            <div class="section-title">Projects</div>
            <div class="content">${resumeData.projects}</div>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWin.document.write(html);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-5 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" /> Interactive PDF Resume Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Build your professional resume and export to PDF with 1-click.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Print Button */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'edit' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Edit Details
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'preview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Live CV Preview
            </button>
          </div>

          <button
            onClick={handlePrintPDF}
            className="btn bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 keep-white shadow-md border-0"
          >
            <Download className="w-4 h-4" /> Download / Print PDF Resume
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {activeTab === 'edit' ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={e => setResumeData({ ...resumeData, fullName: e.target.value })}
                    className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="form-label font-bold text-slate-700 dark:text-slate-300">Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.title}
                    onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                    className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="form-label font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                    className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="form-label font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="form-label font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    value={resumeData.location}
                    onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                    className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="form-label font-bold text-slate-700 dark:text-slate-300">Professional Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="form-textarea text-xs bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 min-h-[70px]"
                />
              </div>

              <div>
                <label className="form-label font-bold text-slate-700 dark:text-slate-300">Technical & Soft Skills (comma separated)</label>
                <input
                  type="text"
                  value={resumeData.skills}
                  onChange={e => setResumeData({ ...resumeData, skills: e.target.value })}
                  className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="form-label font-bold text-slate-700 dark:text-slate-300">Work Experience</label>
                <textarea
                  value={resumeData.experience}
                  onChange={e => setResumeData({ ...resumeData, experience: e.target.value })}
                  className="form-textarea text-xs bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 min-h-[90px]"
                />
              </div>

              <div>
                <label className="form-label font-bold text-slate-700 dark:text-slate-300">Education</label>
                <textarea
                  value={resumeData.education}
                  onChange={e => setResumeData({ ...resumeData, education: e.target.value })}
                  className="form-textarea text-xs bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 min-h-[70px]"
                />
              </div>

              <div>
                <label className="form-label font-bold text-slate-700 dark:text-slate-300">Key Projects</label>
                <textarea
                  value={resumeData.projects}
                  onChange={e => setResumeData({ ...resumeData, projects: e.target.value })}
                  className="form-textarea text-xs bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 min-h-[70px]"
                />
              </div>
            </div>
          ) : (
            /* LIVE CV PREVIEW */
            <div className="p-6 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-md space-y-4 font-sans text-xs">
              <div className="border-b border-emerald-600 pb-3">
                <h1 className="text-2xl font-bold text-emerald-700">{resumeData.fullName}</h1>
                <h3 className="text-xs font-bold text-slate-600">{resumeData.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{resumeData.email} | {resumeData.phone} | {resumeData.location}</p>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-[11px] text-slate-800 border-b border-slate-200 pb-1 mb-1">Professional Summary</h4>
                <p className="text-slate-600 leading-relaxed">{resumeData.summary}</p>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-[11px] text-slate-800 border-b border-slate-200 pb-1 mb-1.5">Key Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.split(',').map((s, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-[11px] text-slate-800 border-b border-slate-200 pb-1 mb-1">Experience</h4>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">{resumeData.experience}</p>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-[11px] text-slate-800 border-b border-slate-200 pb-1 mb-1">Education</h4>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">{resumeData.education}</p>
              </div>

              <div>
                <h4 className="font-extrabold uppercase text-[11px] text-slate-800 border-b border-slate-200 pb-1 mb-1">Projects</h4>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">{resumeData.projects}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderModal;
