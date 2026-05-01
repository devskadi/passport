import { lazy, Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ACCENT, STOPS, TOTAL_PAGES } from '../data/stops';
import type { Stop } from '../data/stops';
import { useSwipeNav } from '../hooks/useSwipeNav';
import type { StampRecord } from '../hooks/usePassportState';
import { useStampSound } from '../hooks/useStampSound';
import { buildStopPayload, parsePayload } from '../lib/qrPayload';
import AttendancePage from './AttendancePage';
import InteriorToolbar from './InteriorToolbar';
import MathWorkoutPage from './MathWorkoutPage';
import SideTabs from './SideTabs';
import StopPage from './StopPage';

// Lazy-load the scanner — html5-qrcode is ~150KB gz that we don't want
// in the initial bundle since most users tap "Scan QR" only once per stop.
const QRScannerModal = lazy(() => import('./QRScannerModal'));

interface Props {
  stamps: Record<string, StampRecord>;
  onStamp: (stopId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
}

export default function PassportInterior({
  stamps,
  onStamp,
  soundEnabled,
  onToggleSound,
  onReset
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scannerStop, setScannerStop] = useState<Stop | null>(null);

  const stampedIds = useMemo(() => new Set(Object.keys(stamps)), [stamps]);
  const playStampSound = useStampSound(soundEnabled);

  // Wraps onStamp so every successful stamp also plays the sound.
  const stampWithSound = (stopId: string) => {
    if (stamps[stopId]) return; // already stamped — no sound
    onStamp(stopId);
    playStampSound();
  };

  const resolveScannedStopName = (payload: string): string | null => {
    const parsed = parsePayload(payload);
    if (parsed.kind !== 'stop') return null;
    return STOPS.find((s) => s.id === parsed.id)?.name ?? null;
  };

  const { containerRef, width, x, dragConstraints, onDragEnd } = useSwipeNav({
    activeIndex,
    pageCount: TOTAL_PAGES,
    onChange: setActiveIndex
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-cream touch-pan-y"
    >
      <motion.div
        className="flex h-full"
        style={{ x, width: width * TOTAL_PAGES }}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
      >
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            className="h-full flex-shrink-0"
            style={{ width }}
            aria-hidden={activeIndex !== i ? true : undefined}
          >
            <StopPage
              stop={stop}
              pageNumber={i + 1}
              totalPages={TOTAL_PAGES}
              stamp={stamps[stop.id]}
              onScan={() => setScannerStop(stop)}
              onForceStamp={() => stampWithSound(stop.id)}
            />
          </div>
        ))}

        <div
          key="attendance"
          className="h-full flex-shrink-0"
          style={{ width }}
          aria-hidden={activeIndex !== STOPS.length ? true : undefined}
        >
          <AttendancePage
            pageNumber={STOPS.length + 1}
            totalPages={TOTAL_PAGES}
          />
        </div>

        <div
          key="workout"
          className="h-full flex-shrink-0"
          style={{ width }}
          aria-hidden={activeIndex !== STOPS.length + 1 ? true : undefined}
        >
          <MathWorkoutPage
            pageNumber={STOPS.length + 2}
            totalPages={TOTAL_PAGES}
          />
        </div>
      </motion.div>

      <InteriorToolbar
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onReset={onReset}
      />

      <SideTabs
        activeIndex={activeIndex}
        stampedIds={stampedIds}
        onSelect={setActiveIndex}
      />

      {scannerStop && (
        <Suspense fallback={<ScannerLoading />}>
          <QRScannerModal
            open
            expectedPayload={buildStopPayload(scannerStop.id)}
            accentColor={ACCENT[scannerStop.accent].bg}
            onSuccess={() => {
              stampWithSound(scannerStop.id);
              setScannerStop(null);
            }}
            onClose={() => setScannerStop(null)}
            resolveScannedStopName={resolveScannedStopName}
          />
        </Suspense>
      )}
    </div>
  );
}

function ScannerLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#0F0F1F' }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{
          borderColor: 'rgba(255,255,255,0.15)',
          borderTopColor: 'var(--yellow)'
        }}
      />
    </div>
  );
}
