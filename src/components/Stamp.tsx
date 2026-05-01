import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ACCENT } from '../data/stops';
import type { AccentColor } from '../data/stops';

interface StampProps {
  /** Unique identifier — used as a DOM id for the SVG textPath. */
  stampId: string;
  accent: AccentColor;
  /** Random rotation, persisted with the stamp so it stays stable on re-renders. */
  rotation: number;
  /** The stop's icon, rendered in the centre of the stamp. */
  Icon: LucideIcon;
  /** Diameter in px. Default 140 to match the slot from StopPage. */
  size?: number;
  /** "STAMPED · DAY 1" by default. */
  label?: string;
}

/**
 * Animated circular stamp:
 * - 2.5px solid border in the accent colour
 * - The stop's icon centred
 * - A circular text path with the stamp label, repeated to wrap the inside edge
 * - Drop-in motion: scale 1.4 → 1.0, opacity 0 → 0.85, persistent rotation
 */
export default function Stamp({
  stampId,
  accent,
  rotation,
  Icon,
  size = 140,
  label = 'STAMPED · DAY 1'
}: StampProps) {
  const tokens = ACCENT[accent];
  const pathId = `stamp-arc-${stampId}`;

  // Repeat the label so it tiles around the full circumference.
  const ringText = ` ${label} · ${label} · `;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: size,
        height: size,
        pointerEvents: 'none'
      }}
      initial={{ scale: 1.4, opacity: 0, rotate: rotation }}
      animate={{ scale: 1, opacity: 0.85, rotate: rotation }}
      transition={{
        duration: 0.4,
        ease: [0.2, 0.7, 0.2, 1]
      }}
    >
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
        aria-hidden
      >
        <defs>
          {/* Circle path (clockwise) for the wrapped text. r = 50 keeps it inside the 2.5px border at r = 65. */}
          <path
            id={pathId}
            d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
            fill="none"
          />
        </defs>
        <circle
          cx="70"
          cy="70"
          r="65"
          fill="none"
          stroke={tokens.bg}
          strokeWidth="2.5"
        />
        <text
          fill={tokens.bg}
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '9px',
            letterSpacing: '3px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {ringText.repeat(3)}
          </textPath>
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.bg
        }}
      >
        <Icon size={50} strokeWidth={1.6} />
      </div>
    </motion.div>
  );
}
