'use client';

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { InputField } from './InputField';
import { PasswordInput } from './PasswordInput';
import { useAuth } from './AuthContext';

export const SignupForm: React.FC = () => {
  const { openLogin, loginUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Live 5-rule Password Validation
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#$%^&*!_+=\-[\]{};:"\\|,.<>/?~]/.test(password);

  const passedRulesCount = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthInfo = () => {
    if (passedRulesCount <= 2) {
      return { text: 'Weak', textColor: 'text-rose-600', barColor: 'bg-rose-500', width: 'w-1/4' };
    }
    if (passedRulesCount === 3) {
      return { text: 'Fair', textColor: 'text-amber-600', barColor: 'bg-amber-500', width: 'w-2/4' };
    }
    if (passedRulesCount === 4) {
      return { text: 'Good', textColor: 'text-blue-600', barColor: 'bg-blue-600', width: 'w-3/4' };
    }
    return { text: 'Strong', textColor: 'text-emerald-600', barColor: 'bg-emerald-500', width: 'w-full' };
  };

  const strengthInfo = getStrengthInfo();

  // Confirm Password live check
  const isConfirmTyped = confirmPassword.length > 0;
  const isPasswordMatch = isConfirmTyped && confirmPassword === password;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isNameValid = name.trim().length >= 2;

  // Submit Enabled State
  const isFormValid = isNameValid && isEmailValid && passedRulesCount === 5 && isPasswordMatch;

  const handleGoogleSignUp = () => {
    loginUser({
      name: 'Google User',
      email: 'user@gmail.com',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNameValid) {
      setNameError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!isEmailValid) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (isFormValid) {
      loginUser({
        name: name.trim(),
        email: email.trim(),
      });
    }
  };

  return (
    <div className="space-y-5 text-center">
      {/* 1. Entrepreneur Logo */}
      <div className="flex justify-center items-baseline pt-1 select-none">
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
          Sign Up
        </h2>
        <p className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-400 my-0">
          CREATE YOUR ACCOUNT
        </p>
      </div>

      {/* 3. Google Sign Up Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full py-2.5 px-4 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-300/90 rounded-xl text-xs sm:text-sm font-sans font-bold text-slate-700 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
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
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left pt-1">
        <InputField
          id="signup-name"
          label="FULL NAME"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError('');
          }}
          placeholder="e.g. Richard Hendricks"
          error={nameError}
        />

        <InputField
          id="signup-email"
          label="EMAIL ADDRESS"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          placeholder="e.g. richard@piedpiper.com"
          error={emailError}
        />

        <PasswordInput
          id="signup-password"
          label="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create secure passcode"
        />

        {/* Live Password Strength Panel (Smoothly fades in when user starts typing) */}
        {password.length > 0 && (
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 text-[11px] font-sans animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Progress Bar & Label */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                PASSWORD STRENGTH
              </span>
              <span className={`font-extrabold text-[11px] ${strengthInfo.textColor}`}>
                {strengthInfo.text}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.barColor} ${strengthInfo.width} transition-all duration-300`}
              />
            </div>

            {/* Live Requirements Checklist */}
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-slate-600">
              <li className="flex items-center gap-1.5">
                {hasMinLen ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                )}
                <span className={hasMinLen ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                  8+ characters
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                {hasUpper ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                )}
                <span className={hasUpper ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                  Uppercase letter
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                {hasLower ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                )}
                <span className={hasLower ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                  Lowercase letter
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                {hasNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                )}
                <span className={hasNumber ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                  Number
                </span>
              </li>
              <li className="flex items-center gap-1.5 col-span-2">
                {hasSpecial ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                )}
                <span className={hasSpecial ? 'text-slate-900 font-semibold' : 'text-slate-500'}>
                  Special character (@, #, $, !, %, etc.)
                </span>
              </li>
            </ul>
          </div>
        )}

        <div className="space-y-1">
          <PasswordInput
            id="signup-confirm-password"
            label="CONFIRM PASSWORD"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Verify secure passcode"
          />

          {/* Real-time Confirm Password Validation Message */}
          {isConfirmTyped && (
            <div className="pt-1 animate-in fade-in duration-200">
              {isPasswordMatch ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Passwords match</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>Passwords do not match. Please enter the same password.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 px-4 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 mt-2 ${
            isFormValid
              ? 'bg-[#1642D0] hover:bg-blue-800 cursor-pointer shadow-2xs'
              : 'bg-[#1642D0] opacity-50 cursor-not-allowed'
          }`}
        >
          REGISTER ACCOUNT
        </button>
      </form>

      {/* 6. Switch to Login Link */}
      <div className="pt-2 text-center">
        <span className="text-xs font-sans text-slate-500 mr-1.5">
          Already have an account?
        </span>
        <button
          type="button"
          onClick={openLogin}
          className="text-xs font-sans font-bold text-[#1642D0] hover:underline transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
