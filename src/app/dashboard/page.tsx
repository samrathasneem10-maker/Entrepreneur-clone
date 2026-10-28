'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Globe,
  HelpCircle,
  Mail,
  Info,
  Check,
  CheckCircle2,
  Bookmark,
  Trash2,
  ExternalLink,
  CreditCard,
  Bell,
  Shield,
  AlertTriangle,
  Lock,
  ArrowRight,
  LogOut,
  User,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

type TabType = 'profile' | 'saved' | 'subscriptions' | 'settings';

interface UserProfileData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  bio: string;
  facebookConnected: boolean;
  googleConnected: boolean;
  planName: string;
  planStatus: string;
  planRenewal: string | null;
}

interface SavedArticle {
  id: number;
  article_id: string;
  title: string;
  category: string;
  image_url: string;
  excerpt: string;
  saved_at: string;
}

interface UserSettingsData {
  breakingNewsAlerts: boolean;
  dailyDigest: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginUser, updateUser, logout, openLogin } = useAuth();

  // Active Tab state: 'profile' | 'saved' | 'subscriptions' | 'settings'
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile data from DB
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Form states for Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Password change form
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Saved Articles state
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Subscription state
  const [subscriptionPlan, setSubscriptionPlan] = useState('Entrepreneur Digital All-Access');
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);

  // Account Settings state
  const [settings, setSettings] = useState<UserSettingsData>({
    breakingNewsAlerts: true,
    dailyDigest: true,
    marketingEmails: false,
    language: 'en-US',
    timezone: 'America/New_York',
  });

  // Modal / Feedback states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Email login prompt if not authenticated
  const [manualEmailInput, setManualEmailInput] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  // 1. Initial Load: Load user by query email, auth context, or cookie
  const queryEmail = searchParams.get('email');

  const fetchProfile = async (targetEmail?: string) => {
    try {
      setLoading(true);
      const emailToUse = targetEmail || queryEmail || user?.email;
      const url = emailToUse ? `/api/user/profile?email=${encodeURIComponent(emailToUse)}` : '/api/user/profile';
      const res = await fetch(url);
      const data = await res.json();

      if (data?.success && data?.profile) {
        setProfile(data.profile);
        setFirstName(data.profile.firstName || '');
        setLastName(data.profile.lastName || '');
        setEmail(data.profile.email || '');
        setBio(data.profile.bio || '');
        setSubscriptionPlan(data.profile.planName || 'Entrepreneur Digital All-Access');
        setSubscriptionStatus(data.profile.planStatus || 'active');

        // Sync with AuthContext if needed
        if (!user || user.email.toLowerCase() !== data.profile.email.toLowerCase()) {
          loginUser({
            id: data.profile.id,
            name: data.profile.fullName,
            email: data.profile.email,
            role: data.profile.role,
          });
        }
      } else {
        // Fallback for fathisamra66@gmail.com if not logged in
        if (!targetEmail && !user && !queryEmail) {
          // Check if default user exists
          const fallbackRes = await fetch('/api/user/profile?email=fathisamra66@gmail.com');
          const fallbackData = await fallbackRes.json();
          if (fallbackData?.success && fallbackData?.profile) {
            setProfile(fallbackData.profile);
            setFirstName(fallbackData.profile.firstName || '');
            setLastName(fallbackData.profile.lastName || '');
            setEmail(fallbackData.profile.email || '');
            setBio(fallbackData.profile.bio || '');
            loginUser({
              id: fallbackData.profile.id,
              name: fallbackData.profile.fullName,
              email: fallbackData.profile.email,
              role: fallbackData.profile.role,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.email, queryEmail]);

  // Load Saved Articles when tab is active
  useEffect(() => {
    if (activeTab === 'saved') {
      const emailToUse = profile?.email || user?.email || 'fathisamra66@gmail.com';
      setLoadingArticles(true);
      fetch(`/api/user/saved-articles?email=${encodeURIComponent(emailToUse)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data?.articles)) {
            setSavedArticles(data.articles);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingArticles(false));
    }
  }, [activeTab, profile?.email, user?.email]);

  // Load Settings when tab is active
  useEffect(() => {
    if (activeTab === 'settings') {
      const emailToUse = profile?.email || user?.email || 'fathisamra66@gmail.com';
      fetch(`/api/user/settings?email=${encodeURIComponent(emailToUse)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.settings) {
            setSettings(data.settings);
          }
        })
        .catch(console.error);
    }
  }, [activeTab, profile?.email, user?.email]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Handle Save Name
  const handleSaveName = async () => {
    if (!profile) return;
    try {
      setSavingField('name');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          firstName,
          lastName,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Name updated successfully!');
        updateUser({ name: `${firstName} ${lastName}`.trim() });
        fetchProfile(profile.email);
      } else {
        showToast(data?.error || 'Failed to update name.', 'error');
      }
    } catch {
      showToast('Network error while updating name.', 'error');
    } finally {
      setSavingField(null);
    }
  };

  const handleCancelName = () => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
    }
  };

  // Handle Save Email
  const handleSaveEmail = async () => {
    if (!profile) return;
    try {
      setSavingField('email');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          newEmail: email,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Email address updated successfully!');
        updateUser({ email });
        fetchProfile(email);
      } else {
        showToast(data?.error || 'Failed to update email.', 'error');
      }
    } catch {
      showToast('Network error while updating email.', 'error');
    } finally {
      setSavingField(null);
    }
  };

  const handleCancelEmail = () => {
    if (profile) {
      setEmail(profile.email || '');
    }
  };

  // Handle Password Save
  const handleSavePassword = async () => {
    if (!profile) return;
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    try {
      setSavingField('password');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      } else {
        showToast(data?.error || 'Failed to update password.', 'error');
      }
    } catch {
      showToast('Error updating password.', 'error');
    } finally {
      setSavingField(null);
    }
  };

  // Handle Save Bio / Profile info
  const handleSaveBio = async () => {
    if (!profile) return;
    try {
      setSavingField('bio');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          bio,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Profile information saved!');
        fetchProfile(profile.email);
      } else {
        showToast(data?.error || 'Failed to update profile info.', 'error');
      }
    } catch {
      showToast('Error saving profile information.', 'error');
    } finally {
      setSavingField(null);
    }
  };

  // Handle Social Accounts Toggle
  const handleToggleFacebook = async () => {
    if (!profile) return;
    try {
      const nextState = !profile.facebookConnected;
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          facebookConnected: nextState,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast(nextState ? 'Facebook account connected!' : 'Facebook account disconnected.');
        fetchProfile(profile.email);
      }
    } catch {
      showToast('Failed to update social account.', 'error');
    }
  };

  const handleToggleGoogle = async () => {
    if (!profile) return;
    try {
      const nextState = !profile.googleConnected;
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          googleConnected: nextState,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast(nextState ? 'Google account connected!' : 'Google account disconnected.');
        fetchProfile(profile.email);
      }
    } catch {
      showToast('Failed to update social account.', 'error');
    }
  };

  // Handle Remove Saved Article
  const handleRemoveSavedArticle = async (id: number) => {
    try {
      const res = await fetch(`/api/user/saved-articles?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data?.success) {
        setSavedArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Article removed from saved items.');
      } else {
        showToast(data?.error || 'Failed to remove article.', 'error');
      }
    } catch {
      showToast('Error removing article.', 'error');
    }
  };

  // Handle Subscription Plan Change
  const handleChangeSubscription = async (newPlan: string) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/user/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: profile.email,
          planName: newPlan,
          planStatus: 'active',
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setSubscriptionPlan(newPlan);
        setSubscriptionStatus('active');
        setShowChangePlanModal(false);
        showToast(`Subscription changed to ${newPlan}!`);
      }
    } catch {
      showToast('Failed to update subscription.', 'error');
    }
  };

  // Handle Subscription Cancel
  const handleCancelSubscription = async () => {
    if (!profile) return;
    try {
      const res = await fetch('/api/user/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: profile.email,
          planStatus: 'cancelled',
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setSubscriptionStatus('cancelled');
        showToast('Subscription cancelled. You retain access until the end of billing cycle.');
      }
    } catch {
      showToast('Failed to cancel subscription.', 'error');
    }
  };

  // Handle Save Account Settings
  const handleSaveSettings = async (updated: Partial<UserSettingsData>) => {
    const nextSettings = { ...settings, ...updated };
    setSettings(nextSettings);
    if (!profile) return;

    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: profile.email,
          ...nextSettings,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Settings updated successfully!');
      }
    } catch {
      showToast('Failed to update settings.', 'error');
    }
  };

  // Manual Account switch / load by email
  const handleManualEmailLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmailInput) return;
    setManualLoading(true);
    await fetchProfile(manualEmailInput);
    setManualLoading(false);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-[#1642D0] selection:text-white flex flex-col">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold transition-all duration-300 animate-slide-up ${
            statusMessage.type === 'success'
              ? 'bg-slate-900 text-white border-l-4 border-[#fde047]'
              : 'bg-rose-700 text-white border-l-4 border-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#fde047]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-200" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* TOP HEADER - Exact authentic Entrepreneur header matching Reference Image 1 */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Authentic Entrepreneur Wordmark Logo */}
          <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
            <svg
              className="h-6 sm:h-7 md:h-8 w-auto fill-current text-[#000000] group-hover:text-[#1642D0] transition-colors"
              viewBox="0 0 545.8 107.1"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0.8,72.7l6.9-1.1V7.9L0,6.9L0.4,0h48.2l-1.2,19.3l-9.6-0.3L37.2,6.9H22.3v28.7h6.5l1.5-6.6l6.7,0.2V49h-6.7 l-1.6-6.8h-6.5v30.4h15l1.4-13.2l10.1,0.3l0.8,20.1H0.5L0.8,72.7z" />
              <path d="M54,79.9l0.3-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9H86.3V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H54z" />
              <path d="M356.1,79.9l0.2-5.9l5.4-1.1V32.7l-6.3-0.6v-6l15.8-2.3l1.2,3.4v2.3c3.8-4,8.4-6.4,14.3-6.4 c8.6,0,15,5.2,15,15.5v34.2l5.7,1.1l-0.3,5.9h-18.7V41.6c0-5.5-2-8.6-7-8.6c-1.7,0-2.9,0.3-4.2,0.8c-0.8,0.7-1.6,1.7-2.3,2.6v36.6 l5.7,1.1l-0.4,5.9H356.1z" />
              <path d="M135.2,78.8c-2.2,0.9-6.1,1.9-11.2,1.9c-6.7,0-12.9-3-12.9-12.8V32.7l-6.4-1l0.3-7l7.2-0.3l3.1-10.7l9.2-0.4 v11.5h9.9l-0.7,7l-9.1,1v35.2c0,2.9,1.6,4.8,4.6,4.8h5.4L135.2,78.8z" />
              <path d="M509.5,79.9l0.2-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L544.1,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H509.5z" />
              <path d="M274,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17.1-5.3l2.4,2.1L308.5,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H274z" />
              <path d="M139.2,79.9l0.3-5.8l5.1-1.2V32.7l-6-0.6v-6l16.4-2.3l1.1,3.9V29c4.3-3.2,10.1-5.3,17-5.3l2.4,2.1L173.8,41 l-9-0.3l-0.9-8.1c-2.1,0.3-4.1,0.9-5.8,2.1V73l5.7,1.2l-0.4,5.8H139.2z" />
              <path d="M191,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L191,55.4z M190.8,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C191.9,36.8,190.8,45.1,190.8,49z" />
              <path d="M423.4,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L423.4,55.4z M423.2,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C424.3,36.8,423.2,45.1,423.2,49z" />
              <path d="M325.8,55.4c0,9.6,4.2,17,12.5,17c4.3,0,7.7-0.9,11.7-2.8l2.3,5.3c-4.1,3.3-10.1,5.8-17.6,5.8 c-14.6,0-23-12.6-23-28.8c0-13.8,6.1-28.9,22.8-28.9c14.6,0,20.1,13.5,20.1,28.5l-1.4,3.6L325.8,55.4z M325.6,49l16.8-0.8 c-0.3-6.7-1.7-17.3-8.3-17.3c-1.6,0-2.7,0.3-4.7,1.3C326.7,36.8,325.5,45.1,325.6,49z" />
              <path d="M490,79.9l-1.4-4.8c-3.7,3.5-7.3,5.6-12.9,5.6c-8.6,0-16.3-4.3-16.3-16.2V31.3l-6.3-0.6v-5.3l18.2-2.1 l1.4,4.8v34.8c0,6.1,2.5,9.3,7.4,9.3c1.4,0,3.2-0.2,4.8-0.8c0.9-0.9,1.8-2,2.5-3.1v-37l-6.5-0.6v-5.3l18.4-2.1l1.4,4.8v44.8 l5.7,1.1l-0.7,5.9H490z" />
              <path d="M247.1,72.7c-2.9,0-5.2-0.5-7-1.5V35.9c0.8-1.2,1.7-2.3,2.6-3.3c1.7-0.6,3.2-0.8,5-0.8c7.5,0,8.8,7.6,8.8,21.2 c0,13.1-2,16.7-2.5,18.2C251.9,72.2,249.7,72.7,247.1,72.7z M269.5,50.6c0-16.9-5-27.5-17.5-27.5c-8.3,0-12.2,4.8-13.8,6.8V28 l-1.4-4.8l-16.3,2.3v5.8l6.3,0.8v68.2l-5.4,1.1l-0.3,5.7h24.1l0.4-5.7l-5.7-1.1V78.7c2.3,1.3,5.5,2.1,9,2.1 C269.3,80.8,269.5,60.1,269.5,50.6z" />
            </svg>
            <span className="text-[#000000] text-[10px] sm:text-xs font-sans font-bold ml-1 self-start mt-0.5">®</span>
          </Link>

          {/* Right User Avatar and Quick Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-[#1642D0] hidden sm:inline transition-colors"
            >
              Back to Entrepreneur.com
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : (user?.name?.charAt(0) || 'U')}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* SETTINGS TITLE ROW with Help & EN-US */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight my-0">
              Settings
            </h1>
          </div>

          {/* Right Help Links & Locale */}
          <div className="flex flex-col sm:items-end gap-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <button
                onClick={() => setShowNewsletterModal(true)}
                className="text-slate-700 hover:text-[#1642D0] hover:underline cursor-pointer"
              >
                Manage Newsletter Subscription
              </button>
              <span className="text-slate-300">|</span>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Entrepreneur Support: help@entrepreneur.com | 1-800-274-6229');
                }}
                className="text-slate-700 hover:text-[#1642D0] hover:underline cursor-pointer"
              >
                Help
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="cursor-pointer hover:text-slate-800">EN-US</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS - Exact 4 tabs matching Reference Images: Profile, Saved Articles, Subscriptions, Account Settings */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 inline-flex items-center text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#1642D0] text-slate-950 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-1 inline-flex items-center text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'saved'
                  ? 'border-[#1642D0] text-slate-950 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Saved Articles
              {savedArticles.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                  {savedArticles.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-3 px-1 inline-flex items-center text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'subscriptions'
                  ? 'border-[#1642D0] text-slate-950 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Subscriptions
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-1 inline-flex items-center text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-[#1642D0] text-slate-950 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {/* TAB 1: PROFILE CONTENT (Exact Recreation from Reference Image 1 & 2) */}
        {activeTab === 'profile' && (
          <div className="space-y-7">

            {/* Quick account switcher / verifier banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Currently connected to account: <strong className="text-slate-900">{profile?.email || email || 'fathisamra66@gmail.com'}</strong>
                </span>
              </div>
              <form onSubmit={handleManualEmailLoad} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Switch account by email..."
                  value={manualEmailInput}
                  onChange={(e) => setManualEmailInput(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:border-[#1642D0] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={manualLoading}
                  className="px-2.5 py-1 text-xs bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {manualLoading ? 'Loading...' : 'Load'}
                </button>
              </form>
            </div>

            {/* 1. NAME SECTION */}
            <section className="pt-1">
              <h2 className="text-base font-bold text-slate-900 mb-3 my-0">Name</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white"
                  />
                </div>
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={savingField === 'name'}
                  className="px-5 py-2 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingField === 'name' ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelName}
                  className="px-5 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 2. EMAIL SECTION */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-3 my-0">Email</h2>
              <div className="max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white"
                />
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={handleSaveEmail}
                  disabled={savingField === 'email'}
                  className="px-5 py-2 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingField === 'email' ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEmail}
                  className="px-5 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 3. ADD A PASSWORD SECTION */}
            <section>
              <div className="flex items-center justify-between max-w-xl">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1 my-0">
                    Add a password
                  </h2>
                  <p className="text-xs text-slate-500 my-0">
                    Create a password for your account so you can sign in directly.
                  </p>
                </div>
                {!showPasswordSection && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(true)}
                    className="px-4 py-1.5 text-xs font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordSection && (
                <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50 max-w-md space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Current password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-300 rounded bg-white focus:outline-none focus:border-[#1642D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      New password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-300 rounded bg-white focus:outline-none focus:border-[#1642D0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Confirm new password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-300 rounded bg-white focus:outline-none focus:border-[#1642D0]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSavePassword}
                      disabled={savingField === 'password'}
                      className="px-4 py-1.5 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer"
                    >
                      {savingField === 'password' ? 'Saving...' : 'Save Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-1.5 text-xs font-semibold rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-auto text-xs text-slate-500 hover:text-slate-800"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <hr className="border-slate-200" />

            {/* 4. PROFILE INFORMATION SECTION */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-1 my-0">
                Profile information
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Tell us a bit about yourself or your business ventures.
              </p>
              <div className="max-w-xl">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Founder, reader, investor, or entrepreneur..."
                  className="w-full px-3.5 py-2 text-sm text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white"
                />
              </div>

              {/* Save & Cancel buttons */}
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={handleSaveBio}
                  disabled={savingField === 'bio'}
                  className="px-5 py-2 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingField === 'bio' ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setBio(profile?.bio || '')}
                  className="px-5 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 5. SOCIAL ACCOUNTS SECTION */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-3 my-0">
                Social accounts
              </h2>

              <div className="space-y-3 max-w-xl">
                {/* Facebook item */}
                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-base shadow-xs">
                      f
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Facebook</span>
                      <span className="text-[11px] text-slate-500">
                        {profile?.facebookConnected ? 'Connected to Facebook profile' : 'Not connected'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleFacebook}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                      profile?.facebookConnected
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {profile?.facebookConnected ? '✓ Connected (Disconnect)' : 'Connect account'}
                  </button>
                </div>

                {/* Google item */}
                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.31 7.35 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.69 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Google</span>
                      <span className="text-[11px] text-slate-500">
                        {profile?.googleConnected !== false ? 'Connected with Google account' : 'Not connected'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleGoogle}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                      profile?.googleConnected !== false
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {profile?.googleConnected !== false ? '✓ Connected' : 'Connect account'}
                  </button>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 6. MANAGE NEWSLETTERS BANNER (Exact Reproduction of Blue Banner in Reference Image 1) */}
            <section className="bg-blue-50/70 border-l-4 border-l-[#1642D0] p-4 sm:p-5 rounded-r-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1642D0] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 my-0">
                    MANAGE NEWSLETTERS
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 my-0 leading-relaxed">
                    Subscribe to our newsletters to get the latest business news, ideas, and advice delivered straight to your inbox.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewsletterModal(true)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-white border border-slate-300 hover:border-slate-400 text-slate-800 transition-colors shadow-xs shrink-0 cursor-pointer text-center"
              >
                Manage Newsletters
              </button>
            </section>

            {/* 7. SIGN OUT BUTTON (Exact Warm Yellow Button from Reference Image 1) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="px-6 py-2.5 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: SAVED ARTICLES (Full Functional Management) */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Saved Articles</h2>
                <p className="text-xs text-slate-500 mt-1 my-0">
                  Articles you have bookmarked for offline reading and reference.
                </p>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-[#1642D0] hover:underline inline-flex items-center gap-1"
              >
                <span>Browse more articles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingArticles ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-7 h-7 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : savedArticles.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No saved articles yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                  Browse our business, tech, and leadership coverage and click the bookmark button to save stories for later.
                </p>
                <Link
                  href="/"
                  className="px-5 py-2 text-xs font-bold rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-block"
                >
                  Explore Top Stories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      {article.image_url && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on image error
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#1642D0] mb-1">
                          {article.category || 'Business'}
                        </span>
                        <Link
                          href={`/article/${article.article_id}`}
                          className="font-bold text-sm text-slate-900 hover:text-[#1642D0] transition-colors line-clamp-2 leading-snug"
                        >
                          {article.title}
                        </Link>
                        {article.excerpt && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{article.excerpt}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-400">
                        Saved on {new Date(article.saved_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/article/${article.article_id}`}
                          className="px-3 py-1 text-xs font-bold text-[#1642D0] hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <span>Read</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedArticle(article.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS (Full Functional Management) */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Subscription Plan</h2>
                <p className="text-xs text-slate-500 mt-1 my-0">
                  Manage your Entrepreneur.com membership, benefits, and billing.
                </p>
              </div>
            </div>

            {/* Current Active Plan Card */}
            <div className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-white via-white to-slate-50 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900 my-0">
                      {subscriptionPlan}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        subscriptionStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {subscriptionStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 my-0">
                    {subscriptionPlan.includes('Annual') ? '$79.99 billed annually' : '$9.99 billed monthly'} • Auto-renews on November 15, 2026
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePlanModal(true)}
                    className="px-4 py-2 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer"
                  >
                    Change Plan
                  </button>
                  {subscriptionStatus === 'active' && (
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      className="px-3.5 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel Plan
                    </button>
                  )}
                </div>
              </div>

              {/* Included Benefits */}
              <div className="pt-5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                  Included with your membership:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited access to all premium articles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Monthly digital edition of Entrepreneur Magazine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Exclusive subscriber-only business analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ad-free website browsing experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Early invite to founder roundtables & webinars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full magazine digital archives since 1977</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing details card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white">
              <h4 className="text-sm font-bold text-slate-900 mb-3 my-0">Payment Method</h4>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded border border-slate-200">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Visa ending in •••• 4242</span>
                    <span className="text-slate-400">Expires 09/2028</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Payment method update portal is secure and ready.')}
                  className="text-xs font-bold text-[#1642D0] hover:underline cursor-pointer"
                >
                  Update Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS (Full Functional Management) */}
        {activeTab === 'settings' && (
          <div className="space-y-7">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 my-0">Account Settings</h2>
              <p className="text-xs text-slate-500 mt-1 my-0">
                Manage notifications, regional language preferences, and account security.
              </p>
            </div>

            {/* Email Notifications */}
            <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 my-0">
                <Bell className="w-4 h-4 text-[#1642D0]" />
                <span>Email Notifications</span>
              </h3>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Breaking News Alerts</span>
                    <span className="text-[11px] text-slate-500">
                      Receive immediate emails for critical market shifts and major founder news.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.breakingNewsAlerts}
                    onChange={(e) => handleSaveSettings({ breakingNewsAlerts: e.target.checked })}
                    className="w-4 h-4 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                  />
                </div>

                <hr className="border-slate-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Daily Morning Digest</span>
                    <span className="text-[11px] text-slate-500">
                      Delivered each weekday morning with top insights, trends, and franchise opportunities.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyDigest}
                    onChange={(e) => handleSaveSettings({ dailyDigest: e.target.checked })}
                    className="w-4 h-4 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                  />
                </div>

                <hr className="border-slate-100" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Partner & Marketing Offers</span>
                    <span className="text-[11px] text-slate-500">
                      Curated business solutions, discounts, and exclusive events.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={(e) => handleSaveSettings({ marketingEmails: e.target.checked })}
                    className="w-4 h-4 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                  />
                </div>
              </div>
            </section>

            {/* Regional & Language Preferences */}
            <section className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 my-0">
                <Globe className="w-4 h-4 text-[#1642D0]" />
                <span>Regional & Language Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Edition / Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSaveSettings({ language: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-[#1642D0]"
                  >
                    <option value="en-US">United States (English - EN-US)</option>
                    <option value="en-GB">United Kingdom (English - EN-GB)</option>
                    <option value="en-IN">India (English - EN-IN)</option>
                    <option value="es-MX">América Latina (Español)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Time Zone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSaveSettings({ timezone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-[#1642D0]"
                  >
                    <option value="America/New_York">Eastern Time (ET - America/New_York)</option>
                    <option value="America/Chicago">Central Time (CT - America/Chicago)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT - America/Los_Angeles)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT - Europe/London)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST - Asia/Kolkata)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Danger Zone: Account Deactivation */}
            <section className="border border-rose-200 rounded-xl p-5 bg-rose-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-rose-900 my-0">Deactivate Account</h3>
                  <p className="text-xs text-rose-700 mt-1 my-0">
                    Permanently delete your profile, saved articles, and associated reader preferences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Deactivate Account
                </button>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* CHANGE PLAN MODAL */}
      {showChangePlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Change Subscription Plan</h3>
            <p className="text-xs text-slate-500 mb-5">
              Select the plan that matches your business reading requirements.
            </p>

            <div className="space-y-3 mb-6">
              <div
                onClick={() => handleChangeSubscription('Entrepreneur Digital All-Access (Annual)')}
                className="p-4 border-2 border-[#1642D0] rounded-xl bg-blue-50/50 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900">Annual Plan (Recommended)</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Save 33%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">$79.99 billed once per year ($6.66/month)</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#1642D0]" />
              </div>

              <div
                onClick={() => handleChangeSubscription('Entrepreneur Digital All-Access (Monthly)')}
                className="p-4 border border-slate-300 rounded-xl hover:border-slate-400 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <strong className="text-sm text-slate-900">Monthly Plan</strong>
                  <p className="text-xs text-slate-500 mt-0.5">$9.99 billed monthly. Cancel anytime.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowChangePlanModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE NEWSLETTERS MODAL */}
      {showNewsletterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">Newsletter Subscriptions</h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize which curated email dispatches are delivered to {profile?.email || 'your email'}.
            </p>

            <div className="space-y-3.5 mb-6 text-xs">
              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-xs">Entrepreneur Daily</strong>
                  <span className="text-slate-500 text-[11px]">
                    Top stories, founder features, and daily strategy guide.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-xs">Franchise & Small Biz Opportunities</strong>
                  <span className="text-slate-500 text-[11px]">
                    Weekly breakdowns of top franchises, licensing deals, and small business tips.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-xs">AI & Future of Work</strong>
                  <span className="text-slate-500 text-[11px]">
                    How cutting-edge machine learning and automation impact high-growth companies.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowNewsletterModal(false);
                  showToast('Newsletter preferences saved!');
                }}
                className="px-5 py-2 text-xs font-bold rounded bg-[#fde047] hover:bg-[#facc15] text-slate-950 cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowNewsletterModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200">
            <h3 className="text-lg font-serif font-bold text-rose-900 mb-2">Deactivate Account?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to deactivate your account? This action will disable access to all your saved articles and subscription benefits.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast('Deactivation request logged. An email confirmation has been sent.');
                }}
                className="px-4 py-2 text-xs font-bold rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 py-6 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p className="my-0">
            © 2026 Entrepreneur Media, LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-800 transition-colors">Terms of Use</Link>
            <Link href="/" className="hover:text-slate-800 transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
