'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
}

export type AuthMode = 'login' | 'signup';

interface AuthContextType {
  user: UserProfile | null;
  isOpen: boolean;
  mode: AuthMode;
  openLogin: () => void;
  openSignup: () => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
  loginUser: (user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const openLogin = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode('signup');
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
  };

  const loginUser = (profile: UserProfile) => {
    setUser(profile);
    setIsOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOpen,
        mode,
        openLogin,
        openSignup,
        closeAuth,
        setMode,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
