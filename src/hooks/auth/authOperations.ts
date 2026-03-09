import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { getPublicOrigin } from '@/lib/getPublicOrigin';
import type { AppRole } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function signUp(email: string, password: string, fullName: string, phone: string, role: AppRole) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, phone, role }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: new Error(data.error || 'Failed to sign up') };
    }
    return { error: null };
  } catch (error: any) {
    return { error: new Error(error.message || 'Network error during signup') };
  }
}

export async function signUpWithoutRole(email: string, password: string, fullName: string, phone: string, referrerId?: string) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, phone, referrer_id: referrerId }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: new Error(data.error || 'Failed to sign up') };
    }
    return { error: null };
  } catch (error: any) {
    return { error: new Error(error.message || 'Network error during signup') };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Simulate Supabase "Invalid login credentials" message for UI compat
      const errMsg = data.error === 'Invalid email or password' ? 'Invalid login credentials' : data.error;
      return { error: new Error(errMsg || 'Failed to sign in') };
    }
    
    // Store our new custom JWT
    if (data.token) {
      localStorage.setItem('welile_token', data.token);
      localStorage.setItem('welile_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('welile_auth_change'));
    }
    return { error: null };
  } catch (error: any) {
    return { error: new Error('Invalid login credentials') };
  }
}

async function attemptOAuth(provider: 'google' | 'apple', redirectUri: string) {
  console.log(`[OAuth] Attempting ${provider} with redirect_uri:`, redirectUri);
  const result = await lovable.auth.signInWithOAuth(provider, {
    redirect_uri: redirectUri,
  });
  console.log(`[OAuth] ${provider} result:`, { redirected: result.redirected, error: result.error?.message });
  return result;
}

function isPreviewHost(hostname: string) {
  return hostname.includes('id-preview--') || hostname.includes('preview--') || hostname.endsWith('.lovableproject.com');
}

async function preparePreviewOAuthFlow() {
  if (!isPreviewHost(window.location.hostname)) return;

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (error) {
    console.warn('[OAuth] Failed to clear preview service workers/caches:', error);
  }
}

export async function signInWithGoogle() {
  await preparePreviewOAuthFlow();

  // Use current origin so OAuth callback returns to wherever the user is
  // (preview domain OR custom domain — both must work)
  const primaryUri = window.location.origin;

  console.log('[OAuth:Google] domain:', window.location.hostname, '| redirect_uri:', primaryUri);

  const result = await attemptOAuth('google', primaryUri);
  if (result.redirected) return { error: null };

  // If provider not supported error, retry with canonical public origin as fallback
  const errMsg = result.error?.message || '';
  if (errMsg.toLowerCase().includes('not supported') || errMsg.toLowerCase().includes('provider')) {
    console.warn('[OAuth:Google] Primary redirect failed, retrying with public origin...');
    const fallbackUri = getPublicOrigin();
    if (fallbackUri !== primaryUri) {
      const retry = await attemptOAuth('google', fallbackUri);
      if (retry.redirected) return { error: null };
      return { error: retry.error ?? null };
    }
  }

  return { error: result.error ?? null };
}

export async function signInWithApple() {
  await preparePreviewOAuthFlow();

  const primaryUri = window.location.origin;

  console.log('[OAuth:Apple] domain:', window.location.hostname, '| redirect_uri:', primaryUri);

  const result = await attemptOAuth('apple', primaryUri);
  if (result.redirected) return { error: null };

  const errMsg = result.error?.message || '';
  if (errMsg.toLowerCase().includes('not supported') || errMsg.toLowerCase().includes('provider')) {
    console.warn('[OAuth:Apple] Primary redirect failed, retrying with public origin...');
    const fallbackUri = getPublicOrigin();
    if (fallbackUri !== primaryUri) {
      const retry = await attemptOAuth('apple', fallbackUri);
      if (retry.redirected) return { error: null };
      return { error: retry.error ?? null };
    }
  }

  return { error: result.error ?? null };
}

export async function signOutUser(userId: string | undefined) {
  // Activity log insert stubbed for performance
  localStorage.removeItem('welile_token');
  localStorage.removeItem('welile_user');
  window.dispatchEvent(new Event('welile_auth_change'));

  // Best-effort cleanup for any lingering supabase state
  try {
    await supabase.auth.signOut();
  } catch(e) {}
}

export async function resetPassword(email: string) {
  // Always redirect to the custom domain to avoid Lovable auth-bridge invalidating the token
  const isCustomDomain = !window.location.hostname.includes('lovable.app') && !window.location.hostname.includes('lovableproject.com');
  const origin = isCustomDomain ? window.location.origin : 'https://welilereceipts.com';
  const redirectUrl = `${origin}/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
  return { error: error as Error | null };
}
