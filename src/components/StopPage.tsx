import { useEffect, useRef } from 'react';
import { animate, motion } from 'framer-motion';
import {
  Camera,
  ClipboardList,
  DoorOpen,
  FileText,
  Gamepad2,
  Mic,
  Plane,
  QrCode,
  Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ACCENT } from '../data/stops';
import type { Stop, StopIcon } from '../data/stops';
import { isDevMode } from '../lib/devMode';
import Stamp from './Stamp';

const ICON_MAP: Record<StopIcon, LucideIcon> = {
  gate: DoorOpen,
  camera: Camera,
  mic: Mic,
  doc: FileText,
  game: Gamepad2,
  check: ClipboardList,
  plane: Plane
};

export interface StampRecord {
  stampedAt: string;
  rotation: number;
}

interface Props {
  stop: Stop;
  pageNumber: number;
  totalPages: number;
  stamp?: StampRecord;
  onScan?: () => void;
  onForceStamp?: () => void;
}

export default function StopPage({
  stop,
  pageNumber,
  totalPages,
  stamp,
  onScan,
  onForceStamp
}: Props) {
  const accent = ACCENT[stop.accent];
  const Icon = ICON_MAP[stop.icon];
  const isStamped = !!stamp;
  const dev = isDevMode();

  // Page wobble when this stop transitions from unstamped → stamped.
  const containerRef = useRef<HTMLDivElement>(null);
  const wasStampedRef = useRef(isStamped);
  useEffect(() => {
    if (isStamped && !wasStampedRef.current && containerRef.current) {
      animate(
        containerRef.current,
        { x: [0, -4, 4, -3, 3, -1, 1, 0] },
        { duration: 0.22, ease: 'easeInOut' }
      );
    }
    wasStampedRef.current = isStamped;
  }, [isStamped]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto bg-cream"
    >
      <div className="mx-auto max-w-md px-6 pt-8 pb-12 flex flex-col gap-6 min-h-full">
        {/* 1. Page header strip */}
        <div className="flex items-center gap-3">
          <div
            className="font-display text-[11px] tracking-[0.4em] font-semibold"
            style={{ color: accent.dark }}
          >
            STOP {stop.id}
          </div>
          <div
            aria-hidden
            className="flex-1 border-t"
            style={{ borderColor: `${accent.bg}55`, borderStyle: 'dashed' }}
          />
        </div>

        {/* 2. Big illustrated icon block */}
        <div className="flex justify-center pt-2">
          <div
            className="flex items-center justify-center rounded-3xl"
            style={{
              background: accent.bg,
              color: '#FFFFFF',
              width: '120px',
              height: '120px',
              boxShadow: `0 12px 28px -8px ${accent.bg}80`
            }}
          >
            <Icon size={56} strokeWidth={1.6} />
          </div>
        </div>

        {/* 3. Stop name + 4. Sub-label */}
        <div className="text-center">
          <h1
            className="font-display font-black text-3xl sm:text-4xl leading-tight mb-1"
            style={{ color: 'var(--ink)' }}
          >
            {stop.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            {stop.sub}
          </p>
        </div>

        {/* 5. What to expect copy */}
        <div className="text-center">
          <div
            className="font-display text-[10px] tracking-[0.3em] font-semibold mb-2"
            style={{ color: 'var(--ink-mute)' }}
          >
            WHAT TO EXPECT
          </div>
          <p
            className="text-sm leading-relaxed mx-auto max-w-xs"
            style={{ color: 'var(--ink-soft)' }}
          >
            {stop.copy}
          </p>
        </div>

        {/* 6. Stamp slot */}
        <div className="flex justify-center py-4 min-h-[164px] items-center">
          {isStamped && stamp ? (
            <Stamp
              stampId={stop.id}
              accent={stop.accent}
              rotation={stamp.rotation}
              Icon={Icon}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '140px',
                height: '140px',
                border: '2px dashed rgba(26,26,46,0.18)'
              }}
            >
              <span
                className="font-display text-[10px] tracking-[0.3em] font-semibold"
                style={{ color: 'var(--ink-mute)' }}
              >
                TAP TO SCAN
              </span>
            </div>
          )}
        </div>

        {/* 7. Scan button (+ dev "force stamp" pill) */}
        <div className="flex flex-col items-stretch gap-2">
          <button
            type="button"
            onClick={onScan}
            disabled={isStamped}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-display font-semibold text-base transition-opacity"
            style={{
              background: isStamped ? 'rgba(26,26,46,0.08)' : accent.bg,
              color: isStamped ? 'var(--ink-mute)' : '#FFFFFF',
              boxShadow: isStamped ? 'none' : `0 8px 20px -6px ${accent.bg}80`,
              cursor: isStamped ? 'not-allowed' : 'pointer'
            }}
          >
            {isStamped ? (
              <>
                Stamped <span aria-hidden>✓</span>
              </>
            ) : (
              <>
                <QrCode size={18} strokeWidth={2} />
                Scan QR to stamp
              </>
            )}
          </button>

          {dev && !isStamped && (
            <motion.button
              type="button"
              onClick={onForceStamp}
              whileTap={{ scale: 0.96 }}
              className="self-center flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-display tracking-[0.2em] font-semibold uppercase"
              style={{
                background: 'transparent',
                color: 'var(--ink-mute)',
                border: '1px dashed rgba(26,26,46,0.25)'
              }}
            >
              <Sparkles size={11} strokeWidth={2.4} />
              Force stamp · dev
            </motion.button>
          )}
        </div>

        {/* 8. Page footer */}
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
