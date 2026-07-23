import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
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
  UserCheck
} from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // Step 1: Email, Step 2: Code, Step 3: Reset Password
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [mobileCode, setMobileCode] = useState('+92');
  const [mobileNumber, setMobileNumber] = useState('');
  const [idCard, setIdCard] = useState('');

  // 6-digit verification code states
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, signup, resetPassword, usersDb } = useContext(AppContext);
  const navigate = useNavigate();

  const validateIdCard = (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic);
  const validateGmail = (mail) => mail.includes('@') && mail.endsWith('@gmail.com');

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
        setError(res.error);
      }
    } else {
      if (!validateGmail(email)) {
        setError('Please enter a valid Gmail address (must end with @gmail.com)');
        return;
      }
      if (!validateIdCard(idCard)) {
        setError('ID Card must be in Pakistan format: XXXXX-XXXXXXX-X');
        return;
      }
      if (!mobileNumber) {
        setError('Please enter a mobile number');
        return;
      }
      const res = signup({
        email,
        password,
        role,
        name: email.split('@')[0],
        mobile: `${mobileCode}${mobileNumber}`,
        idCard,
      });
      if (res.success) {
        setSuccessMessage('Account created successfully! Please sign in.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setMobileNumber('');
        setIdCard('');
      } else {
        setError(res.error);
      }
    }
  };

  // Step 1: Send 6-Digit Code to Gmail
  const handleSendCode = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !validateGmail(email)) {
      setError('Please enter a valid Gmail address (@gmail.com).');
      return;
    }

    const userExists = usersDb && usersDb.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!userExists) {
      setError('No account registered with this Gmail address.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep(2);
    setSuccessMessage(`A 6-digit verification code has been sent to your Gmail (${email}).`);
  };

  // Step 2: Verify Code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (inputCode.trim() === generatedCode) {
      setForgotStep(3);
      setSuccessMessage('Code verified successfully! Please enter your new password.');
    } else {
      setError('Invalid verification code. Please check your email and try again.');
    }
  };

  // Step 3: Update Password
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
      setSuccessMessage('Password updated successfully! Redirecting to sign in...');
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotStep(1);
        setIsLogin(true);
        setPassword(newPassword);
        setError('');
        setSuccessMessage('');
      }, 2000);
    } else {
      setError(res.error);
    }
  };

  const resetForgotState = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    setGeneratedCode('');
    setInputCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
  };

  // ── Forgot Password Screen ─────────────────────────────────────────
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
        <div className="w-full max-w-md bg-card border border-border backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/30 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-primaryText">Reset Password</h2>
            <p className="text-secondaryText text-xs">
              Step {forgotStep} of 3 • {
                forgotStep === 1 ? 'Enter Gmail' :
                forgotStep === 2 ? 'Verify 6-Digit Code' :
                'Set New Password'
              }
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {forgotStep === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="form-label text-xs">Gmail Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full pl-11 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm font-semibold shadow-lg shadow-primary/20"
              >
                Send 6-Digit Code
              </button>
            </form>
          )}

          {/* STEP 2: Input 6-Digit Verification Code */}
          {forgotStep === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="p-3.5 bg-slate-900/80 border border-border rounded-xl text-xs space-y-1 text-slate-300">
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Code sent to:
                  </span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{email}</span>
                </div>
                <p className="text-secondaryText text-[11px]">
                  Please check your inbox and enter the 6-digit verification code below.
                </p>
              </div>

              <div>
                <label className="form-label text-xs">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  className="input-field w-full text-center text-2xl tracking-widest font-mono font-bold py-2.5"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="btn secondary flex-1 text-xs py-2.5"
                >
                  Resend Code
                </button>
                <button
                  type="submit"
                  className="btn primary flex-1 text-xs font-semibold py-2.5"
                >
                  Verify Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password & Confirm */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="form-label text-xs">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field w-full pl-11 pr-11 py-2.5 text-sm"
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
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field w-full pl-11 pr-11 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn primary py-2.5 text-sm font-semibold shadow-lg shadow-primary/20"
              >
                Update Password
              </button>
            </form>
          )}

          <button
            onClick={resetForgotState}
            className="w-full text-center text-xs text-secondaryText hover:text-white flex items-center justify-center gap-1.5 transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Main Auth Screen (Login / Register) ─────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-md bg-card border border-border backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Header Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primaryText">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-secondaryText text-xs mt-1">
            {isLogin 
              ? 'Enter your account credentials to continue.' 
              : 'Select your role and complete details.'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black/20 p-1.5 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              isLogin ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              !isLogin ? 'bg-primary text-white shadow-md' : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="form-label text-xs">Role</label>
            <div className="relative flex items-center">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select text-xs py-2.5 pl-11 relative"
              >
                <option value="user">Applicant</option>
                <option value="employer">Employer</option>
                <option value="mentor">Mentor</option>
                {isLogin && <option value="admin">Admin</option>}
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="form-label text-xs">Gmail Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full pl-11 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          {/* Registration Extra Fields */}
          {!isLogin && (
            <>
              <div>
                <label className="form-label text-xs">Mobile Number</label>
                <div className="flex gap-2">
                  <select
                    value={mobileCode}
                    onChange={(e) => setMobileCode(e.target.value)}
                    className="form-select text-xs w-24"
                  >
                    <option value="+92">+92 (PK)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <div className="relative flex-1 flex items-center">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="3001234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      className="input-field w-full pl-11 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">CNIC / ID Card</label>
                <div className="relative flex items-center">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="12345-1234567-1"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    className="input-field w-full pl-11 py-2.5 text-sm"
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
                  onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full pl-11 pr-11 py-2.5 text-sm"
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

          {/* Remember Me */}
          {isLogin && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border bg-slate-900 text-primary accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-secondaryText cursor-pointer select-none">
                Remember me
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn primary py-2.5 text-sm font-semibold shadow-lg shadow-primary/25 mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
