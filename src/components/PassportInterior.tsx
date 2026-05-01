import { lazy, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACCENT, STOPS, TOTAL_PAGES } from '../data/stops';
import type { Stop } from '../data/stops';
import type { StampRecord } from '../hooks/usePassportState';
import { useStampSound } from '../hooks/useStampSound';
import { buildStopPayload, parsePayload } from '../lib/qrPayload';
import AttendancePage from './AttendancePage';
import InteriorToolbar from './InteriorToolbar';
import MathWorkoutPage from './MathWorkoutPage';
import SideTabs from './SideTabs';
import StopPage from './StopPage';

// Lazy-load the scanner — html5-qrcode is ~150KB gz that we don't want in
// the initial bundle since most users tap "Scan QR" only once per stop.
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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [scannerStop, setScannerStop] = useState<Stop | null>(null);

  const stampedIds = useMemo(() => new Set(Object.keys(stamps)), [stamps]);
  const playStampSound = useStampSound(soundEnabled);

  const goToPage = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

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

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ x: direction > 0 ? '8%' : '-8%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? '-8%' : '8%', opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <PageRenderer
            index={activeIndex}
            stamps={stamps}
            onScan={(stop) => setScannerStop(stop)}
            onForceStamp={stampWithSound}
          />
        </motion.div>
      </AnimatePresence>

      <InteriorToolbar
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onReset={onReset}
      />

      <SideTabs
        activeIndex={activeIndex}
        stampedIds={stampedIds}
        onSelect={goToPage}
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

interface PageRendererProps {
  index: number;
  stamps: Record<string, StampRecord>;
  onScan: (stop: Stop) => void;
  onForceStamp: (stopId: string) => void;
}

function PageRenderer({
  index,
  stamps,
  onScan,
  onForceStamp
}: PageRendererProps) {
  if (index < STOPS.length) {
    const stop = STOPS[index];
    if (!stop) return null;
    return (
      <StopPage
        stop={stop}
        pageNumber={index + 1}
        totalPages={TOTAL_PAGES}
        stamp={stamps[stop.id]}
        onScan={() => onScan(stop)}
        onForceStamp={() => onForceStamp(stop.id)}
      />
    );
  }
  if (index === STOPS.length) {
    return (
      <AttendancePage
        pageNumber={STOPS.length + 1}
        totalPages={TOTAL_PAGES}
      />
    );
  }
  return (
    <MathWorkoutPage
      pageNumber={STOPS.length + 2}
      totalPages={TOTAL_PAGES}
    />
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
