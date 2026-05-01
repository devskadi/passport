import { motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReset: () => void;
}

/**
 * Floating top-left toolbar inside the interior.
 * - Mute toggle (persists via passport.v1.soundEnabled)
 * - Reset button (clears all stamps, returns to the cover)
 *
 * Top-right is left clear because the QR scanner modal puts its X close
 * button there.
 */
export default function InteriorToolbar({
  soundEnabled,
  onToggleSound,
  onReset
}: Props) {
  return (
    <motion.div
      className="absolute top-4 left-4 z-40 flex items-center gap-1.5"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)'
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <ToolbarButton
        ariaLabel={soundEnabled ? 'Mute stamp sounds' : 'Unmute stamp sounds'}
        onClick={onToggleSound}
      >
        {soundEnabled ? (
          <Volume2 size={16} strokeWidth={2.2} />
        ) : (
          <VolumeX size={16} strokeWidth={2.2} />
        )}
      </ToolbarButton>
      <ToolbarButton ariaLabel="Reset passport" onClick={onReset}>
        <RotateCcw size={16} strokeWidth={2.2} />
      </ToolbarButton>
    </motion.div>
  );
}

interface ToolbarButtonProps {
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ ariaLabel, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
      style={{
        background: 'rgba(255,255,255,0.85)',
        color: 'var(--ink-soft)',
        border: '1px solid rgba(26,26,46,0.08)',
        boxShadow: '0 4px 10px -4px rgba(26,26,46,0.18)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {children}
    </button>
  );
}
