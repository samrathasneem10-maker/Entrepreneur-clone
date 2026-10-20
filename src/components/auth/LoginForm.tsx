'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { useAuth } from './AuthContext';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { openSignup, loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const handleGoogleSignIn = () => {
    loginUser({
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'reader',
    });
    router.push('/dashboard/reader');
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
    <div className="space-y-6 text-center">
      {/* 1. Entrepreneur Logo */}
      <div className="flex justify-center items-baseline pt-2 select-none">
        <span className="font-logo font-black text-3xl sm:text-4xl tracking-[-0.04em] text-[#000000] leading-none">
          Entrepreneur
        </span>
        <span className="text-[#000000] text-[10px] font-sans font-bold ml-[1px] leading-none align-baseline">
          ®
        </span>
      </div>

      {/* 2. Title & Subtitle */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#020618] my-0 leading-tight">
          Login
        </h2>
        <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 my-0">
          SIGN IN TO YOUR DASHBOARD
        </p>
      </div>

      {/* Auth Error Alert Box */}
      {authError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-left animate-in fade-in duration-200">
          <p className="text-xs font-sans text-red-700 font-semibold my-0 leading-snug">
            {authError}
          </p>
        </div>
      )}

      {/* 3. Google Login Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300/90 rounded-xl text-xs sm:text-sm font-sans font-bold text-slate-700 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
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
          <span>Continue with Google</span>
        </button>
      </div>

      {/* 4. Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200/90 w-full" />
        <span className="bg-white px-3 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400 absolute">
          OR EMAIL CREDENTIALS
        </span>
      </div>

      {/* 5. Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <InputField
          id="login-email"
          label="BUSINESS EMAIL"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
            setAuthError('');
          }}
          placeholder="e.g. name@example.com"
          error={emailError}
        />

        <PasswordInput
          id="login-password"
          label="PASSWORD"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError('');
            setAuthError('');
          }}
          placeholder="Enter secure passcode"
          error={passwordError}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#1642D0] hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-2xs mt-2 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>AUTHENTICATING...</span>
            </>
          ) : (
            <span>SIGN IN</span>
          )}
        </button>
      </form>

      {/* 6. Switch to Signup Link */}
      <div className="pt-2">
        <button
          type="button"
          onClick={openSignup}
          className="text-xs font-sans font-bold text-[#B91C1C] hover:text-red-800 transition-colors cursor-pointer"
        >
          New to Entrepreneur? Create secure account
        </button>
      </div>
    </div>
  );
};
