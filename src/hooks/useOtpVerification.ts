import { useState, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/apiClient';
import { cleanPhoneNumber } from '@/lib/phoneUtils';

export function useOtpVerification() {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);

  const sendOtp = useCallback(async (phone: string) => {
    setOtpLoading(true);
    setOtpError(null);
    try {
      const response = await fetchWithAuth('/auth/sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'send', phone: cleanPhoneNumber(phone) }),
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        setOtpError(data.message || data.error || 'Failed to send OTP');
        return false;
      }
      
      if (data?.error) {
        setOtpError(data.error);
        return false;
      }
      setOtpSent(true);
      setVerifiedPhone(cleanPhoneNumber(phone));
      return true;
    } catch (e: any) {
      setOtpError(e?.message || 'Failed to send OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    setOtpLoading(true);
    setOtpError(null);
    try {
      const response = await fetchWithAuth('/auth/sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'verify', phone: cleanPhoneNumber(phone), otp }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setOtpError(data.message || data.error || 'Verification failed');
        return false;
      }

      if (data?.error) {
        setOtpError(data.error);
        return false;
      }
      setOtpVerified(true);
      return true;
    } catch (e: any) {
      setOtpError(e?.message || 'Verification failed');
      return false;
    } finally {
      setOtpLoading(false);
    }
  }, []);

  const resetOtp = useCallback(() => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpError(null);
    setVerifiedPhone(null);
  }, []);

  return {
    otpSent,
    otpVerified,
    otpLoading,
    otpError,
    verifiedPhone,
    sendOtp,
    verifyOtp,
    resetOtp,
  };
}
