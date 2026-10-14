import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'green' | 'amber';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: 'text-[#193CB8] hover:text-blue-900',
    secondary: 'text-slate-600 hover:text-slate-900',
    dark: 'text-[#020618] hover:text-black',
    green: 'text-[#0D542B] hover:text-emerald-900',
    amber: 'text-[#9F0712] hover:text-red-900',
  };

  return (
    <div className="flex justify-start">
      <span
        className={`inline-block font-sans text-[11px] sm:text-xs font-extrabold uppercase tracking-widest leading-none transition-colors mb-1 ${variantStyles[variant]} ${className}`}
      >
        {children}
      </span>
    </div>
  );
};
