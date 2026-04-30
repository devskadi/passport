import { useState } from 'react';
import { UserCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BRANCH_OPTIONS } from '../config.js';
import { submitAttendance } from '../lib/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AttendanceForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const validate = () => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.';
    if (!branch) return 'Please select your branch.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setStatus('error');
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      const data = await submitAttendance({
        fullName: fullName.trim(),
        email: email.trim(),
        branch
      });
      setResult(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setBranch('');
    setError('');
    setResult(null);
    setStatus('idle');
  };

  if (status === 'success') {
    const stamped = result?.clockInIso
      ? new Date(result.clockInIso).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : '';
    return (
      <div className="anim-page-rise relative max-w-2xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-36 min-h-full flex flex-col items-center justify-center">
        <div
          className="font-display text-[10px] sm:text-[11px] tracking-[0.4em] mb-2"
          style={{ color: 'var(--turquoise-dark)' }}
        >
          · CHECKED IN ·
        </div>
        <h1
          className="font-display font-black text-4xl sm:text-5xl mb-6 text-center"
          style={{ color: 'var(--ink)' }}
        >
          You're stamped in
        </h1>

        <div
          className="stamp-card stamp-drop rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center w-full"
          style={{ maxWidth: '420px' }}
        >
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'var(--turquoise)',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px -4px rgba(13,181,166,0.5)'
            }}
          >
            <CheckCircle2 size={36} strokeWidth={1.6} />
          </div>
          <h3
            className="font-display font-bold text-xl sm:text-2xl mb-1"
            style={{ color: 'var(--ink)' }}
          >
            Welcome aboard, {fullName.split(' ')[0]}
          </h3>
          <p className="text-sm mb-1" style={{ color: 'var(--ink-soft)' }}>
            {branch}
          </p>
          <p className="font-mono text-xs mb-6" style={{ color: 'var(--ink-mute)' }}>
            {stamped}
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-display font-semibold text-base"
            style={{
              background: 'transparent',
              color: 'var(--turquoise-dark)',
              border: '1.5px solid rgba(13,181,166,0.4)'
            }}
          >
            Check in someone else
          </button>
        </div>

        <div
          className="mt-6 sm:mt-8 font-hand text-base sm:text-lg"
          style={{ color: 'var(--ink-mute)' }}
        >
          ~ have a great first day ~
        </div>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <div className="anim-page-rise relative max-w-2xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-36 min-h-screen flex flex-col items-center justify-center">
      <div
        className="font-display text-[10px] sm:text-[11px] tracking-[0.4em] mb-2"
        style={{ color: 'var(--turquoise-dark)' }}
      >
        · ATTENDANCE ·
      </div>
      <h1
        className="font-display font-black text-4xl sm:text-5xl mb-6 text-center"
        style={{ color: 'var(--ink)' }}
      >
        Check yourself in
      </h1>

      <form
        onSubmit={handleSubmit}
        className="stamp-card rounded-2xl p-6 sm:p-8 flex flex-col w-full"
        style={{ maxWidth: '440px' }}
        noValidate
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--turquoise)',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px -4px rgba(13,181,166,0.5)'
            }}
          >
            <UserCheck size={28} strokeWidth={1.6} />
          </div>
        </div>

        <label className="flex flex-col gap-1.5 mb-3">
          <span
            className="font-display text-[11px] tracking-[0.2em] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            FULL NAME
          </span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={submitting}
            autoComplete="name"
            placeholder="Juan dela Cruz"
            className="px-4 py-3 rounded-lg text-base outline-none transition-colors"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(26,26,46,0.12)',
              color: 'var(--ink)',
              fontFamily: 'inherit'
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5 mb-3">
          <span
            className="font-display text-[11px] tracking-[0.2em] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            EMAIL ADDRESS
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoComplete="email"
            placeholder="juan@company.com"
            className="px-4 py-3 rounded-lg text-base outline-none transition-colors"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(26,26,46,0.12)',
              color: 'var(--ink)',
              fontFamily: 'inherit'
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5 mb-5">
          <span
            className="font-display text-[11px] tracking-[0.2em] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            BRANCH
          </span>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={submitting}
            className="px-4 py-3 rounded-lg text-base outline-none transition-colors appearance-none"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(26,26,46,0.12)',
              color: branch ? 'var(--ink)' : 'var(--ink-mute)',
              fontFamily: 'inherit',
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%234A4A5E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center'
            }}
          >
            <option value="" disabled>
              Select a branch…
            </option>
            {BRANCH_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        {status === 'error' && error && (
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
            style={{
              background: 'rgba(255,61,127,0.08)',
              color: 'var(--pink-dark)',
              border: '1px solid rgba(255,61,127,0.25)'
            }}
          >
            <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-lg font-display font-semibold text-base flex items-center justify-center gap-2 transition-opacity"
          style={{
            background: 'var(--turquoise)',
            color: '#FFFFFF',
            boxShadow: '0 8px 20px -6px rgba(13,181,166,0.6)',
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'wait' : 'pointer'
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} strokeWidth={2.4} className="animate-spin" />
              Checking in…
            </>
          ) : (
            'Check in'
          )}
        </button>
      </form>

      <div
        className="mt-5 sm:mt-6 font-hand text-base sm:text-lg"
        style={{ color: 'var(--ink-mute)' }}
      >
        ~ welcome to the team ~
      </div>
    </div>
  );
}
