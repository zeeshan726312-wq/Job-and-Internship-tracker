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
  GraduationCap,
  Sparkles,
  Layers,
  MapPin
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
        deadline: formData.deadline,
        link: formData.portfolioUrl || formData.githubUrl || '#',
        notes: formData.notes,
        status: formData.status,
        applicantName: formData.applicantName
      });
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  return (
    <div className="panel-container space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FilePlus className="w-6 h-6 text-indigo-400" /> Log Application Form
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit formal application entries to platform listings or track external job submissions.
          </p>
        </div>

        {formData.platformJobId && (
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Linked Platform Listing
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="card bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Application logged successfully! Redirecting to Tracker...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-3 font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Applicant Profile Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> 1. Applicant Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Full Name *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    placeholder="user@gmail.com"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Contact Mobile</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="applicantPhone"
                    value={formData.applicantPhone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: Position Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> 2. Position & Organization
            </h3>
            
            {/* Category Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Job' }))}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formData.type === 'Job' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Job Position
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Internship' }))}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formData.type === 'Internship' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Internship
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Position Title *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Engineer or UI/UX Intern"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Company / Organization *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Google, Microsoft, TechCorp"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
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
                  className="form-select text-xs py-2.5 bg-slate-950/80 border-slate-800 text-white"
                >
                  <option value="Fresh / Intern">Fresh Graduate / Student</option>
                  <option value="Entry Level">Entry Level (0-1 yrs)</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid Level">Mid Level (2-4 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Work Mode</label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="form-select text-xs py-2.5 bg-slate-950/80 border-slate-800 text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Salary / Stipend Expectation</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="salaryExpectation"
                    value={formData.salaryExpectation}
                    onChange={handleChange}
                    placeholder="e.g. $85,000/yr or $1,500/mo"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 3: External Links & Notes */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-400" /> 3. Application Links & Milestones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Application Link / Portfolio</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://myportfolio.com or job portal link"
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Target Deadline</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field w-full !pl-11 py-2.5 text-xs bg-slate-950/80 border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Notes / Job Requirements</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add interview notes, recruiter contacts, or application requirements..."
                className="form-textarea text-xs bg-slate-950/80 border-slate-800 text-white min-h-[90px]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="btn secondary py-2.5 px-5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary py-2.5 px-6 text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit & Track Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
