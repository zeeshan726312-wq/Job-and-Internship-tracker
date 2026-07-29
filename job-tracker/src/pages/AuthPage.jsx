import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import AiAskBox from '../components/AiAskBox';
import signinPic from '../../../Untitled design.png';
import { 
  LogIn, 
  UserPlus, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ArrowLeft, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  CreditCard,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Send,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  Fingerprint,
  ArrowRight,
  ChevronRight,
  Star,
  Sun,
  Moon
} from 'lucide-react';

const AuthPage = () => {
  const { login, signup, resetPassword, usersDb, theme, toggleTheme } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Gmail, 2: Verification, 3: New Password
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [idCard, setIdCard] = useState('');
  const [username, setUsername] = useState('');

  // Recovery Verification States
  const [verifyIdCard, setVerifyIdCard] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const validateGmail = (mail) => mail && mail.includes('@') && mail.endsWith('@gmail.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (isLogin) {
      const res = login(email, password, role, rememberMe);
      if (res.success) {
        if (role === 'admin') navigate('/admin');
        else if (role === 'employer') navigate('/employer');
        else if (role === 'mentor') navigate('/mentor');
        else navigate('/');
      } else {
        setError(res.message || res.error || 'Invalid credentials or role selection.');
      }
    } else {
      if (!username.trim()) {
        setError('Please enter a Username / Display Name');
        return;
      }
      if (!validateGmail(email)) {
        setError('Please enter a valid Gmail address (must end with @gmail.com)');
        return;
      }
      if (!idCard.trim()) {
        setError('Please enter a valid CNIC / ID Card number');
        return;
      }
      if (!mobileNumber.trim()) {
        setError('Please enter a phone number');
        return;
      }

      const res = signup({
        email,
        password,
        role,
        name: username.trim(),
        username: username.trim(),
        mobile: mobileNumber,
        idCard: idCard,
      });
      if (res.success) {
        setSuccessMessage('Account created successfully! Please sign in.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setUsername('');
        setMobileNumber('');
        setIdCard('');
      } else {
        setError(res.message || res.error || 'Registration failed.');
      }
    }
  };

  // Step 1: Submit Registered Gmail for Account Verification
  const handleInitiateReset = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !validateGmail(email)) {
      setError('Please enter a valid Gmail address (@gmail.com).');
      return;
    }

    const safeUsersDb = Array.isArray(usersDb) ? usersDb : [];
    const userExists = safeUsersDb.find(u => u && u.email && u.email.toLowerCase() === email.toLowerCase());
    if (!userExists) {
      setError('No registered account found with this Gmail address.');
      return;
    }

    setForgotStep(2);
    setSuccessMessage(`Account found for ${email}. Please enter your registered CNIC and Phone number.`);
  };

  // Step 2: Verification Check via CNIC & Phone
  const handleVerifyStep = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const safeUsersDb = Array.isArray(usersDb) ? usersDb : [];
    const targetUser = safeUsersDb.find(u => u && u.email && u.email.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      setError('User record not found.');
      return;
    }

    const cleanUserMobile = (targetUser.mobile || '').replace(/\D/g, '');
    const cleanVerifyMobile = verifyPhone.replace(/\D/g, '');
    const cleanUserIdCard = (targetUser.idCard || '').replace(/[\s-]/g, '');
    const cleanVerifyIdCard = verifyIdCard.replace(/[\s-]/g, '');

    const matchId = cleanUserIdCard === cleanVerifyIdCard;
    const matchPhone = cleanUserMobile === cleanVerifyMobile || cleanUserMobile.endsWith(cleanVerifyMobile) || cleanVerifyMobile.endsWith(cleanUserMobile);

    if ((matchId && matchPhone) || (!targetUser.idCard && !targetUser.mobile)) {
      setForgotStep(3);
      setSuccessMessage('Identity verified! You can now set your new password.');
    } else {
      setError('Security Verification Failed. The CNIC or Phone number does not match the account records for this Gmail.');
    }
  };

  // Step 3: Update Password in Database
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password do not match.');
      return;
    }

    const res = resetPassword(email, newPassword);
    if (res.success) {
      setSuccessMessage('Password updated successfully! Redirecting to Sign In...');
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotStep(1);
        setIsLogin(true);
        setPassword(newPassword);
        setError('');
        setSuccessMessage('');
      }, 2000);
    } else {
      setError(res.message || res.error || 'Failed to update password.');
    }
  };

  const resetForgotState = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    setVerifyIdCard('');
    setVerifyPhone('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
  };

  const getRoleIcon = (currentRole) => {
    switch(currentRole) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'employer': return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'mentor': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'user':
      default: return <UserCheck className="w-4 h-4 text-indigo-400" />;
    }
  };

  // ── Forgot Password Screen ─────────────────────────────────────────
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12 relative overflow-hidden font-sans">
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.14] bg-cover bg-center bg-no-repeat z-0 filter brightness-90 contrast-110"
          style={{ backgroundImage: `url(${signinPic})` }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 relative z-10">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Account Recovery</h2>
            <p className="text-slate-400 text-xs">
              Step {forgotStep} of 3 • {
                forgotStep === 1 ? 'Enter Registered Gmail' :
                forgotStep === 2 ? 'Verify CNIC & Phone' :
                'Set New Password'
              }
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Registered Gmail */}
          {forgotStep === 1 && (
            <form onSubmit={handleInitiateReset} className="space-y-4">
              <div>
                <label className="form-label text-xs">Registered Gmail Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Proceed to Identity Verification
              </button>
            </form>
          )}

          {/* STEP 2: Identity Verification via CNIC & Phone */}
          {forgotStep === 2 && (
            <form onSubmit={handleVerifyStep} className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-slate-300">
                  <p className="font-bold text-white mb-0.5">Identity Verification for {email}</p>
                  <p className="text-[11px] text-slate-400">
                    Please enter the registered CNIC / ID Card number and Phone number associated with this account to confirm ownership.
                  </p>
                </div>

                <div>
                  <label className="form-label text-xs">Registered CNIC / ID Card Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 12345-1234567-1"
                      value={verifyIdCard}
                      onChange={(e) => setVerifyIdCard(e.target.value)}
                      className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs">Registered Phone Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 03001234567"
                      value={verifyPhone}
                      onChange={(e) => setVerifyPhone(e.target.value)}
                      className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="btn secondary flex-1 text-xs py-2.5 font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn primary flex-1 text-xs font-bold py-2.5"
                >
                  Verify Identity
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="form-label text-xs">New Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field w-full !pl-11 !pr-11 py-2.5 text-sm bg-slate-950/80"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center justify-center p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Confirm New Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field w-full !pl-11 !pr-11 py-2.5 text-sm bg-slate-950/80"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm font-bold shadow-lg shadow-indigo-500/25"
              >
                Update Password
              </button>
            </form>
          )}

          <button
            onClick={resetForgotState}
            className="w-full text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Main Hero Landing & Auth Screen ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12 relative overflow-hidden font-sans">
      {/* Light / Dark Mode Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-all backdrop-blur-md shadow-lg"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-400" />
          )}
        </button>
      </div>

      {/* Full-Page Background Image (Spread ONLY on Sign In Page) */}
      {isLogin && !isForgotPassword && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src={signinPic} 
            alt="Sign In Full Page Background" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.6] contrast-[1.1] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/65 to-indigo-950/80 backdrop-blur-[1px]" />
        </div>
      )}

      {/* Background Ambient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.25] bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-950/40 z-0"
      />

      {/* Radial Lights */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Container */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10 py-4">
        
        {/* LEFT COLUMN: Ultra-Pro Hero Landing Section */}
        <div className="lg:col-span-7 space-y-5 text-left pt-2">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold tracking-wide shadow-inner shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>TrackerPro Next-Gen Career Command Center</span>
          </div>

          {/* Large Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
            <span className="auth-hero-title">A New Era Begins:</span> <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm keep-gradient">
              Step Into Professional Life
            </span>
          </h1>

          {/* Subtext Description */}
          <p className="text-white text-sm md:text-base leading-relaxed max-w-xl font-medium keep-white">
            Empowering students, recruiters, and mentors in one unified platform. Track applications, organize candidate listings, and accelerate career growth with state-of-the-art tools.
          </p>

          {/* Action Button Link in Eye-Catching Distinct Color */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a 
              href="#auth-card" 
              onClick={(e) => {
                e.preventDefault();
                setIsForgotPassword(false);
                setIsLogin(true);
                setError('');
                setSuccessMessage('');
                document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  document.getElementById('signin-email')?.focus();
                }, 250);
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border border-cyan-200/50 group cursor-pointer"
            >
              <span>Step Into Your Future</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-semibold backdrop-blur-md">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Unified Career Ecosystem</span>
            </div>
          </div>

          {/* Role Badges Grid */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
              <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Applicant</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Employer</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
              <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Mentor</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign In / Register Glassmorphic Form Card */}
        <div id="auth-card" className="lg:col-span-5 scroll-mt-4">
          <div className="w-full bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 space-y-4">
            
            {/* Brand Header inside card */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {isLogin ? 'Sign In' : 'Create Your Account'}
              </h2>
              <p className="text-slate-400 text-xs">
                {isLogin 
                  ? 'Select your role and enter credentials to continue.' 
                  : 'Sign up to start tracking jobs and internships.'
                }
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-950/90 p-1.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isLogin 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 keep-white' 
                    : 'text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white font-bold'
                }`}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  !isLogin 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 keep-white' 
                    : 'text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white font-bold'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Register
              </button>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="form-label text-xs">Account Role</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
                    {getRoleIcon(role)}
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select text-xs py-2.5 !pl-11 bg-slate-950/80 relative text-white border-slate-800"
                  >
                    <option value="user">Applicant</option>
                    <option value="employer">Employer</option>
                    <option value="mentor">Mentor</option>
                    {isLogin && <option value="admin">System Administrator</option>}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label text-xs">Gmail Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signin-email"
                    type="email"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                    required
                  />
                </div>
              </div>

              {/* Registration Extra Fields */}
              {!isLogin && (
                <>
                  {/* Username Field */}
                  <div>
                    <label className="form-label text-xs">Username / Display Name *</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Zeeshan Haider"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <label className="form-label text-xs">Phone Number</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 03001234567"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                        required
                      />
                    </div>
                  </div>

                  {/* CNIC / ID Card Field */}
                  <div>
                    <label className="form-label text-xs">CNIC / ID Card</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 12345-1234567-1"
                        value={idCard}
                        onChange={(e) => setIdCard(e.target.value)}
                        className="input-field w-full !pl-11 py-2.5 text-sm bg-slate-950/80"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label text-xs mb-0">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForgotState();
                        setIsForgotPassword(true);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full !pl-11 !pr-11 py-2.5 text-sm bg-slate-950/80"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center justify-center p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              {isLogin && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                    Keep me signed in on this browser
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm font-bold shadow-lg shadow-indigo-500/25 mt-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* AI Knowledge Box ("Know about us") directly below Sign In box */}
          <div className="mt-4">
            <AiAskBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
