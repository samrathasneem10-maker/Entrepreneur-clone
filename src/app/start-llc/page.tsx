'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface StateOption {
  code: string;
  name: string;
  fee: number;
}

const US_STATES: StateOption[] = [
  { code: 'DE', name: 'Delaware', fee: 90 },
  { code: 'WY', name: 'Wyoming', fee: 100 },
  { code: 'CA', name: 'California', fee: 70 },
  { code: 'FL', name: 'Florida', fee: 125 },
  { code: 'TX', name: 'Texas', fee: 300 },
  { code: 'NY', name: 'New York', fee: 200 },
  { code: 'NV', name: 'Nevada', fee: 425 },
  { code: 'IL', name: 'Illinois', fee: 150 },
  { code: 'WA', name: 'Washington', fee: 200 },
  { code: 'CO', name: 'Colorado', fee: 50 },
];

export default function StartLlcPage() {
  const [selectedState, setSelectedState] = useState<StateOption>(US_STATES[0]);
  const [entityType, setEntityType] = useState<'LLC' | 'C-Corp' | 'S-Corp' | 'Non-Profit'>('LLC');
  const [businessName, setBusinessName] = useState('');
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'pro' | 'vip'>('pro');

  // Contact Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const packagePrices = {
    starter: 0,
    pro: 199,
    vip: 299,
  };

  const totalPrice = packagePrices[selectedPackage] + selectedState.fee;

  const handleCheckName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setIsNameChecked(true);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !fullName.trim() || !email.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
    const generatedOrder = 'ENT-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedOrder);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1642D0] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Entrepreneur Business Formation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Start Your LLC with Confidence
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              Form your Limited Liability Company in any of the 50 US states. Fast legal filings, registered agent service, and complete compliance backed by Entrepreneur.
            </p>
          </div>

          {isSubmitted ? (
            /* Order Success Receipt */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Formation Order Placed!
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Order Tracking ID: <span className="font-bold text-slate-900">{orderNumber}</span>
              </p>
              
              <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Name:</span>
                  <span className="font-bold text-slate-800">{businessName} {entityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State of Formation:</span>
                  <span className="font-bold text-slate-800">{selectedState.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Package:</span>
                  <span className="font-bold text-slate-800 uppercase">{selectedPackage}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-[#1642D0]">${totalPrice}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-6">
                A confirmation email with state tracking details and registered agent documents has been sent to <span className="font-semibold text-slate-800">{email}</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-[#1642D0] hover:bg-[#0E2C8F] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                >
                  Go to My Account
                </Link>
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* LLC Formation Wizard */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Configuration Form (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Step 1: Entity & State */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#1642D0]" />
                    <span>1. Select Entity Type & State</span>
                  </h3>

                  {/* Entity Type Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    {(['LLC', 'C-Corp', 'S-Corp', 'Non-Profit'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEntityType(type)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${entityType === type ? 'border-[#1642D0] bg-blue-50/70 text-[#1642D0] shadow-2xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* State Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Filing State
                    </label>
                    <select
                      value={selectedState.code}
                      onChange={(e) => {
                        const found = US_STATES.find((s) => s.code === e.target.value);
                        if (found) setSelectedState(found);
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                    >
                      {US_STATES.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name} (${state.fee} State Filing Fee)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 2: Name Availability Check */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#1642D0]" />
                    <span>2. Check Desired Business Name</span>
                  </h3>

                  <form onSubmit={handleCheckName} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          setIsNameChecked(false);
                        }}
                        placeholder="Enter your proposed business name..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-[#1642D0]"
                      />
                      <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                        {entityType}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Check Availability
                    </button>
                  </form>

                  {isNameChecked && businessName.trim() && (
                    <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-medium animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>
                        Great news! <strong>{businessName} {entityType}</strong> appears available for filing in <strong>{selectedState.name}</strong>.
                      </span>
                    </div>
                  )}
                </div>

                {/* Step 3: Package Selection */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#1642D0]" />
                    <span>3. Choose Your Formation Package</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Starter */}
                    <div
                      onClick={() => setSelectedPackage('starter')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${selectedPackage === 'starter' ? 'border-[#1642D0] bg-blue-50/40 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">Starter</h4>
                        <p className="text-xs text-slate-500 mt-1">Basic state filing</p>
                        <div className="text-2xl font-bold text-slate-900 my-3">$0 <span className="text-xs font-normal text-slate-500">+ State Fee</span></div>
                        <ul className="text-xs text-slate-600 space-y-2 mt-4">
                          <li className="flex items-center gap-2">✓ Articles of Organization</li>
                          <li className="flex items-center gap-2">✓ Name Availability Verification</li>
                          <li className="flex items-center gap-2">✓ Digital Document Access</li>
                        </ul>
                      </div>
                    </div>

                    {/* Pro */}
                    <div
                      onClick={() => setSelectedPackage('pro')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${selectedPackage === 'pro' ? 'border-[#1642D0] bg-blue-50/40 shadow-md ring-2 ring-[#1642D0]/20' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1642D0] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Pro</h4>
                        <p className="text-xs text-slate-500 mt-1">Complete formation</p>
                        <div className="text-2xl font-bold text-slate-900 my-3">$199 <span className="text-xs font-normal text-slate-500">+ State Fee</span></div>
                        <ul className="text-xs text-slate-600 space-y-2 mt-4">
                          <li className="flex items-center gap-2 font-semibold text-slate-900">✓ All Starter features</li>
                          <li className="flex items-center gap-2">✓ 1st Year Registered Agent</li>
                          <li className="flex items-center gap-2">✓ Custom Operating Agreement</li>
                          <li className="flex items-center gap-2">✓ Federal Tax ID (EIN)</li>
                        </ul>
                      </div>
                    </div>

                    {/* VIP */}
                    <div
                      onClick={() => setSelectedPackage('vip')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${selectedPackage === 'vip' ? 'border-[#1642D0] bg-blue-50/40 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">VIP All-Access</h4>
                        <p className="text-xs text-slate-500 mt-1">Expedited + Perks</p>
                        <div className="text-2xl font-bold text-slate-900 my-3">$299 <span className="text-xs font-normal text-slate-500">+ State Fee</span></div>
                        <ul className="text-xs text-slate-600 space-y-2 mt-4">
                          <li className="flex items-center gap-2 font-semibold text-slate-900">✓ All Pro features</li>
                          <li className="flex items-center gap-2">✓ 24-Hour Expedited Filing</li>
                          <li className="flex items-center gap-2">✓ 1-Yr Entrepreneur All-Access</li>
                          <li className="flex items-center gap-2">✓ 150+ Contract Templates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Contact Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1642D0]" />
                    <span>4. Contact Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Organizer Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-[#1642D0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-[#1642D0]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-[#1642D0]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary (4 cols) */}
              <div className="lg:col-span-4 sticky top-20 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                    Order Summary
                  </h4>

                  <div className="divide-y divide-slate-100 text-xs sm:text-sm my-4">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-600">Entity:</span>
                      <span className="font-semibold text-slate-800">{businessName || 'Your Business'} {entityType}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-600">Filing State:</span>
                      <span className="font-semibold text-slate-800">{selectedState.name}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-600">State Filing Fee:</span>
                      <span className="font-semibold text-slate-800">${selectedState.fee}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-600">Entrepreneur Package ({selectedPackage}):</span>
                      <span className="font-semibold text-slate-800">${packagePrices[selectedPackage]}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-baseline mb-6">
                    <span className="font-bold text-slate-900 text-base">Total Due Today:</span>
                    <span className="font-serif font-bold text-2xl text-[#1642D0]">${totalPrice}</span>
                  </div>

                  <button
                    onClick={handleCompleteOrder}
                    className="w-full py-3.5 bg-[#1642D0] hover:bg-[#0E2C8F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Complete LLC Formation</span>
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>256-Bit SSL Encrypted & 100% Satisfaction Guarantee</span>
                  </div>
                </div>

                {/* FAQ Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-3">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-[#1642D0]" />
                    <span>Why Form With Entrepreneur?</span>
                  </h5>
                  <p>
                    Over 45 years of business leadership. We partner directly with state filing departments to guarantee accurate, expedited LLC formation.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
