import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Props {
  /** Which scene to render. */
  phase: 'cover' | 'interior';
  /** Skips the cover-flip transition on the very first render (e.g. when
   * starting in `interior` because the user has already opened the cover). */
  initialPhase?: 'cover' | 'interior';
  cover: ReactNode;
  interior: ReactNode;
}

/**
 * Owns the perspective container and the cross-scene transition between the
 * cover and the interior. Reduced-motion users get an instant cross-fade.
 */
export default function OpeningAnimation({
  phase,
  initialPhase,
  cover,
  interior
}: Props) {
  const reduceMotion = useReducedMotion();
  // If the user starts already in the interior (returning visitor), suppress
  // AnimatePresence's initial enter animation.
  const skipInitial = initialPhase === phase;

  return (
    <div
      className="relative h-dvh w-full bg-cream overflow-hidden"
      style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
    >
      <AnimatePresence mode="wait" initial={!skipInitial}>
        {phase === 'cover' ? (
          <motion.div
            key="cover"
            className="absolute inset-0"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity'
            }}
            initial={false}
            exit={
              reduceMotion ? { opacity: 0 } : { rotateY: -175, opacity: 0 }
            }
            transition={{
              duration: reduceMotion ? 0.25 : 1.3,
              ease: reduceMotion ? 'linear' : [0.6, 0, 0.4, 1]
            }}
          >
            {cover}
          </motion.div>
        ) : (
          <motion.div
            key="interior"
            className="absolute inset-0"
            style={{ willChange: 'transform, opacity' }}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0.25 : 0.6,
              delay: reduceMotion ? 0 : 0.5,
              ease: [0.2, 0.6, 0.2, 1]
            }}
          >
            {interior}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
