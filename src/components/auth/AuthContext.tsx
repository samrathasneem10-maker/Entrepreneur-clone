'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  role: 'reader' | 'writer' | 'admin' | string;
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  // Hydrate user session from localStorage and verify with /api/auth/me on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('entrepreneur_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    // Verify session with server
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setUser(data.user);
          try {
            localStorage.setItem('entrepreneur_user', JSON.stringify(data.user));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});
  }, []);

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
    try {
      localStorage.setItem('entrepreneur_user', JSON.stringify(profile));
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem('entrepreneur_user');
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
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
