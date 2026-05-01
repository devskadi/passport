interface Props {
  pageNumber: number;
  totalPages: number;
}

export default function MathWorkoutPage({ pageNumber, totalPages }: Props) {
  return (
    <div className="h-full w-full overflow-y-auto bg-cream">
      <div className="mx-auto max-w-md px-6 pt-8 pb-12 flex flex-col gap-6 min-h-full">
        {/* Header strip */}
        <div className="flex items-center gap-3">
          <div className="font-display text-[11px] tracking-[0.4em] font-semibold text-pink-dark">
            MATH WORKOUT
          </div>
          <div
            aria-hidden
            className="flex-1 border-t"
            style={{
              borderColor: 'rgba(255,61,127,0.35)',
              borderStyle: 'dashed'
            }}
          />
        </div>

        {/* Iframe card.
            DEV: Replace src with a different math drill app URL when ready. */}
        <div
          className="flex-1 rounded-2xl overflow-hidden bg-white"
          style={{
            border: '1px solid rgba(26,26,46,0.08)',
            boxShadow:
              '0 12px 28px -10px rgba(26,26,46,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
            minHeight: '480px'
          }}
        >
          <iframe
            src="https://d1-math-workout.netlify.app/"
            title="Math Workout"
            className="w-full h-full border-0 block"
            loading="lazy"
            allow="fullscreen"
          />
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
            tap a tab to navigate
          </span>
        </div>
      </div>
    </div>
  );
}
