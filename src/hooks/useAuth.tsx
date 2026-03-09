import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  setCachedSession,
  clearSessionCache,
  clearAllAuthStorage,
  getPreloadedSession,
  getPreloadedRoles,
} from '@/lib/sessionCache';
import { schedulePredictivePrefetch, clearPrefetchFlag } from '@/lib/predictivePrefetch';

// Re-export types so existing imports keep working
export type { AppRole } from './auth/types';
export type { AuthContextType } from './auth/types';

import type { AppRole, AuthContextType } from './auth/types';
import { DEFAULT_ROLES, fetchUserRoles, addRoleForUser } from './auth/roleManager';
import * as ops from './auth/authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const cachedSession = getPreloadedSession();
  const cachedRoles = getPreloadedRoles() as AppRole[] | null;

  const isCachedSupporterOnly = cachedRoles?.length === 1 && cachedRoles[0] === 'supporter';
  const initialRoles: AppRole[] =
    cachedRoles && cachedRoles.length > 0
      ? (isCachedSupporterOnly || cachedRoles.includes('agent')) ? cachedRoles : ['agent', ...cachedRoles] as AppRole[]
      : DEFAULT_ROLES;

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(initialRoles.includes('agent') ? 'agent' : initialRoles[0]);
  const [roles, setRoles] = useState<AppRole[]>(initialRoles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let rolesFetched = false;

    const initializeAuth = async () => {
      // Hard cap: loading MUST resolve within 8s no matter what
      const forceLoadingOff = setTimeout(() => {
        if (isMounted) {
          console.warn('[Auth] Init timeout after 8s — forcing loading off');
          setLoading(false);
        }
      }, 8000);

      try {
        const token = localStorage.getItem('welile_token');
        const userStr = localStorage.getItem('welile_user');
        
        if (token && userStr) {
          const userObj = JSON.parse(userStr);
          if (isMounted) {
            setUser(userObj);
            setSession({ access_token: token, user: userObj } as any);
          }
          
          if (!rolesFetched && isMounted) {
             rolesFetched = true;
             await fetchUserRoles(userObj.id, role, setRoles, setRole);
          }
          
          setCachedSession(userObj.id, userObj.email || '', 0);
          schedulePredictivePrefetch(userObj.id);
        } else {
          if (isMounted) {
            setUser(null);
            setSession(null);
            setRole(null);
            setRoles([]);
          }
          clearSessionCache();
          clearPrefetchFlag();
          rolesFetched = false;
        }
      } catch (err: any) {
        console.warn('[Auth] Init failed:', err?.message);
        clearAllAuthStorage();
        if (isMounted) {
          setUser(null);
          setSession(null);
          setRole(null);
          setRoles([]);
        }
      } finally {
        clearTimeout(forceLoadingOff);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const handleAuthChange = () => {
      rolesFetched = false; // force refetch if user changed in another tab or login flow
      initializeAuth();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('welile_auth_change', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('welile_auth_change', handleAuthChange);
    };
  }, []);

  const switchRole = (newRole: AppRole) => {
    if (roles.includes(newRole)) setRole(newRole);
  };

  const addRole = async (newRole: AppRole) => {
    if (!user) return { error: new Error('No user logged in') };
    return addRoleForUser(user.id, newRole, roles, role, setRoles, setRole);
  };

  const signOut = async () => {
    await ops.signOutUser(user?.id);
    setUser(null);
    setSession(null);
    setRole(null);
    setRoles([]);
    clearSessionCache();
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, role, roles, loading,
        signUp: ops.signUp,
        signUpWithoutRole: ops.signUpWithoutRole,
        signIn: ops.signIn,
        signInWithGoogle: ops.signInWithGoogle,
        signInWithApple: ops.signInWithApple,
        signOut,
        switchRole,
        addRole,
        resetPassword: ops.resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
