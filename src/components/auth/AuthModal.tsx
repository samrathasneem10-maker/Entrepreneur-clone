'use client';

import React, { useState, useEffect } from 'react';
import { ModalOverlay } from './ModalOverlay';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuth } from './AuthContext';
import { AuthModalSkeleton } from '@/components/skeletons/AuthModalSkeleton';

export const AuthModal: React.FC = () => {
  const { isOpen, closeAuth, mode } = useAuth();
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsSkeletonLoading(true);
      const timer = setTimeout(() => {
        setIsSkeletonLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={closeAuth}>
      {isSkeletonLoading ? (
        <AuthModalSkeleton />
      ) : (
        <div className="fade-in-content">
          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      )}
    </ModalOverlay>
  );
};

