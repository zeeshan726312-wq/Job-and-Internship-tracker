import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogIn, UserPlus, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

  const { login, signup, usersDb } = useContext(AppContext);
  const navigate = useNavigate();

  const validateIdCard = (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic);
  const validateGmail = (mail) => mail.includes('@') && mail.endsWith('@gmail.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (isLogin) {
      const res = login(email, password, role, rememberMe);
      if (res.success) navigate('/');
      else setError(res.error);
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateGmail(email)) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    const userExists = usersDb && usersDb.some(u => u.email === email);
    if (userExists) {
      setSuccessMessage('Password reset link has been sent to your email! Redirecting to login...');
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccessMessage('');
        setEmail('');
      }, 3000);
    } else {
      setError('No account found with that email address.');
    }
  };

  const handleToggleMode = (toLogin) => {
    setIsLogin(toLogin);
    setError('');
    setSuccessMessage('');
    if (!toLogin && role === 'admin') setRole('user');
  };

  // ── Forgot Password Screen ──────────────────────────────────────────────────
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-md bg-card border border-borderC backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primaryText">Reset Password</h2>
            <p className="text-secondaryText mt-2 text-sm">
              Enter your registered Gmail and we'll send a reset link.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primaryText mb-1">Gmail Address</label>
              <input
                type="email"
                placeholder="user@gmail.com"
                className="w-full bg-black/20 border border-borderC rounded-lg px-4 py-2 text-primaryText focus:border-primary outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Send Reset Link
            </button>
          </form>

          <button
            onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMessage(''); }}
            className="w-full mt-6 text-secondaryText hover:text-primaryText text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Main Login / Signup Screen ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md bg-card border border-borderC backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TrackerPro
          </h2>
          <p className="text-secondaryText mt-2">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector — Admin only visible on Sign In */}
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Select Role</label>
            <select
              className="w-full bg-black/20 border border-borderC rounded-lg px-4 py-2 text-primaryText focus:border-primary outline-none transition-colors"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user" className="bg-slate-800 text-white">User</option>
              <option value="employer" className="bg-slate-800 text-white">Employer</option>
              <option value="mentor" className="bg-slate-800 text-white">Mentor</option>
              {isLogin && <option value="admin" className="bg-slate-800 text-white">Admin</option>}
            </select>
          </div>

          {/* Signup-only fields */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-primaryText mb-1">Mobile Number</label>
                <div className="flex gap-2">
                  <select
                    className="w-24 bg-black/20 border border-borderC rounded-lg px-2 py-2 text-primaryText focus:border-primary outline-none transition-colors"
                    value={mobileCode}
                    onChange={(e) => setMobileCode(e.target.value)}
                  >
                    <option value="+92" className="bg-slate-800 text-white">+92 (PK)</option>
                    <option value="+1" className="bg-slate-800 text-white">+1 (US)</option>
                    <option value="+44" className="bg-slate-800 text-white">+44 (UK)</option>
                    <option value="+91" className="bg-slate-800 text-white">+91 (IN)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="3001234567"
                    className="flex-1 bg-black/20 border border-borderC rounded-lg px-4 py-2 text-primaryText focus:border-primary outline-none transition-colors"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primaryText mb-1">ID Card Number (PK Format)</label>
                <input
                  type="text"
                  placeholder="12345-1234567-1"
                  className="w-full bg-black/20 border border-borderC rounded-lg px-4 py-2 text-primaryText focus:border-primary outline-none transition-colors"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primaryText mb-1">Gmail Address</label>
            <input
              type="email"
              placeholder={isLogin ? 'user@gmail.com' : 'you@gmail.com'}
              className="w-full bg-black/20 border border-borderC rounded-lg px-4 py-2 text-primaryText focus:border-primary outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password + Forgot Password link */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-primaryText">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-borderC rounded-lg px-4 py-2 pr-10 text-primaryText focus:border-primary outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondaryText hover:text-primaryText transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me (login only) */}
          {isLogin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 rounded border-borderC text-primary focus:ring-primary bg-black/20"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-secondaryText">Remember me</label>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6"
          >
            {isLogin
              ? <><LogIn className="w-5 h-5" /> Sign In</>
              : <><UserPlus className="w-5 h-5" /> Create Account</>
            }
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-secondaryText">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => handleToggleMode(false)} className="text-primary hover:underline font-medium">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => handleToggleMode(true)} className="text-primary hover:underline font-medium">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
