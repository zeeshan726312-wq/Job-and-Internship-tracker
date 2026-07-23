import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  FilePlus, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Calendar, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

const ApplicationForm = () => {
  const { currentUser, jobs, applyForJob, addPersonalApp } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillJobId = searchParams.get('jobId');

  const [formData, setFormData] = useState({
    applicantName: currentUser?.name || '',
    applicantEmail: currentUser?.email || '',
    applicantPhone: currentUser?.mobile || '',
    title: '',
    company: '',
    type: 'Job', // Job or Internship
    experienceLevel: 'Entry Level',
    workMode: 'Remote',
    salaryExpectation: '',
    deadline: new Date().toISOString().split('T')[0],
    portfolioUrl: '',
    githubUrl: '',
    notes: '',
    status: 'Applied',
    platformJobId: null
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If a jobId was passed in URL query param, prefill from available platform jobs
  useEffect(() => {
    if (prefillJobId && jobs.length > 0) {
      const selectedJob = jobs.find(j => j.id === Number(prefillJobId) || j.id === prefillJobId);
      if (selectedJob) {
        setFormData(prev => ({
          ...prev,
          title: selectedJob.title || '',
          company: selectedJob.company || '',
          type: selectedJob.type || 'Job',
          deadline: selectedJob.deadline || prev.deadline,
          notes: selectedJob.requirements ? `Requirements: ${selectedJob.requirements}` : '',
          platformJobId: selectedJob.id
        }));
      }
    }
  }, [prefillJobId, jobs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.applicantName.trim()) {
      setError('Please provide applicant full name.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please specify the Job or Internship title.');
      return;
    }
    if (!formData.company.trim()) {
      setError('Please specify the company or organization name.');
      return;
    }

    if (formData.platformJobId) {
      // Platform Job Application
      applyForJob(formData.platformJobId, formData.applicantName);
    } else {
      // Personal Application Tracker Entry
      addPersonalApp({
        title: formData.title,
        company: formData.company,
        type: formData.type,
        experienceLevel: formData.experienceLevel,
        workMode: formData.workMode,
        salaryExpectation: formData.salaryExpectation,
        link: formData.portfolioUrl || formData.githubUrl || '#',
        notes: formData.notes,
        status: formData.status,
        deadline: formData.deadline
      });
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  return (
    <div className="panel-container max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="btn secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold border border-primary/30">
            Role: {currentUser?.role || 'Applicant'}
          </span>
        </div>
      </div>

      <div className="card border border-border p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary text-white rounded-xl shadow-lg">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primaryText">Application Details Form</h2>
            <p className="text-sm text-secondaryText">
              Submit details for a Job or Internship application to keep track of your career progress.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-semibold">Application Logged Successfully!</p>
              <p className="text-[11px] text-emerald-400/80">Redirecting to your Applications dashboard...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Type Segmented Control */}
          <div className="bg-black/20 p-1.5 rounded-xl border border-border flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'Job' }))}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                formData.type === 'Job' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Full-time / Part-time Job
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'Internship' }))}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                formData.type === 'Internship' 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Internship Program
            </button>
          </div>

          {/* Section 1: Personal Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primaryText flex items-center gap-2 uppercase tracking-wider text-xs">
              <User className="w-4 h-4 text-primary" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    placeholder="user@gmail.com"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Contact / Mobile</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="applicantPhone"
                    value={formData.applicantPhone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Position Details */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-primaryText flex items-center gap-2 uppercase tracking-wider text-xs">
              <Briefcase className="w-4 h-4 text-primary" /> {formData.type} & Company Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Position / Role Title *</label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer or UI/UX Intern"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Company / Organization *</label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, Microsoft, TechCorp"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="form-select text-xs py-2.5"
                >
                  <option value="Fresh / Intern">Fresh Graduate / Student</option>
                  <option value="Entry Level">Entry Level (0-1 yrs)</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid Level">Mid Level (2-4 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Work Location Mode</label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="form-select text-xs py-2.5"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Salary / Stipend Expectation</label>
                <div className="relative flex items-center">
                  <DollarSign className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="salaryExpectation"
                    value={formData.salaryExpectation}
                    onChange={handleChange}
                    placeholder="e.g. $50,000 /yr or $500 /mo"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Links & Supporting Details */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-primaryText flex items-center gap-2 uppercase tracking-wider text-xs">
              <LinkIcon className="w-4 h-4 text-primary" /> Links & Deadline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Application Date / Deadline</label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Portfolio / LinkedIn Link</label>
                <div className="relative flex items-center">
                  <LinkIcon className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">GitHub / Resume URL</label>
                <div className="relative flex items-center">
                  <LinkIcon className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="input-field w-full pl-11 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Cover Letter / Job Requirements Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add key requirements, interview notes, or personal follow-up reminders..."
                className="form-textarea text-xs"
                rows={4}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="btn secondary py-2 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary py-2.5 px-6 text-xs font-semibold shadow-lg shadow-primary/25"
            >
              <Send className="w-4 h-4" /> Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
