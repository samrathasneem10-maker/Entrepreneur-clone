'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { Check, ShieldCheck, Sparkles, BookOpen, Star, Lock } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function SubscribePage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'digital' | 'vip'>('digital');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1642D0] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited-Time Offer • Save 33%</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              33% Off the Playbooks Trusted by 10,000+ Entrepreneurs
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans">
              Get unlimited access to proprietary business case studies, expert interviews, franchise rankings, and print magazine editions.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-lg mx-auto text-center animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Welcome to Entrepreneur All Access!
              </h2>
              <p className="text-sm text-slate-600 mt-2 mb-6">
                Your subscription has been activated with 33% discount applied. Enjoy unlimited reading on web, iOS, and Android.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-[#1642D0] hover:bg-[#0E2C8F] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
              >
                Go to My Account
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
              
              {/* Digital Plan */}
              <div
                onClick={() => setSelectedPlan('digital')}
                className={`p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${selectedPlan === 'digital' ? 'border-[#1642D0] bg-white shadow-lg ring-2 ring-[#1642D0]/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Digital All Access</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Billed annually</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">
                      Save 33%
                    </span>
                  </div>

                  <div className="my-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-bold text-slate-900">$99</span>
                      <span className="text-sm text-slate-400 line-through">$150</span>
                      <span className="text-xs font-medium text-slate-500">/ year</span>
                    </div>
                  </div>

                  <ul className="text-xs sm:text-sm text-slate-700 space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Unlimited digital articles on Entrepreneur.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Ad-lite reading experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Weekly subscriber-exclusive newsletter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Franchise 500 database & ranking filters</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="mt-8 w-full py-3 bg-[#1642D0] hover:bg-[#0E2C8F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Activate 33% Off Access</span>
                </button>
              </div>

              {/* VIP Print + Digital */}
              <div
                onClick={() => setSelectedPlan('vip')}
                className={`p-6 sm:p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${selectedPlan === 'vip' ? 'border-[#1642D0] bg-white shadow-lg ring-2 ring-[#1642D0]/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Print + Digital VIP</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Complete bundle</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">
                      Save 33%
                    </span>
                  </div>

                  <div className="my-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-bold text-slate-900">$149</span>
                      <span className="text-sm text-slate-400 line-through">$225</span>
                      <span className="text-xs font-medium text-slate-500">/ year</span>
                    </div>
                  </div>

                  <ul className="text-xs sm:text-sm text-slate-700 space-y-3">
                    <li className="flex items-center gap-2 font-semibold text-slate-900">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Everything in Digital All Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>1-Year print magazine delivered to your door</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Entrepreneur Leadership Network digital badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Full historical archives (1977-present)</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="mt-8 w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Activate Print + Digital</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
