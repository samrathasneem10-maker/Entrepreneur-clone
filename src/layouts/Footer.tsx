'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-800 w-full">
      
      {/* Upper Footer Newsletter Subscription Banner */}
      <div className="border-b border-slate-800 py-12 px-5 lg:px-8 bg-slate-900/50 w-full">
        <div className="w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center lg:justify-start">
              <Globe className="w-4 h-4 text-blue-400" />
              Stay Ahead of the Curve
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1 mb-2">
              Subscribe to Entrepreneur Daily
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get the latest business strategies, side hustle ideas, funding trends, and expert insight delivered straight to your inbox every morning.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to Entrepreneur Daily!');
            }}
            className="w-full max-w-md flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Enter your business email"
              required
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#193CB8] hover:bg-blue-800 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1400px] mx-auto py-12 px-5 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand & Mission Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-serif font-black tracking-tight text-white">
              Entrepreneur
            </span>
            <span className="text-red-600 text-xs align-super font-sans font-bold ml-0.5">®</span>
          </Link>
          
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Your ultimate resource for small business news, entrepreneurship, business management, franchise opportunities, growth strategies, and leadership.
          </p>

          {/* Social Icons with Inline SVGs */}
          <div className="flex items-center gap-3 pt-2 text-slate-400">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-blue-700 hover:text-white rounded-full transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-700 hover:text-white rounded-full transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-pink-600 hover:text-white rounded-full transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-blue-600 hover:text-white rounded-full transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-red-600 hover:text-white rounded-full transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Directory Column 1: Start & Grow */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Build Your Business
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="#" className="hover:text-white transition-colors">Start Your Business</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Business Plan Guide</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">LLC Registration</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Funding & Loans</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Marketing Strategies</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Sales & Pitching</Link></li>
          </ul>
        </div>

        {/* Directory Column 2: Side Hustles & Franchises */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Ventures & Franchises
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="#" className="hover:text-white transition-colors">50 Side Hustle Ideas</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Passive Income 101</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Franchise 500 Rankings</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Top Franchises Under $25k</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Franchisee Stories</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Gig Economy Trends</Link></li>
          </ul>
        </div>

        {/* Directory Column 3: Media & Company */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Company & Media
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link href="#" className="hover:text-white transition-colors">About Entrepreneur</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Leadership Team</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Entrepreneur Magazine</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Podcasts & Shows</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Press Releases</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Advertise With Us</Link></li>
          </ul>
        </div>

      </div>

      {/* Copyright & Legal Bottom Bar */}
      <div className="border-t border-slate-800 bg-black py-8 px-5 lg:px-8 text-xs text-slate-400 w-full space-y-6">
        <div className="w-full max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-4 text-white">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1642D0] transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1642D0] transition-colors" aria-label="TikTok">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.61.74-5.23 2.74-6.89 1.42-1.18 3.26-1.78 5.1-1.68v4.03c-1.13-.07-2.27.32-3.08 1.09-.94.88-1.33 2.23-1.04 3.49.27 1.18 1.19 2.14 2.37 2.45 1.34.36 2.82.02 3.84-.87 1.02-.88 1.48-2.24 1.44-3.57.02-3.64.01-7.28.01-10.92z"/></svg>
            </a>
            <a href="https://rss.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors" aria-label="RSS">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.675c6.775.061 12.261 5.546 12.325 12.325h4.675c-.063-9.354-7.646-16.937-17-17zm0-8.18v4.673c11.293.064 20.436 9.206 20.5 20.5h4.673c-.064-13.874-11.3-25.109-25.173-25.173z"/></svg>
            </a>
          </div>

          {/* Copyright text */}
          <p className="text-slate-400 text-xs font-serif leading-relaxed text-center md:text-right">
            Copyright © {new Date().getFullYear()} Entrepreneur Media, LLC All rights reserved. Entrepreneur® and its related marks are registered trademarks of Entrepreneur Media, LLC.
          </p>

        </div>

        {/* Centered Independence Statement Line (Matching Screenshot 2 & 3) */}
        <div className="text-center pt-2 text-slate-300 text-xs font-serif italic">
          We are a proud American independent media company that has never taken a dime of USAID taxpayer money us
        </div>

      </div>

      {/* 4. Full-Width Region Selector Bar (Matching Reference Screenshot 3) */}
      <div className="border-t border-slate-800/80 bg-black py-8 px-5 lg:px-10 w-full text-center">
        <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm font-bold font-sans text-white">
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">United States</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">Spanish</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">Georgia</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">India</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">Asia Pacific</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">Middle East</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">United Kingdom</Link>
          <span className="text-slate-600 font-normal">|</span>
          <Link href="#" className="hover:text-blue-400 transition-colors whitespace-nowrap">Europe</Link>
        </div>
      </div>

    </footer>
  );
};
