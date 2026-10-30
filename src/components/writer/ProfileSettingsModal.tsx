'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updatedData: any) => void;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: ProfileSettingsModalProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('Writer User');
  const [writerName, setWriterName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [avatar, setAvatar] = useState('/images/user-avatar-butterfly.png');

  // Loading & notification states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form values from user or database on open
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const initialEmail = user?.email || 'mishalzuhrie@gmail.com';
    const initialName = user?.name || 'mishal';
    const initialAvatar = user?.avatar || '/images/user-avatar-butterfly.png';
    const initialBio = user?.bio || 'Writer User';
    const initialWriterName = user?.writerName || initialName;
    const initialLinkedin = user?.linkedinUrl || 'https://www.linkedin.com/in/your-profile';

    setFullName(initialName);
    setEmail(initialEmail);
    setAvatar(initialAvatar);
    setBio(initialBio);
    setWriterName(initialWriterName);
    setLinkedinUrl(initialLinkedin);

    // Fetch latest profile from database to ensure fresh state
    fetch(`/api/user/profile?email=${encodeURIComponent(initialEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.profile) {
          const p = data.profile;
          if (p.fullName || p.name) setFullName(p.fullName || p.name);
          if (p.email) setEmail(p.email);
          if (p.avatar) setAvatar(p.avatar);
          if (p.bio !== undefined) setBio(p.bio || 'Writer User');
          if (p.writerName) setWriterName(p.writerName);
          if (p.linkedinUrl) setLinkedinUrl(p.linkedinUrl);
        }
      })
      .catch(() => {});
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data?.success && data?.url) {
        const newAvatarUrl = data.url;
        setAvatar(newAvatarUrl);

        // Update local session immediately
        updateUser({ avatar: newAvatarUrl });

        // Save avatar to database immediately
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentEmail: email || user?.email || 'mishalzuhrie@gmail.com',
            avatar: newAvatarUrl,
          }),
        });

        if (onProfileUpdated) {
          onProfileUpdated({ avatar: newAvatarUrl });
        }
        setSuccessMessage('Photo updated successfully.');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data?.error || 'Failed to upload photo.');
      }
    } catch {
      setErrorMessage('Network error while uploading photo.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Save Changes
  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const currentEmail = user?.email || email;

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail,
          fullName: fullName.trim(),
          newEmail: email.trim(),
          bio: bio.trim(),
          writerName: writerName.trim() || fullName.trim(),
          linkedinUrl: linkedinUrl.trim(),
          avatar,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        // Update user session in AuthContext & localStorage
        const updatedData = {
          name: fullName.trim(),
          email: email.trim(),
          avatar,
          bio: bio.trim(),
          writerName: writerName.trim() || fullName.trim(),
          linkedinUrl: linkedinUrl.trim(),
        };

        updateUser(updatedData);

        if (onProfileUpdated) {
          onProfileUpdated(updatedData);
        }

        setSuccessMessage('Profile settings saved successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMessage(data?.error || 'Failed to save changes.');
      }
    } catch {
      setErrorMessage('Network error while saving profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        
        {/* Top Decorative Gradient Accent Bar matching Reference Image 2 */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#D01E1E] via-[#EA580C] to-[#F59E0B]" />

        {/* Modal Header */}
        <div className="px-6 sm:px-7 pt-5 pb-3 flex items-start justify-between border-b border-slate-100">
          <div>
            <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight my-0">
              Profile Settings
            </h2>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-0.5 my-0 font-mono">
              MANAGE YOUR ACCOUNT
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-6 sm:mx-7 mt-3 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mx-6 sm:mx-7 mt-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveChanges}>
          {/* Avatar & User Summary Row matching Reference Image 2 */}
          <div className="px-6 sm:px-7 py-5 flex items-center gap-4">
            
            {/* Square-rounded Avatar */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs group">
              <img
                src={avatar || '/images/user-avatar-butterfly.png'}
                alt={fullName || 'Profile'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/user-avatar-butterfly.png';
                }}
                className="w-full h-full object-cover"
              />
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Change Photo Trigger + User Email + Role Badge */}
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="text-xs sm:text-sm font-bold text-[#0066cc] hover:text-[#004d99] hover:underline cursor-pointer transition-colors block text-left"
              >
                {isUploadingPhoto ? 'Uploading photo...' : 'Change photo'}
              </button>
              
              <div className="text-xs text-slate-500 font-mono mt-1 truncate">
                {email || user?.email || 'mishalzuhrie@gmail.com'}
              </div>

              <div className="mt-1.5">
                <span className="inline-block px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold tracking-wider uppercase rounded border border-blue-200/60">
                  {user?.role ? user.role.toUpperCase() : 'WRITER'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields matching Reference Image 2 */}
          <div className="px-6 sm:px-7 space-y-4">
            
            {/* FULL NAME */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-sans">
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="mishal"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003B64] focus:border-[#003B64] transition-colors"
              />
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-sans">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mishalzuhrie@gmail.com"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003B64] focus:border-[#003B64] transition-colors"
              />
            </div>

            {/* BIO / AUTHOR NAME */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-sans">
                BIO
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Writer User"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003B64] focus:border-[#003B64] transition-colors resize-none"
              />
            </div>

            {/* LINKEDIN PROFILE */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 font-sans">
                LINKEDIN PROFILE
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 w-4.5 h-4.5 bg-[#0A66C2] text-white rounded flex items-center justify-center font-bold text-[10px] select-none font-sans shrink-0 pointer-events-none">
                  in
                </div>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003B64] focus:border-[#003B64] transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1.5 my-0">
                Shown on your article bylines so readers can connect with you.
              </p>
            </div>
          </div>

          {/* Modal Actions Footer matching Reference Image 2 */}
          <div className="px-6 sm:px-7 py-5 flex items-center justify-between gap-3 border-t border-slate-100 mt-6 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-[#003B64] hover:bg-[#002a48] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
