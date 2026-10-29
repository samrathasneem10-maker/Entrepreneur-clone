'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
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
  Camera,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Phone,
  MessageSquare,
  FileQuestion,
  Headphones,
} from 'lucide-react';

type TabType = 'profile' | 'saved' | 'subscriptions' | 'settings' | 'help';

interface UserProfileData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  bio: string;
  phone: string;
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
  const { user, loginUser, updateUser, logout } = useAuth();

  // Active Tab state: 'profile' | 'saved' | 'subscriptions' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Profile data from DB
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Form states for Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  // 1. Initial Load: Load user by query email, auth context, or cookie
  const queryEmail = searchParams.get('email');

  const fetchProfile = async (targetEmail?: string) => {
    try {
      setLoading(true);
      const emailToUse = targetEmail || queryEmail || user?.email || 'fathisamra66@gmail.com';
      const url = `/api/user/profile?email=${encodeURIComponent(emailToUse)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data?.success && data?.profile) {
        setProfile(data.profile);
        setFirstName(data.profile.firstName || 'fathi');
        setLastName(data.profile.lastName || 'samra');
        setEmail(data.profile.email || 'fathisamra66@gmail.com');
        setPhone(data.profile.phone || '+1 (555) 234-5678');
        setBio(data.profile.bio || '');
        setSubscriptionPlan(data.profile.planName || 'Entrepreneur Digital All-Access');
        setSubscriptionStatus(data.profile.planStatus || 'active');

        // Sync with AuthContext
        if (!user || user.email.toLowerCase() !== data.profile.email.toLowerCase()) {
          loginUser({
            id: data.profile.id,
            name: data.profile.fullName || `${data.profile.firstName} ${data.profile.lastName}`,
            email: data.profile.email,
            role: data.profile.role,
            avatar: data.profile.avatar,
          });
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

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Handle Profile Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData?.success || !uploadData?.url) {
        throw new Error(uploadData?.error || 'Failed to upload photo.');
      }

      const newAvatarUrl = uploadData.url;
      const userEmail = profile?.email || user?.email || 'samrathasneem10@gmail.com';

      const saveRes = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: userEmail,
          avatar: newAvatarUrl,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveData?.success) {
        throw new Error(saveData?.error || 'Failed to update profile photo.');
      }

      updateUser({ avatar: newAvatarUrl });
      if (user) {
        const updated = { ...user, avatar: newAvatarUrl };
        loginUser(updated);
        try {
          localStorage.setItem('entrepreneur_user', JSON.stringify(updated));
        } catch {}
      }

      setProfile((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
      showToast('Profile photo updated successfully!');
      fetchProfile(userEmail);
    } catch (err: any) {
      console.error('Error changing photo:', err);
      showToast(err?.message || 'Error updating profile photo.', 'error');
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
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
      setFirstName(profile.firstName || 'fathi');
      setLastName(profile.lastName || 'samra');
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
      setEmail(profile.email || 'fathisamra66@gmail.com');
    }
  };

  // Handle Save Phone
  const handleSavePhone = async () => {
    if (!profile) return;
    try {
      setSavingField('phone');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: profile.email,
          phone,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showToast('Phone number updated successfully!');
        fetchProfile(profile.email);
      } else {
        showToast(data?.error || 'Failed to update phone number.', 'error');
      }
    } catch {
      showToast('Error saving phone number.', 'error');
    } finally {
      setSavingField(null);
    }
  };

  const handleCancelPhone = () => {
    if (profile) {
      setPhone(profile.phone || '+1 (555) 234-5678');
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

  // Sign out handler
  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 antialiased selection:bg-[#1642D0] selection:text-white flex flex-col">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-lg shadow-xl text-sm font-semibold transition-all duration-300 animate-slide-up ${
            statusMessage.type === 'success'
              ? 'bg-slate-900 text-white border-l-4 border-[#fde047]'
              : 'bg-rose-700 text-white border-l-4 border-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#fde047]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-200" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* TOP HEADER - Exact authentic Entrepreneur header matching Reference Image 2 */}
      <header className="w-full bg-white border-b border-slate-200/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Authentic Entrepreneur Wordmark Logo */}
          <Link href="/" className="flex items-center group py-0.5 select-none" aria-label="Entrepreneur">
            <svg
              className="h-7 sm:h-8 md:h-9 w-auto fill-current text-[#000000] group-hover:text-[#1642D0] transition-colors"
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
            <span className="text-[#000000] text-xs font-sans font-bold ml-1 self-start mt-0.5">®</span>
          </Link>

          {/* Right User Avatar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || profile?.avatar || '/images/user-avatar-butterfly.png'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <span className="font-bold text-xs sm:text-sm text-slate-900 hidden sm:inline">
                {user?.name || profile?.fullName || 'Samra Tasneem'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* READER DASHBOARD TITLE ROW */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-serif font-bold text-slate-900 tracking-tight my-0">
            Reader Dashboard
          </h1>
        </div>

        {/* WHITE CARD CONTAINER FOR SETTINGS (Matching Reference Images 3 & 4) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">

          {/* NAVIGATION TABS WITH SUITABLE ICONS (4 tabs only: Profile, Saved Articles, Subscriptions, Account Settings) */}
          <div className="border-b border-slate-200 bg-slate-50/70">
            <nav className="flex items-stretch divide-x divide-slate-200 overflow-x-auto scrollbar-none" aria-label="Tabs">
              
              {/* 1. Profile Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 sm:px-8 inline-flex items-center gap-2.5 text-sm sm:text-base font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <User className="w-4 h-4 text-slate-700" />
                <span>Profile</span>
              </button>

              {/* 2. Saved Articles Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-6 sm:px-8 inline-flex items-center gap-2.5 text-sm sm:text-base font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'saved'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Bookmark className="w-4 h-4 text-slate-700" />
                <span>Saved Articles</span>
                {savedArticles.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">
                    {savedArticles.length}
                  </span>
                )}
              </button>

              {/* 3. Subscriptions Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('subscriptions')}
                className={`py-4 px-6 sm:px-8 inline-flex items-center gap-2.5 text-sm sm:text-base font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'subscriptions'
                    ? 'bg-white text-slate-950 border-t-2 border-t-slate-950 border-b-2 border-b-[#1642D0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>Subscriptions</span>
              </button>


            </nav>
          </div>

          {/* TAB CONTENT INNER PADDING */}
          <div className="p-6 sm:p-10 lg:p-12">

            {/* TAB 1: PROFILE CONTENT (Exact Recreation from Reference Images 3 & 4) */}
            {activeTab === 'profile' && (
              <div className="space-y-8 w-full">

                {/* Subheading: Profile */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 my-0">
                    Profile
                  </h2>
                  <hr className="border-slate-200 mt-4 mb-7" />
                </div>

                {/* Profile Picture Header with working Change Photo option */}
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="relative group shrink-0">
                    <img
                      src={user?.avatar || profile?.avatar || '/images/user-avatar-butterfly.png'}
                      alt="Profile Avatar"
                      className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold cursor-pointer"
                      title="Upload new profile picture"
                    >
                      Change
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 my-0">
                        {user?.name || profile?.fullName || 'Samra Tasneem'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="text-xs sm:text-[13px] font-semibold text-[#1642D0] hover:text-[#0f32a8] hover:underline cursor-pointer flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{uploadingPhoto ? 'Uploading...' : 'Change photo'}</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 my-0 mt-0.5">
                      {user?.email || profile?.email || 'samrathasneem10@gmail.com'}
                    </p>
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 1. NAME SECTION (Image 2) */}
                <section>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 my-0">
                    Name
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full h-11 sm:h-12 px-4 text-base text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full h-11 sm:h-12 px-4 text-base text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Save & Cancel buttons */}
                  <div className="flex items-center mt-5">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={savingField === 'name'}
                      className="px-7 py-2.5 text-sm sm:text-base font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {savingField === 'name' ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelName}
                      className="px-7 py-2.5 text-sm sm:text-base font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer ml-3"
                    >
                      Cancel
                    </button>
                  </div>
                </section>

                <hr className="border-slate-200 my-8" />

                {/* 2. EMAIL SECTION (Image 2) */}
                <section>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 my-0">
                    Email
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 sm:h-12 px-4 text-base text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1642D0] focus:border-[#1642D0] transition-colors bg-white shadow-2xs"
                    />
                  </div>

                  {/* Save & Cancel buttons */}
                  <div className="flex items-center mt-5">
                    <button
                      type="button"
                      onClick={handleSaveEmail}
                      disabled={savingField === 'email'}
                      className="px-7 py-2.5 text-sm sm:text-base font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {savingField === 'email' ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEmail}
                      className="px-7 py-2.5 text-sm sm:text-base font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer ml-3"
                    >
                      Cancel
                    </button>
                  </div>
                </section>

                <hr className="border-slate-200 my-8" />

                {/* 3. ADD A PASSWORD SECTION (Clean text link without extra underline or default text boxes) */}
                <section>
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="text-[#2563EB] hover:text-[#1D4ED8] text-base sm:text-lg font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 no-underline transition-colors"
                    >
                      <span>Add a password</span>
                    </button>
                  </div>

                  {showPasswordSection && (
                    <div className="mt-5 p-5 border border-slate-200 rounded-lg bg-slate-50/70 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Current password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full h-11 px-4 text-sm text-slate-900 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#1642D0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          New password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full h-11 px-4 text-sm text-slate-900 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#1642D0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Confirm new password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full h-11 px-4 text-sm text-slate-900 border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#1642D0]"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleSavePassword}
                          disabled={savingField === 'password'}
                          className="px-6 py-2 text-sm font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer"
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
                          className="px-6 py-2 text-sm font-semibold rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-auto text-xs text-slate-500 hover:text-slate-800"
                        >
                          {showPassword ? 'Hide password' : 'Show password'}
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                <hr className="border-slate-200 my-8" />

                {/* 4. PROFILE INFORMATION SECTION (Only Save & Cancel buttons directly below heading, no textarea) */}
                <section>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 my-0">
                    Profile information
                  </h3>

                  {/* Save & Cancel buttons directly below section heading */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      disabled={savingField === 'bio'}
                      className="px-7 py-2.5 text-sm sm:text-base font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {savingField === 'bio' ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBio(profile?.bio || '')}
                      className="px-7 py-2.5 text-sm sm:text-base font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer ml-3"
                    >
                      Cancel
                    </button>
                  </div>
                </section>

                <hr className="border-slate-200 my-8" />

                {/* 5. SOCIAL ACCOUNTS SECTION (Horizontal row, side by side, increased spacing) */}
                <section>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5 my-0">
                    Social accounts
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
                    
                    {/* Facebook Item with Yellow Button */}
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                          f
                        </div>
                        <span className="text-base font-bold text-slate-900">Facebook</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleFacebook}
                        className={`ml-auto px-6 py-2.5 text-sm font-bold rounded-md transition-colors cursor-pointer shadow-xs ${
                          profile?.facebookConnected
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            : 'bg-[#fde047] hover:bg-[#facc15] text-slate-950'
                        }`}
                      >
                        {profile?.facebookConnected ? 'Connected' : 'Connect account'}
                      </button>
                    </div>

                    {/* Google Item with Blue Checkmark */}
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-xs shrink-0">
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
                        <span className="text-base font-bold text-slate-900">Google</span>
                      </div>

                      <div className="ml-auto flex items-center gap-1.5 text-[#2563EB] font-bold text-base">
                        <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                        <span>Connected</span>
                      </div>
                    </div>

                  </div>
                </section>

                {/* 6. MANAGE NEWSLETTERS BANNER (Full width matching card, blue text, font size increased) */}
                <section className="pt-6">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight my-0 uppercase mb-4">
                    MANAGE NEWSLETTERS
                  </h3>

                  <div className="w-full bg-[#EFF6FF] border-l-4 border-l-[#2563EB] p-5 sm:p-7 rounded-r-lg">
                    <div className="flex items-start gap-3.5">
                      <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-base sm:text-[17px] text-[#1642D0] my-0 leading-relaxed font-medium">
                          To manage your newsletter subscription click the button below to access.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowNewsletterModal(true)}
                          className="text-[#1642D0] hover:text-blue-800 font-bold text-base sm:text-[17px] underline cursor-pointer block mt-3"
                        >
                          Manage Newsletters
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7. SIGN OUT BUTTON (Increased font size & visual appearance) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-9 py-3.5 text-base sm:text-lg font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Sign out</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: SAVED ARTICLES */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 my-0">
                    Saved Articles
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 my-0">
                    Articles and stories you have bookmarked for future reading.
                  </p>
                  <hr className="border-slate-200 mt-4 mb-6" />
                </div>

                {loadingArticles ? (
                  <div className="py-16 flex justify-center items-center">
                    <div className="w-8 h-8 border-3 border-[#1642D0] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : savedArticles.length === 0 ? (
                  <div className="text-center py-20 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                    <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No saved articles yet</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                      Explore stories across business, technology, and leadership and click the bookmark button to save them.
                    </p>
                    <Link
                      href="/"
                      className="px-6 py-2.5 text-sm font-bold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors inline-block"
                    >
                      Browse Top Stories
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {savedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="border border-slate-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="flex gap-4">
                          {article.image_url && (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#1642D0] mb-1">
                              {article.category || 'Business'}
                            </span>
                            <Link
                              href={`/article/${article.article_id}`}
                              className="font-bold text-base sm:text-lg text-slate-900 hover:text-[#1642D0] transition-colors line-clamp-2 leading-snug"
                            >
                              {article.title}
                            </Link>
                            {article.excerpt && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{article.excerpt}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs sm:text-sm">
                          <span className="text-slate-400">
                            Saved on {new Date(article.saved_at).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/article/${article.article_id}`}
                              className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#1642D0] hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <span>Read</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveSavedArticle(article.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                              title="Remove bookmark"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUBSCRIPTIONS */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 my-0">
                    Subscriptions
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 my-0">
                    Manage your Entrepreneur.com membership, benefits, and billing options.
                  </p>
                  <hr className="border-slate-200 mt-4 mb-6" />
                </div>

                {/* Current Active Plan Card */}
                <div className="border border-slate-200 rounded-xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-slate-50 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 my-0">
                          {subscriptionPlan}
                        </h3>
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            subscriptionStatus === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {subscriptionStatus}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1.5 my-0">
                        {subscriptionPlan.includes('Annual') ? '$79.99 billed annually' : '$9.99 billed monthly'} • Auto-renews on November 15, 2026
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowChangePlanModal(true)}
                        className="px-5 py-2.5 text-sm font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 transition-colors shadow-xs cursor-pointer"
                      >
                        Change Plan
                      </button>
                      {subscriptionStatus === 'active' && (
                        <button
                          type="button"
                          onClick={handleCancelSubscription}
                          className="px-5 py-2.5 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          Cancel Plan
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Included Benefits */}
                  <div className="pt-6">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-4">
                      Included with your membership:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Unlimited access to all premium articles</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Monthly digital edition of Entrepreneur Magazine</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Exclusive subscriber-only business analysis</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Ad-free website browsing experience</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Early invite to founder roundtables & webinars</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Full magazine digital archives since 1977</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing card */}
                <div className="border border-slate-200 rounded-xl p-6 bg-white">
                  <h4 className="text-base font-bold text-slate-900 mb-3 my-0">Payment Method</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 rounded-md border border-slate-200">
                        <CreditCard className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Visa ending in •••• 4242</span>
                        <span className="text-xs text-slate-400">Expires 09/2028</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Payment method update portal is secure and ready.')}
                      className="text-sm font-bold text-[#1642D0] hover:underline cursor-pointer"
                    >
                      Update Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 my-0">
                    Account Settings
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 my-0">
                    Manage notifications, preferences, and account security.
                  </p>
                  <hr className="border-slate-200 mt-4 mb-6" />
                </div>

                {/* Email Notifications */}
                <section className="border border-slate-200 rounded-xl p-6 bg-white space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 my-0">
                    <Bell className="w-5 h-5 text-[#1642D0]" />
                    <span>Email Notifications</span>
                  </h3>

                  <div className="space-y-5 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">Breaking News Alerts</span>
                        <span className="text-xs text-slate-500">
                          Receive immediate emails for critical market shifts and major founder news.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.breakingNewsAlerts}
                        onChange={(e) => handleSaveSettings({ breakingNewsAlerts: e.target.checked })}
                        className="w-5 h-5 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                      />
                    </div>

                    <hr className="border-slate-100" />

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">Daily Morning Digest</span>
                        <span className="text-xs text-slate-500">
                          Delivered each weekday morning with top insights, trends, and franchise opportunities.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.dailyDigest}
                        onChange={(e) => handleSaveSettings({ dailyDigest: e.target.checked })}
                        className="w-5 h-5 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                      />
                    </div>

                    <hr className="border-slate-100" />

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">Partner & Marketing Offers</span>
                        <span className="text-xs text-slate-500">
                          Curated business solutions, discounts, and exclusive events.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={(e) => handleSaveSettings({ marketingEmails: e.target.checked })}
                        className="w-5 h-5 text-[#1642D0] rounded border-slate-300 focus:ring-[#1642D0] cursor-pointer"
                      />
                    </div>
                  </div>
                </section>

                {/* Regional & Language Preferences */}
                <section className="border border-slate-200 rounded-xl p-6 bg-white space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 my-0">
                    <Globe className="w-5 h-5 text-[#1642D0]" />
                    <span>Regional & Language Preferences</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Edition / Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSaveSettings({ language: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-[#1642D0]"
                      >
                        <option value="en-US">United States (English - EN-US)</option>
                        <option value="en-GB">United Kingdom (English - EN-GB)</option>
                        <option value="en-IN">India (English - EN-IN)</option>
                        <option value="es-MX">América Latina (Español)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Time Zone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSaveSettings({ timezone: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:border-[#1642D0]"
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

                {/* Danger Zone */}
                <section className="border border-rose-200 rounded-xl p-6 bg-rose-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-rose-900 my-0">Deactivate Account</h3>
                      <p className="text-sm text-rose-700 mt-1 my-0">
                        Permanently delete your profile, saved articles, and associated reader preferences.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 5: HELP & SUPPORT (Instruction 5) */}
            {activeTab === 'help' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 my-0">
                    Help & Support
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 my-0">
                    Get assistance with your Entrepreneur account, subscriptions, billing, and access.
                  </p>
                  <hr className="border-slate-200 mt-4 mb-6" />
                </div>

                {/* Support Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-[#1642D0] transition-colors">
                    <Mail className="w-6 h-6 text-[#1642D0] mb-3" />
                    <h3 className="text-base font-bold text-slate-900 mb-1">Email Support</h3>
                    <p className="text-xs text-slate-500 mb-3">Reach our dedicated support team 24/7.</p>
                    <a
                      href="mailto:help@entrepreneur.com"
                      className="text-sm font-bold text-[#1642D0] hover:underline"
                    >
                      help@entrepreneur.com
                    </a>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-[#1642D0] transition-colors">
                    <Phone className="w-6 h-6 text-[#1642D0] mb-3" />
                    <h3 className="text-base font-bold text-slate-900 mb-1">Phone Assistance</h3>
                    <p className="text-xs text-slate-500 mb-3">Mon - Fri, 9am - 5pm EST.</p>
                    <a
                      href="tel:1-800-274-6229"
                      className="text-sm font-bold text-[#1642D0] hover:underline"
                    >
                      1-800-274-6229
                    </a>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-[#1642D0] transition-colors">
                    <FileQuestion className="w-6 h-6 text-[#1642D0] mb-3" />
                    <h3 className="text-base font-bold text-slate-900 mb-1">Knowledge Base</h3>
                    <p className="text-xs text-slate-500 mb-3">Search tutorials, guides, and solutions.</p>
                    <button
                      type="button"
                      onClick={() => showToast('Opening Entrepreneur Knowledge Center...')}
                      className="text-sm font-bold text-[#1642D0] hover:underline cursor-pointer"
                    >
                      Visit Help Center ↗
                    </button>
                  </div>
                </div>

                {/* Frequently Asked Questions */}
                <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-5">
                  <h3 className="text-lg font-bold text-slate-900 my-0">Frequently Asked Questions</h3>

                  <div className="space-y-4 pt-1">
                    <div className="border-b border-slate-100 pb-4">
                      <h4 className="text-base font-bold text-slate-800 mb-1">How do I change my subscription or billing frequency?</h4>
                      <p className="text-sm text-slate-600 my-0 leading-relaxed">
                        Go to the Subscriptions tab above, click &quot;Change Plan&quot;, and select either the Monthly or Annual plan option.
                      </p>
                    </div>

                    <div className="border-b border-slate-100 pb-4">
                      <h4 className="text-base font-bold text-slate-800 mb-1">How do I manage my newsletter subscriptions?</h4>
                      <p className="text-sm text-slate-600 my-0 leading-relaxed">
                        Click &quot;Manage Newsletters&quot; on the Profile tab or at the top right of this page to choose your preferred newsletters.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Can I read my saved articles offline?</h4>
                      <p className="text-sm text-slate-600 my-0 leading-relaxed">
                        All bookmarked articles are synchronized across your devices in the Saved Articles tab for quick reference at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* CHANGE PLAN MODAL */}
      {showChangePlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Change Subscription Plan</h3>
            <p className="text-sm text-slate-500 mb-6">
              Select the plan that matches your business reading requirements.
            </p>

            <div className="space-y-3.5 mb-6">
              <div
                onClick={() => handleChangeSubscription('Entrepreneur Digital All-Access (Annual)')}
                className="p-4 border-2 border-[#1642D0] rounded-xl bg-blue-50/50 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-base text-slate-900">Annual Plan (Recommended)</strong>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Save 33%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">$79.99 billed once per year ($6.66/month)</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-[#1642D0]" />
              </div>

              <div
                onClick={() => handleChangeSubscription('Entrepreneur Digital All-Access (Monthly)')}
                className="p-4 border border-slate-300 rounded-xl hover:border-slate-400 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <strong className="text-base text-slate-900">Monthly Plan</strong>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">$9.99 billed monthly. Cancel anytime.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangePlanModal(false)}
                className="px-5 py-2.5 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">Newsletter Subscriptions</h3>
            <p className="text-sm text-slate-500 mb-6">
              Customize which curated email dispatches are delivered to {profile?.email || 'your email'}.
            </p>

            <div className="space-y-4 mb-6 text-sm">
              <label className="flex items-start gap-3.5 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-sm">Entrepreneur Daily</strong>
                  <span className="text-slate-500 text-xs">
                    Top stories, founder features, and daily strategy guide.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-sm">Franchise & Small Biz Opportunities</strong>
                  <span className="text-slate-500 text-xs">
                    Weekly breakdowns of top franchises, licensing deals, and small business tips.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#1642D0] rounded border-slate-300 mt-0.5"
                />
                <div>
                  <strong className="text-slate-900 block text-sm">AI & Future of Work</strong>
                  <span className="text-slate-500 text-xs">
                    How cutting-edge machine learning and automation impact high-growth companies.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewsletterModal(false);
                  showToast('Newsletter preferences saved!');
                }}
                className="px-6 py-2.5 text-sm font-bold rounded-md bg-[#fde047] hover:bg-[#facc15] text-slate-950 cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setShowNewsletterModal(false)}
                className="px-5 py-2.5 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
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
            <h3 className="text-xl font-serif font-bold text-rose-900 mb-2">Deactivate Account?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to deactivate your account? This action will disable access to all your saved articles and subscription benefits.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast('Deactivation request logged. An email confirmation has been sent.');
                }}
                className="px-5 py-2.5 text-sm font-bold rounded-md bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DARK FOOTER WITH TERMS OF USE & PRIVACY POLICY (Matching Reference Design) */}
      <footer className="w-full bg-[#0a0a0a] border-t border-neutral-800 text-slate-400 py-8 sm:py-9 mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-4">
          <p className="my-0 text-slate-400 font-normal">
            © 2026 Entrepreneur Media, LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8 font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/" className="hover:text-white transition-colors">Cookies</Link>
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
