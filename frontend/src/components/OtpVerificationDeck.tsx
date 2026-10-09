import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { MessageSquareText, ShieldCheck, RotateCw, Smartphone } from 'lucide-react';

type Stage = 'sending' | 'input' | 'verifying' | 'success';

interface OtpVerificationDeckProps {
  /** Phone number (or contact) the code was sent to. */
  phone: string;
  /** Number of digits in the code. */
  length?: number;
  /** Returns true when the code is valid. May be async to hit an API. */
  onValidate: (code: string) => boolean | Promise<boolean>;
  /** Called once the success animation has played. */
  onVerified: () => void;
  /** Called when the user asks for a new code. */
  onResend?: () => void;
  /** Lets the user go back and edit the phone number. */
  onChangeNumber?: () => void;
  /** Brand colour for focus rings, buttons and the progress bar. */
  accent?: string;
  /** Seconds before "Resend code" becomes available. */
  resendSeconds?: number;
}

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\s+/g, '');
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 3)} ••• ${digits.slice(-3)}`;
};

export default function OtpVerificationDeck({
  phone,
  length = 4,
  onValidate,
  onVerified,
  onResend,
  onChangeNumber,
  accent = '#6c11d4',
  resendSeconds = 30,
}: OtpVerificationDeckProps) {
  const [stage, setStage] = useState<Stage>('sending');
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(resendSeconds);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const shake = useAnimationControls();

  // "Sending" intro: the SMS bubble flies to the phone, then the input deck slides in.
  useEffect(() => {
    if (stage !== 'sending') return;
    const t = setTimeout(() => setStage('input'), 1600);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'input' || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, countdown]);

  const submit = async (code: string) => {
    setStage('verifying');
    setError('');
    const ok = await onValidate(code);
    if (ok) {
      setStage('success');
      setTimeout(onVerified, 1400);
      return;
    }
    setStage('input');
    setError('That code is incorrect. Please try again.');
    setDigits(Array(length).fill(''));
    await shake.start({ x: [0, -12, 12, -8, 8, -4, 4, 0], transition: { duration: 0.5 } });
    inputs.current[0]?.focus();
  };

  const fill = (start: number, value: string) => {
    const chars = value.replace(/\D/g, '').slice(0, length - start).split('');
    if (!chars.length) return;
    const next = [...digits];
    chars.forEach((c, i) => (next[start + i] = c));
    setDigits(next);
    setError('');
    const nextEmpty = next.findIndex((d) => !d);
    if (nextEmpty === -1) {
      inputs.current[length - 1]?.blur();
      submit(next.join(''));
    } else {
      inputs.current[nextEmpty]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = '';
      } else if (i > 0) {
        next[i - 1] = '';
        inputs.current[i - 1]?.focus();
      }
      setDigits(next);
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleResend = () => {
    onResend?.();
    setDigits(Array(length).fill(''));
    setError('');
    setCountdown(resendSeconds);
    setStage('sending');
  };

  const filled = digits.filter(Boolean).length;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm"
      style={{ ['--otp-accent' as string]: accent }}
    >
      <AnimatePresence mode="wait">
        {stage === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col items-center py-4"
          >
            <div className="relative flex h-20 w-48 items-center justify-between">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ backgroundColor: accent }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <ShieldCheck size={20} />
              </motion.div>
              <motion.div
                className="absolute left-10 top-1/2 -translate-y-1/2"
                style={{ color: accent }}
                initial={{ x: 0, opacity: 0, scale: 0.6 }}
                animate={{ x: [0, 50, 100], y: [0, -18, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MessageSquareText size={22} />
              </motion.div>
              <motion.div
                className="flex h-14 w-9 items-center justify-center rounded-lg border-2 bg-white text-slate-500"
                style={{ borderColor: accent }}
                animate={{ rotate: [0, -6, 6, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <Smartphone size={18} />
              </motion.div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-700">Sending code…</p>
            <p className="text-xs text-slate-400">to {maskPhone(phone)}</p>
          </motion.div>
        )}

        {(stage === 'input' || stage === 'verifying') && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            // The deck mounts only after the "sending" exit finishes, so focus once it has slid in.
            onAnimationComplete={() => {
              if (stage === 'input' && !inputs.current.some((el) => el === document.activeElement)) {
                inputs.current[Math.max(0, digits.findIndex((d) => !d))]?.focus();
              }
            }}
          >
            <div className="mb-4 text-center">
              <p className="text-sm font-bold text-slate-800">Enter verification code</p>
              <p className="text-xs text-slate-500">
                Sent to <span className="font-semibold text-slate-700">{maskPhone(phone)}</span>
                {onChangeNumber && (
                  <>
                    {' · '}
                    <button
                      type="button"
                      onClick={onChangeNumber}
                      className="font-semibold underline-offset-2 hover:underline"
                      style={{ color: accent }}
                    >
                      Change
                    </button>
                  </>
                )}
              </p>
            </div>

            <motion.div animate={shake} className="flex justify-center gap-2.5">
              {digits.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <input
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${i + 1}`}
                    maxLength={length}
                    value={d}
                    disabled={stage === 'verifying'}
                    onChange={(e) => {
                      // Typing over an existing digit: keep only the new character.
                      const v = e.target.value;
                      fill(i, d && v.length === 2 ? v.replace(d, '') || d : v);
                    }}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      fill(i, e.clipboardData.getData('text'));
                    }}
                    onFocus={(e) => e.target.select()}
                    className={`h-14 w-12 rounded-xl border-2 bg-white text-center text-2xl font-bold text-transparent caret-[var(--otp-accent)] outline-none transition-all focus:border-[var(--otp-accent)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--otp-accent)_15%,transparent)] ${
                      error ? 'border-red-300' : d ? 'border-[var(--otp-accent)]' : 'border-slate-200'
                    }`}
                  />
                  {/* Animated digit sits over the transparent input text */}
                  <AnimatePresence>
                    {d && (
                      <motion.span
                        key={d + i}
                        initial={{ scale: 0.3, opacity: 0, y: 8 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                        className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900"
                      >
                        {d}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress bar fills as digits are entered */}
            <div className="mx-auto mt-4 h-1 w-40 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: error ? '#ef4444' : accent }}
                animate={{ width: stage === 'verifying' ? '100%' : `${(filled / length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            </div>

            <div className="mt-3 h-5 text-center text-xs">
              <AnimatePresence mode="wait">
                {stage === 'verifying' ? (
                  <motion.span
                    key="verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1.5 font-semibold"
                    style={{ color: accent }}
                  >
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                      <RotateCw size={12} />
                    </motion.span>
                    Verifying…
                  </motion.span>
                ) : error ? (
                  <motion.span key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-red-500">
                    {error}
                  </motion.span>
                ) : countdown > 0 ? (
                  <motion.span key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-400">
                    Resend code in <span className="font-semibold tabular-nums text-slate-600">0:{String(countdown).padStart(2, '0')}</span>
                  </motion.span>
                ) : (
                  <motion.button
                    key="resend"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleResend}
                    className="inline-flex items-center gap-1 font-semibold"
                    style={{ color: accent }}
                  >
                    <RotateCw size={12} /> Resend code
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
              <motion.div
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-sm font-bold text-emerald-700"
            >
              Phone number verified
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
