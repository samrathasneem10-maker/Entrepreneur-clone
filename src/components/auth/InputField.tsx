'use client';

import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor={id}
        className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-sans text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
          error
            ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-200/90 focus:border-[#1642D0] focus:ring-1 focus:ring-[#1642D0] focus:bg-white'
        }`}
      />
      {error && (
        <p className="text-[11px] text-rose-600 font-sans font-semibold mt-1 my-0">
          {error}
        </p>
      )}
    </div>
  );
};
