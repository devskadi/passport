import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserCheck
} from 'lucide-react';
import { BRANCH_OPTIONS } from '../data/branches';
import { submitAttendance } from '../lib/api';
import type { AttendanceResponse } from '../lib/api';

interface Props {
  pageNumber: number;
  totalPages: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function AttendancePage({ pageNumber, totalPages }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<AttendanceResponse | null>(null);

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.';
    if (!branch) return 'Please select your branch.';
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
      setStatus('error');
    }
  };

  const handleNew = () => {
    setFullName('');
    setEmail('');
    setBranch('');
    setError('');
    setResult(null);
    setStatus('idle');
  };

  const submitting = status === 'submitting';

  return (
    <div className="h-full w-full overflow-y-auto bg-cream">
      <div className="mx-auto max-w-md px-6 pt-8 pb-12 flex flex-col gap-6 min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="font-display text-[11px] tracking-[0.4em] font-semibold text-turquoise-dark">
            ATTENDANCE
          </div>
          <div
            aria-hidden
            className="flex-1 border-t"
            style={{
              borderColor: 'rgba(13,181,166,0.35)',
              borderStyle: 'dashed'
            }}
          />
        </div>

        {status === 'success' ? (
          <SuccessState
            result={result}
            fullName={fullName}
            branch={branch}
            onNew={handleNew}
          />
        ) : (
          <CheckInForm
            fullName={fullName}
            email={email}
            branch={branch}
            error={status === 'error' ? error : ''}
            submitting={submitting}
            onChangeName={setFullName}
            onChangeEmail={setEmail}
            onChangeBranch={setBranch}
            onSubmit={handleSubmit}
          />
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs">
          <span style={{ color: 'var(--ink-mute)' }}>
            Page {pageNumber} of {totalPages}
          </span>
          <span
            className="font-hand text-base"
            style={{ color: 'var(--ink-mute)' }}
          >
            {status === 'success' ? '~ welcome aboard ~' : 'check yourself in'}
          </span>
        </div>
      </div>
    </div>
  );
}

interface FormProps {
  fullName: string;
  email: string;
  branch: string;
  error: string;
  submitting: boolean;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeBranch: (v: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function CheckInForm({
  fullName,
  email,
  branch,
  error,
  submitting,
  onChangeName,
  onChangeEmail,
  onChangeBranch,
  onSubmit
}: FormProps) {
  return (
    <>
      <div className="flex justify-center pt-2">
        <div
          className="flex items-center justify-center rounded-3xl"
          style={{
            background: 'var(--turquoise)',
            color: '#FFFFFF',
            width: '88px',
            height: '88px',
            boxShadow: '0 12px 28px -8px rgba(13,181,166,0.5)'
          }}
        >
          <UserCheck size={40} strokeWidth={1.6} />
        </div>
      </div>

      <h1 className="font-display font-black text-3xl sm:text-4xl text-center text-ink leading-tight">
        Check yourself in
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        <Field
          label="FULL NAME"
          type="text"
          value={fullName}
          onChange={onChangeName}
          placeholder="Juan dela Cruz"
          autoComplete="name"
          disabled={submitting}
        />
        <Field
          label="EMAIL ADDRESS"
          type="email"
          value={email}
          onChange={onChangeEmail}
          placeholder="juan@company.com"
          autoComplete="email"
          disabled={submitting}
        />
        <BranchSelect
          value={branch}
          onChange={onChangeBranch}
          disabled={submitting}
        />

        {error && (
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm"
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
          className="px-6 py-3 rounded-full font-display font-semibold text-base flex items-center justify-center gap-2 transition-opacity"
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
    </>
  );
}

interface FieldProps {
  label: string;
  type: 'text' | 'email';
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[11px] tracking-[0.2em] font-semibold text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl text-base outline-none transition-colors"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(26,26,46,0.12)',
          color: 'var(--ink)',
          fontFamily: 'inherit'
        }}
      />
    </label>
  );
}

interface BranchSelectProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function BranchSelect({ value, onChange, disabled }: BranchSelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[11px] tracking-[0.2em] font-semibold text-ink-soft">
        BRANCH
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-3 rounded-xl text-base outline-none appearance-none"
        style={{
          background:
            "#FFFFFF url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' stroke='%234A4A5E' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\") right 14px center no-repeat",
          border: '1.5px solid rgba(26,26,46,0.12)',
          color: value ? 'var(--ink)' : 'var(--ink-mute)',
          fontFamily: 'inherit'
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
  );
}

interface SuccessProps {
  result: AttendanceResponse | null;
  fullName: string;
  branch: string;
  onNew: () => void;
}

function SuccessState({ result, fullName, branch, onNew }: SuccessProps) {
  const stamped = result?.clockInIso
    ? new Date(result.clockInIso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : '';
  const firstName = fullName.split(' ')[0] || 'friend';

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center text-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div
        className="flex items-center justify-center rounded-3xl mb-2"
        style={{
          background: 'var(--turquoise)',
          color: '#FFFFFF',
          width: '88px',
          height: '88px',
          boxShadow: '0 12px 28px -8px rgba(13,181,166,0.5)'
        }}
      >
        <CheckCircle2 size={44} strokeWidth={1.6} />
      </div>
      <h2 className="font-display font-black text-3xl text-ink">
        Welcome aboard, {firstName}
      </h2>
      <p className="text-sm text-ink-soft">{branch}</p>
      {stamped && (
        <p className="font-mono text-xs text-ink-mute">{stamped}</p>
      )}
      <button
        type="button"
        onClick={onNew}
        className="mt-4 px-5 py-2.5 rounded-full font-display font-semibold text-sm"
        style={{
          background: 'transparent',
          color: 'var(--turquoise-dark)',
          border: '1.5px solid rgba(13,181,166,0.4)'
        }}
      >
        Check in someone else
      </button>
    </motion.div>
  );
}
