import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import AiAskBox from '../components/AiAskBox';
import signinPic from '../assets/signin_bg.png';
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
  ShieldAlert,
  ArrowRight,
  Star,
  Sun,
  Moon,
  Zap,
  ChevronDown
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

  // OAuth Account Selection Modal States
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [oauthProvider, setOauthProvider] = useState('google'); // 'google' | 'edge'
  const [oauthEmail, setOauthEmail] = useState('');

  // Passwordless Test Demo Panel Selection State
  const [showDemoPanelSelect, setShowDemoPanelSelect] = useState(false);

  const navigate = useNavigate();

  const handleDemoLogin = (targetRole) => {
    setError('');
    setSuccessMessage('');

    const safeUsersDb = Array.isArray(usersDb) ? usersDb : [];
    let demoAccount = safeUsersDb.find(u => u && u.role === targetRole);

    if (!demoAccount) {
      const demoEmailMap = {
        user: 'user@gmail.com',
        employer: 'employer@gmail.com',
        mentor: 'mentor@gmail.com',
        admin: 'admin@gmail.com'
      };
      const targetEmail = demoEmailMap[targetRole] || 'user@gmail.com';
      demoAccount = safeUsersDb.find(u => u && u.email && u.email.toLowerCase() === targetEmail);
    }

    if (demoAccount) {
      const res = login(demoAccount.email, demoAccount.password, targetRole, true);
      if (res.success) {
        if (targetRole === 'admin') navigate('/admin');
        else if (targetRole === 'employer') navigate('/employer');
        else if (targetRole === 'mentor') navigate('/mentor');
        else navigate('/user');
      } else {
        setError('Unable to log into demo account. Please try manual login.');
      }
    } else {
      const defaultPasswords = { user: 'user123', employer: 'emp123', mentor: 'men123', admin: 'admin123' };
      const defaultEmails = { user: 'user@gmail.com', employer: 'employer@gmail.com', mentor: 'mentor@gmail.com', admin: 'admin@gmail.com' };
      const defaultNames = { user: 'User Demo', employer: 'Employer Demo', mentor: 'Mentor Demo', admin: 'Admin Demo' };

      const newDemoUser = {
        email: defaultEmails[targetRole] || 'user@gmail.com',
        password: defaultPasswords[targetRole] || 'user123',
        role: targetRole,
        name: defaultNames[targetRole] || 'Demo Account',
        mobile: '+923000000000',
        idCard: '12345-0000000-1'
      };
      signup(newDemoUser);
      const res = login(newDemoUser.email, newDemoUser.password, targetRole, true);
      if (res.success) {
        if (targetRole === 'admin') navigate('/admin');
        else if (targetRole === 'employer') navigate('/employer');
        else if (targetRole === 'mentor') navigate('/mentor');
        else navigate('/user');
      }
    }
  };

  const openGoogleAuth = () => {
    setOauthProvider('google');
    setOauthEmail('zeeshan726312@gmail.com');
    setShowOauthModal(true);
  };

  const openEdgeAuth = () => {
    setOauthProvider('edge');
    setOauthEmail('zeeshan726312@outlook.com');
    setShowOauthModal(true);
  };

  const handleOauthSubmit = (e) => {
    e.preventDefault();
    if (!oauthEmail.trim()) return;

    const emailToUse = oauthEmail.trim().toLowerCase();
    const targetUser = (usersDb || []).find(u => u && u.email && u.email.toLowerCase() === emailToUse);
    
    if (targetUser) {
      const res = login(targetUser.email, targetUser.password, targetUser.role, true);
      if (res.success) {
        setShowOauthModal(false);
        const role = targetUser.role || 'user';
        if (role === 'admin') navigate('/admin');
        else if (role === 'employer') navigate('/employer');
        else if (role === 'mentor') navigate('/mentor');
        else navigate('/');
      }
    } else {
      // Create new account for this Google / Edge user
      const rawName = emailToUse.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'User Account';
      const newAccount = {
        email: emailToUse,
        password: 'user123',
        role: 'user',
        name: formattedName,
        mobile: '+92 300 0000000',
        idCard: '12345-0000000-1'
      };
      signup(newAccount);
      const res = login(newAccount.email, newAccount.password, 'user', true);
      if (res.success) {
        setShowOauthModal(false);
        navigate('/');
      }
    }
  };

  const validateGmail = (mail) => mail && mail.includes('@') && mail.endsWith('@gmail.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (isLogin) {
      const res = login(email, password, role, rememberMe);
      if (res.success) {
        const effectiveRole = res.user?.role || role;
        if (effectiveRole === 'admin') navigate('/admin');
        else if (effectiveRole === 'employer') navigate('/employer');
        else if (effectiveRole === 'mentor') navigate('/mentor');
        else navigate('/');
      } else {
        setError(res.message || res.error || 'Invalid credentials.');
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
          <div className="pt-2 flex flex-wrap items-center gap-3">
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
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border border-cyan-200/50 group cursor-pointer"
            >
              <span>Step Into Your Future</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setIsLogin(true);
                setShowDemoPanelSelect(true);
                setError('');
                setSuccessMessage('');
                document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl glowing-demo-btn hover:scale-105 transition-all cursor-pointer border border-amber-200"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Test Demo Without Account</span>
            </button>
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

          {/* AI Knowledge Box directly below 4 role options text */}
          <div className="pt-6 max-w-xl">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Ask AI About TrackerPro, Founder & Roles
            </p>
            <AiAskBox />
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

            {/* PROMINENT GLOWING TEST DEMO WITHOUT ACCOUNT SECTION */}
            {isLogin && (
              <div className="my-3 relative group">
                {/* Outer Glow Aura */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-400 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />
                
                <div className="relative bg-slate-950/95 border border-amber-400/80 rounded-2xl p-4 space-y-3 backdrop-blur-xl glowing-demo-card">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                      <div className="text-left">
                        <h3 className="text-sm font-black text-amber-400 flex items-center gap-1.5 tracking-wide">
                          <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                          Test Demo Without Account
                        </h3>
                        <p className="text-[11px] text-slate-300 font-medium leading-tight">
                          Test any panel in 1-click without creating an account.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDemoPanelSelect(!showDemoPanelSelect)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 transition-all hover:scale-105 shrink-0 border border-amber-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showDemoPanelSelect ? 'Close' : 'Try Demo ⚡'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showDemoPanelSelect ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* EXPANDABLE PANEL SELECTION */}
                  {showDemoPanelSelect && (
                    <div className="pt-3 border-t border-amber-500/30 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Select Which Panel You Want to Test:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Option 1: Applicant Panel */}
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('user')}
                          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/90 border border-indigo-500/50 hover:border-indigo-400 text-left transition-all hover:scale-[1.02] shadow-md group/btn cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Applicant Panel
                            </span>
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">1-Click</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            View jobs, track applications & book mentors.
                          </p>
                        </button>

                        {/* Option 2: Employer Panel */}
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('employer')}
                          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-amber-950/90 border border-amber-500/50 hover:border-amber-400 text-left transition-all hover:scale-[1.02] shadow-md group/btn cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Recruiter Panel
                            </span>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">1-Click</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Post jobs, manage applicants & hire candidates.
                          </p>
                        </button>

                        {/* Option 3: Mentor Portal */}
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('mentor')}
                          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-950/90 border border-purple-500/50 hover:border-purple-400 text-left transition-all hover:scale-[1.02] shadow-md group/btn cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Mentor Portal
                            </span>
                            <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">1-Click</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Manage courses, mentee requests & guidance.
                          </p>
                        </button>

                        {/* Option 4: System Admin Panel */}
                        <button
                          type="button"
                          onClick={() => handleDemoLogin('admin')}
                          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/90 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all hover:scale-[1.02] shadow-md group/btn cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin Panel
                            </span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">Full Access</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            User database, system metrics & settings.
                          </p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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

            {/* OAuth Single Sign-On Divider & Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="relative text-center">
                <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Or sign in with</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={openGoogleAuth}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={openEdgeAuth}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Microsoft Edge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OAUTH ACCOUNT SELECTION MODAL */}
      {showOauthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {oauthProvider === 'google' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                )}
                <h3 className="text-base font-extrabold text-white">
                  {oauthProvider === 'google' ? 'Sign in with Google' : 'Sign in with Microsoft Edge'}
                </h3>
              </div>
              <button onClick={() => setShowOauthModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Select or enter your {oauthProvider === 'google' ? 'Google Account (@gmail.com)' : 'Microsoft Edge Account (@outlook.com / @hotmail.com)'} to sign in directly:
            </p>

            <form onSubmit={handleOauthSubmit} className="space-y-3">
              <div>
                <label className="form-label text-xs">Enter Your Account Email</label>
                <input
                  type="email"
                  placeholder={oauthProvider === 'google' ? 'yourname@gmail.com' : 'yourname@outlook.com'}
                  value={oauthEmail}
                  onChange={e => setOauthEmail(e.target.value)}
                  className="input-field w-full text-xs py-2.5 bg-slate-950 text-white border-slate-800"
                  required
                />
              </div>

              {/* Quick Preset Account Selectors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Or Quick Select Platform Accounts:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setOauthEmail('user@gmail.com'); }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-left border border-slate-800 font-medium"
                  >
                    👤 Candidate <span className="block text-[9px] text-slate-400">user@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOauthEmail('employer@gmail.com'); }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-left border border-slate-800 font-medium"
                  >
                    🏢 Recruiter <span className="block text-[9px] text-slate-400">employer@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOauthEmail('mentor@gmail.com'); }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-left border border-slate-800 font-medium"
                  >
                    🎓 Mentor <span className="block text-[9px] text-slate-400">mentor@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOauthEmail('admin@gmail.com'); }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-left border border-slate-800 font-medium"
                  >
                    🛡️ Admin <span className="block text-[9px] text-slate-400">admin@gmail.com</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOauthModal(false)}
                  className="btn secondary flex-1 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-indigo-600 hover:bg-indigo-500 text-white flex-1 py-2.5 text-xs font-bold shadow-lg keep-white border-0"
                >
                  Continue & Sign In ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
