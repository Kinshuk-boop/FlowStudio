'use client';

import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  getAuthErrorMessage,
} from '@/lib/firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;         // true while onAuthStateChanged resolves on mount
  actionLoading: boolean;   // true during sign-in/up/out async calls
  error: string | null;

  // Initialise the auth listener (called once from AuthProvider)
  _init: () => () => void;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  actionLoading: false,
  error: null,

  _init: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ actionLoading: true, error: null });
    try {
      const user = await signInWithEmail(email, password);
      set({ user, actionLoading: false });
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      set({ error: getAuthErrorMessage(code), actionLoading: false });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ actionLoading: true, error: null });
    try {
      const user = await signUpWithEmail(name, email, password);
      set({ user, actionLoading: false });
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      set({ error: getAuthErrorMessage(code), actionLoading: false });
      return false;
    }
  },

  loginWithGoogle: async () => {
    set({ actionLoading: true, error: null });
    try {
      const user = await signInWithGoogle();
      set({ user, actionLoading: false });
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      // Don't surface "popup closed" as an error
      if (code !== 'auth/popup-closed-by-user') {
        set({ error: getAuthErrorMessage(code), actionLoading: false });
      } else {
        set({ actionLoading: false });
      }
      return false;
    }
  },

  logout: async () => {
    set({ actionLoading: true });
    try {
      await signOut();
      set({ user: null, actionLoading: false });
    } catch {
      set({ actionLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
