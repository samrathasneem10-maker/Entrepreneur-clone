'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Entrepreneur Daily',
    'Money Makers',
  ]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.warn('Failed to save newsletter subscriber to MySQL:', err);
      }
    }
  };

  return (
    <section className="bg-[#020618] py-14 text-white relative overflow-hidden w-full">
      
      <div className="w-full max-w-5xl mx-auto px-5 lg:px-10 text-center relative z-10">
        
        <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/30">
          Free Weekly Intelligence
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight mb-3">
          Never Miss a Breakthrough Business Insight
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto mb-8 leading-relaxed font-sans">
          Join over 1.5 million founders, executives, and side hustlers who get our top growth blueprints delivered directly every morning.
        </p>

        {subscribed ? (
          <div className="p-8 bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h3>
            <p className="text-slate-300 text-sm">
              We've sent a confirmation email to <span className="font-bold text-white">{email}</span>. Check your inbox to unlock your welcome package!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            
            {/* Topic Selection Pill Checkboxes */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {['Entrepreneur Daily', 'Money Makers', 'Franchise Weekly', 'AI Pulse'].map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedTopics.includes(topic)
                      ? 'bg-[#193CB8] border-blue-500 text-white shadow-xs'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedTopics.includes(topic) && '✓ '}
                  {topic}
                </button>
              ))}
            </div>

            {/* Email Input & Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your primary work email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-sans"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#193CB8] hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Join Free Now
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-sans">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Zero spam. Unsubscribe anytime with 1-click.</span>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
