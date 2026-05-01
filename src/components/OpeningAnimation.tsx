import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Cover from './Cover';
import PassportInterior from './PassportInterior';

interface Props {
  phase: 'cover' | 'interior';
  onOpen: () => void;
}

export default function OpeningAnimation({ phase, onOpen }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative h-dvh w-full bg-cream overflow-hidden"
      style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
    >
      <AnimatePresence mode="wait" initial={false}>
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
              reduceMotion
                ? { opacity: 0 }
                : { rotateY: -175, opacity: 0 }
            }
            transition={{
              duration: reduceMotion ? 0.25 : 1.3,
              ease: reduceMotion ? 'linear' : [0.6, 0, 0.4, 1]
            }}
          >
            <Cover onOpen={onOpen} />
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
            <PassportInterior />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
