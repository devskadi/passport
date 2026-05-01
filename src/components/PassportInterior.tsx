import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { STOPS, TOTAL_PAGES } from '../data/stops';
import { useSwipeNav } from '../hooks/useSwipeNav';
import AttendancePage from './AttendancePage';
import MathWorkoutPage from './MathWorkoutPage';
import SideTabs from './SideTabs';
import StopPage from './StopPage';
import type { StampRecord } from './StopPage';

type StampMap = Record<string, StampRecord>;

export default function PassportInterior() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stamps, setStamps] = useState<StampMap>({});

  const stampedIds = useMemo(() => new Set(Object.keys(stamps)), [stamps]);

  const stampStop = (stopId: string) => {
    setStamps((prev) => {
      if (prev[stopId]) return prev; // already stamped
      // Random rotation between -8° and +8° (inclusive), persisted with the stamp.
      const rotation = Math.round(Math.random() * 16) - 8;
      return {
        ...prev,
        [stopId]: {
          stampedAt: new Date().toISOString(),
          rotation
        }
      };
    });
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
              onScan={() => console.log('scan triggered — wired in step 8')}
              onForceStamp={() => stampStop(stop.id)}
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
    </div>
  );
}
