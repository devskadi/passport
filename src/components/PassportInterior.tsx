import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ACCENT, STOPS, TOTAL_PAGES } from '../data/stops';
import type { Stop } from '../data/stops';
import { useSwipeNav } from '../hooks/useSwipeNav';
import type { StampRecord } from '../hooks/usePassportState';
import { buildStopPayload, parsePayload } from '../lib/qrPayload';
import AttendancePage from './AttendancePage';
import MathWorkoutPage from './MathWorkoutPage';
import QRScannerModal from './QRScannerModal';
import SideTabs from './SideTabs';
import StopPage from './StopPage';

interface Props {
  stamps: Record<string, StampRecord>;
  onStamp: (stopId: string) => void;
}

export default function PassportInterior({ stamps, onStamp }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scannerStop, setScannerStop] = useState<Stop | null>(null);

  const stampedIds = useMemo(() => new Set(Object.keys(stamps)), [stamps]);

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
              onForceStamp={() => onStamp(stop.id)}
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

      <SideTabs
        activeIndex={activeIndex}
        stampedIds={stampedIds}
        onSelect={setActiveIndex}
      />

      <QRScannerModal
        open={!!scannerStop}
        expectedPayload={
          scannerStop ? buildStopPayload(scannerStop.id) : ''
        }
        accentColor={
          scannerStop ? ACCENT[scannerStop.accent].bg : '#FFFFFF'
        }
        onSuccess={() => {
          if (!scannerStop) return;
          onStamp(scannerStop.id);
          setScannerStop(null);
        }}
        onClose={() => setScannerStop(null)}
        resolveScannedStopName={resolveScannedStopName}
      />
    </div>
  );
}
