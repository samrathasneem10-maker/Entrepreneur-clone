'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { openSignup, loginUser, closeAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleGoogleSignIn = () => {
    loginUser({
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'reader',
    });
    closeAuth();
    router.push('/dashboard/reader');
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setEmailError('Please enter your email above to reset password.');
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid credentials. Please verify your email and password.');
        setIsLoading(false);
        return;
      }

      // Successful login: update context with user profile & role
      loginUser(data.user);
      closeAuth();

      // Redirect immediately to the user's specific dashboard
      const targetUrl = data.redirectUrl || '/dashboard/reader';
      router.push(targetUrl);
    } catch (err: any) {
      setAuthError('Network or server error. Please ensure database is connected.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col pt-1">
      {/* 1. Title */}
      <h2 className="text-2xl sm:text-[25px] font-sans font-bold text-slate-800 text-center tracking-tight my-0">
        Login to Entrepreneur
      </h2>

      {/* 2. Subtitle */}
      <p className="text-xs sm:text-[13px] text-slate-500 text-center mt-2.5 mb-1 max-w-[280px] mx-auto leading-relaxed font-normal">
        Sign into your account via email or using a social account
      </p>

      {/* 3. I don't have an account link */}
      <div className="text-center mb-5 mt-1">
        <button
          type="button"
          onClick={openSignup}
          className="text-xs sm:text-[13px] text-[#1642D0] hover:underline font-normal cursor-pointer"
        >
          I don&apos;t have an account
        </button>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-left animate-in fade-in duration-200">
          <p className="text-xs font-sans text-red-700 font-medium my-0 leading-snug">
            {authError}
          </p>
        </div>
      )}

      {/* Forgot Password Success Banner */}
      {forgotSent && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left animate-in fade-in duration-200">
          <p className="text-xs font-sans text-emerald-800 font-medium my-0 leading-snug">
            Password reset instructions have been dispatched to {email}.
          </p>
        </div>
      )}

      {/* 4. Social Sign In with smooth rounded-corner style */}
      <div className="mb-5">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] font-sans font-medium text-slate-700 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
        >
          {/* Multi-colored Google Icon */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>

      {/* Subtle Divider */}
      <div className="relative flex items-center justify-center mb-5">
        <div className="border-t border-slate-200 w-full" />
      </div>

      {/* 5. Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="flex flex-col text-left">
          <label
            htmlFor="modal-login-email"
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-slate-800 stroke-[2.2]" />
            <span>Email</span>
          </label>
          <input
            id="modal-login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
              setAuthError('');
            }}
            placeholder=""
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-colors"
          />
          {emailError && (
            <span className="text-[11px] text-red-600 mt-1 font-medium">{emailError}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col text-left">
          <label
            htmlFor="modal-login-password"
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-800 mb-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-slate-800 stroke-[2.2]" />
            <span>Password</span>
          </label>
          <div className="relative w-full">
            <input
              id="modal-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
                setAuthError('');
              }}
              placeholder=""
              className="w-full px-3.5 py-2.5 pr-10 bg-[#f8fafc] border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {passwordError && (
            <span className="text-[11px] text-red-600 mt-1 font-medium">{passwordError}</span>
          )}
        </div>

        {/* Forgot Password Row */}
        <div className="flex items-center justify-end pt-0.5">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs sm:text-[13px] text-[#1642D0] hover:underline font-normal cursor-pointer"
          >
            I forgot my password
          </button>
        </div>

        {/* Sign In / Login Button with restored rounded-corner style */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#fde047] hover:bg-[#facc15] active:bg-[#eab308] disabled:opacity-60 text-slate-950 font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer shadow-sm mt-3 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
};
