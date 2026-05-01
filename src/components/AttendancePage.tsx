import { UserCheck } from 'lucide-react';

interface Props {
  pageNumber: number;
  totalPages: number;
}

export default function AttendancePage({ pageNumber, totalPages }: Props) {
  return (
    <div className="h-full w-full overflow-y-auto bg-cream">
      <div className="mx-auto max-w-md px-6 pt-8 pb-12 flex flex-col gap-6 min-h-full">
        {/* Header strip */}
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

        {/* Centered placeholder content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div
            className="flex items-center justify-center rounded-3xl"
            style={{
              background: 'var(--turquoise)',
              color: '#FFFFFF',
              width: '120px',
              height: '120px',
              boxShadow: '0 12px 28px -8px rgba(13,181,166,0.5)'
            }}
          >
            <UserCheck size={56} strokeWidth={1.6} />
          </div>
          <h2 className="font-display font-bold text-2xl text-ink">
            Coming soon
          </h2>
          <p className="text-sm text-ink-soft max-w-xs">
            Day-one attendance check-in lives here. The Lark Base form (already
            wired in v1) gets ported in a follow-up.
          </p>
          <button
            type="button"
            disabled
            className="px-6 py-3 rounded-full font-display font-semibold text-base"
            style={{
              background: 'rgba(13,181,166,0.12)',
              color: 'var(--ink-mute)',
              border: '1.5px dashed rgba(13,181,166,0.4)',
              cursor: 'not-allowed'
            }}
          >
            Check in (placeholder)
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs">
          <span style={{ color: 'var(--ink-mute)' }}>
            Page {pageNumber} of {totalPages}
          </span>
          <span
            className="font-hand text-base"
            style={{ color: 'var(--ink-mute)' }}
          >
            swipe to continue →
          </span>
        </div>
      </div>
    </div>
  );
}
