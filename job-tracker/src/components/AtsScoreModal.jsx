import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Award, Target, BookOpen, ArrowRight } from 'lucide-react';

const AtsScoreModal = ({ job, currentUser, onClose }) => {
  const [candidateSkills, setCandidateSkills] = useState(
    'React, Tailwind CSS, JavaScript, HTML, CSS, Git, Node.js, REST API'
  );
  const [matchScore, setMatchScore] = useState(0);
  const [matchingKeywords, setMatchingKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (!job) return;

    const reqText = (job.requirements || '') + ' ' + (job.title || '') + ' ' + (job.type || '');
    // Standard tech keywords pool
    const techPool = ['react', 'javascript', 'tailwind', 'html', 'css', 'git', 'node.js', 'rest', 'api', 'cloud', 'python', 'sql', 'typescript', 'docker', 'aws', 'redux', 'entry level', 'internship', 'communication'];
    
    const lowerReq = reqText.toLowerCase();
    const jobKeywords = techPool.filter(kw => lowerReq.includes(kw));

    const userSkillsList = candidateSkills.toLowerCase().split(',').map(s => s.trim());
    
    const matched = [];
    const missing = [];

    jobKeywords.forEach(kw => {
      if (userSkillsList.some(s => s.includes(kw) || kw.includes(s))) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    // Default fallback if no keywords found in requirements text
    if (matched.length === 0 && missing.length === 0) {
      matched.push('react', 'html', 'css');
      missing.push('typescript', 'cloud integration');
    }

    const calculatedScore = Math.min(
      95,
      Math.max(45, Math.round(((matched.length + 1) / (matched.length + missing.length + 1)) * 100))
    );

    setMatchScore(calculatedScore);
    setMatchingKeywords(matched);
    setMissingKeywords(missing);

    const generatedTips = [];
    if (missing.length > 0) {
      generatedTips.push(`Add missing keywords like "${missing.slice(0, 3).join(', ')}" to your resume skills section.`);
    }
    generatedTips.push('Tailor your professional summary to highlight experience relevant to ' + (job.title || 'this position') + '.');
    generatedTips.push('Quantify your achievements (e.g. "Improved page load time by 30%").');

    setTips(generatedTips);
  }, [job, candidateSkills]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-emerald-500" /> AI Resume ATS Matcher
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              ATS Match Score: {job?.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target Company: {job?.company}</p>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Ring & Overview */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ease-out ${getScoreColor(matchScore)}`}
                strokeDasharray={`${matchScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{matchScore}%</span>
              <span className="block text-[9px] uppercase font-extrabold text-slate-400">ATS Match</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              {matchScore >= 80 ? '🔥 Strong Resume Match!' : matchScore >= 60 ? '⚡ Good Match — Moderate ATS Score' : '⚠️ Low ATS Match — Keywords Needed'}
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Our AI evaluated your profile skills against the requirements for <span className="font-bold text-slate-800 dark:text-slate-200">{job?.title}</span>.
            </p>
          </div>
        </div>

        {/* Input Skills Bar */}
        <div>
          <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-300">Your Resume Skills (Edit to recalculate)</label>
          <input
            type="text"
            value={candidateSkills}
            onChange={e => setCandidateSkills(e.target.value)}
            className="input-field w-full text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Matched vs Missing Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords ({matchingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1 pt-1">
              {matchingKeywords.map((kw, idx) => (
                <span key={idx} className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-[11px] uppercase">
              <AlertCircle className="w-3.5 h-3.5" /> Missing Keywords ({missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1 pt-1">
              {missingKeywords.map((kw, idx) => (
                <span key={idx} className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" /> AI Optimization Recommendations
          </h4>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {tips.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs shadow-lg keep-white border-0"
        >
          Got It
        </button>
      </div>
    </div>
  );
};

export default AtsScoreModal;
