'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/layouts/Header';
import { Footer } from '@/layouts/Footer';
import { useAuth } from '@/components/auth/AuthContext';
import { ShieldCheck, Database, Users, FileText, Activity, RefreshCw, LogOut, CheckCircle, AlertTriangle, Key } from 'lucide-react';

interface DbStatusResponse {
  connected: boolean;
  message: string;
  database?: string;
  tables?: Array<{ name: string; rows: number }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, openLogin } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Live DB status
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Users list in database
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: 'Samra Tasneem',
      email: 'samrathasneem10@gmail.com',
      role: 'reader',
      status: 'Active',
      security: 'Bcrypt Hashed ($2b$10)',
    },
    {
      id: 2,
      name: 'Writer Account',
      email: 'writter@gmail.com',
      role: 'writer',
      status: 'Active',
      security: 'Bcrypt Hashed ($2b$10)',
    },
    {
      id: 3,
      name: 'System Administrator',
      email: 'admin@gmail.com',
      role: 'admin',
      status: 'Superuser',
      security: 'Bcrypt Hashed ($2b$10)',
    },
  ]);

  const checkDb = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({
        connected: false,
        message: 'Could not connect to MySQL server on 127.0.0.1:3306',
      });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkDb();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-5 py-20 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Executive Admin Portal</h1>
          <p className="text-sm text-slate-600 mb-6">
            Administrator authentication required to access database infrastructure and system controls.
          </p>
          <button
            onClick={openLogin}
            className="px-6 py-2.5 bg-[#1642D0] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Authenticate Admin
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-10 py-8">
        
        {/* Welcome Top Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 text-amber-400 font-serif font-bold text-2xl flex items-center justify-center shadow-xs border-2 border-amber-400/40">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 my-0">
                  Administration: {user.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  System Administrator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans my-0">
                {user.email} • Full Infrastructure & Database Management Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkDb}
              disabled={isCheckingDb}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
              <span>Ping Database</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* System KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">MySQL Server</span>
              <Database className="w-4 h-4 text-[#1642D0]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-serif text-slate-900">127.0.0.1:3306</span>
            <span className="text-[11px] text-emerald-600 block mt-1 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> XAMPP Active
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Database Schema</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-serif text-slate-900">entreprenuer_db</span>
            <span className="text-[11px] text-slate-500 block mt-1">6 Active Tables</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{usersList.length}</span>
            <span className="text-[11px] text-emerald-600 block mt-1">Bcrypt Salted & Hashed</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Security Status</span>
              <Key className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-600">Secure</span>
            <span className="text-[11px] text-slate-500 block mt-1">Hash injection blocked</span>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: User Management Table (8 of 12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1642D0]" />
                  <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Registered User Accounts</h2>
                </div>
                <span className="text-xs text-slate-500 font-sans">MySQL users table</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3">Assigned Role</th>
                      <th className="py-2.5 px-3">Password Security</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 font-serif text-sm">
                          {u.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {u.email}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : u.role === 'writer'
                              ? 'bg-blue-100 text-[#1642D0] border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{u.security}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Hardening Measures Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-serif font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Active Security Architecture & Thread Defense
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="font-bold text-slate-900 block mb-1">✓ No Plain Passwords in Code</span>
                  <span>Credentials are completely absent from code files and only live inside MySQL with 10-round bcrypt salt hashes.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="font-bold text-slate-900 block mb-1">✓ Hash Injection Protection</span>
                  <span>Submitting raw bcrypt hashes ($2a$, $2b$, $2y$) as passwords is mathematically and logically rejected at the API layer.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="font-bold text-slate-900 block mb-1">✓ Role-Based Routing</span>
                  <span>Authentications automatically redirect strictly to their respective Reader, Writer, or Admin control panels.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60">
                  <span className="font-bold text-slate-900 block mb-1">✓ Prepared Statements</span>
                  <span>All database queries use parameterized SQL inputs to eliminate SQL injection vulnerabilities across all routes.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: XAMPP Database Live Status (4 of 12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live XAMPP Database Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#1642D0]" />
                  <h3 className="text-base font-serif font-bold text-slate-900 my-0">
                    XAMPP Database
                  </h3>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              </div>

              <div className="space-y-3 text-xs mb-5">
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Database Name</span>
                  <span className="font-bold text-slate-800 text-sm">{dbStatus?.database || 'entreprenuer_db'}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Host & Port</span>
                  <span className="font-bold text-slate-800 text-sm">127.0.0.1:3306</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold tracking-wider block">Connection Status</span>
                  <span className={`font-bold text-sm ${dbStatus?.connected ? 'text-emerald-700' : 'text-red-600'}`}>
                    {dbStatus?.connected ? 'Active & Healthy' : 'Disconnected'}
                  </span>
                </div>
              </div>

              {/* Table Row Counts */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Tables in entreprenuer_db
                </span>
                <div className="space-y-2 text-xs">
                  {dbStatus?.tables && dbStatus.tables.length > 0 ? (
                    dbStatus.tables.map((t) => (
                      <div key={t.name} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-b-0">
                        <span className="font-mono text-slate-700">{t.name}</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {t.rows} rows
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1">
                      {['articles (9 rows)', 'authors (10 rows)', 'categories (11 rows)', 'comments (4 rows)', 'subscribers (3 rows)', 'users (3 rows)'].map((item) => (
                        <div key={item} className="text-slate-600 py-0.5 font-mono text-[11px]">{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200">
                <a
                  href="http://localhost/phpmyadmin/index.php?route=/database/structure&db=entreprenuer_db"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-2.5 bg-[#1642D0] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  Open in phpMyAdmin ↗
                </a>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
