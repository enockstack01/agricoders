/*
 * Development preview only. Metro swaps '@clerk/clerk-expo' for this file when EXPO_PUBLIC_PREVIEW=1
 * (see metro.config.js), so the real screens can be rendered in a browser without signing in.
 * It is never part of a production or release build.
 *
 * Pick the signed in role with ?role=user, ?role=admin or ?role=super_admin in the preview URL.
 */
import React from 'react';
import { api } from '../src/lib/api';
import { installMockApi } from './mockApi';

// the mock API is installed here because this module is always loaded before the first request
installMockApi(api);

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const role = params.get('role') || 'super_admin';

const user = {
  id: 'user_preview_1',
  firstName: 'Enock',
  lastName: 'Nshimiyimana',
  fullName: 'Enock Nshimiyimana',
  hasImage: false,
  imageUrl: '',
  primaryEmailAddress: { emailAddress: 'enock@example.com' },
  createdAt: new Date('2026-03-12'),
  publicMetadata: { role },
};

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SignedIn = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SignedOut = () => null;

export const useAuth = () => ({ isLoaded: true, isSignedIn: true, userId: user.id, getToken: async () => 'preview-token', signOut: async () => {} });
export const useUser = () => ({ isLoaded: true, isSignedIn: true, user });
export const useClerk = () => ({ signOut: async () => {}, user });
export const useSignIn = () => ({ isLoaded: true, signIn: undefined, setActive: async () => {} });
export const useSignUp = () => ({ isLoaded: true, signUp: undefined, setActive: async () => {} });
