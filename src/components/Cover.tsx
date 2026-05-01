import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

interface CoverProps {
  onOpen: () => void;
}

export default function Cover({ onOpen }: CoverProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream overflow-hidden">
      {/* Floating passport cover */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative cover-bg flex flex-col items-center justify-between py-12 px-6 overflow-hidden"
        style={{
          width: 'min(85vw, 340px)',
          aspectRatio: '340 / 500',
          borderRadius: '12px',
          background:
            'radial-gradient(at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 55%), linear-gradient(135deg, #FF6B4A 0%, #E84A2A 100%)',
          boxShadow:
            '0 30px 60px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05), inset 0 0 80px rgba(0,0,0,0.18)'
        }}
      >
        {/* Subtle paper noise overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            mixBlendMode: 'overlay',
            borderRadius: 'inherit'
          }}
        />

        {/* Inner dashed stitch border */}
        <div
          aria-hidden
          className="absolute inset-3 sm:inset-4 pointer-events-none"
          style={{
            border: '1.5px dashed rgba(255,248,236,0.55)',
            borderRadius: '10px'
          }}
        />

        {/* Compass crest */}
        <div className="relative flex flex-col items-center mt-1">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3"
            style={{
              border: '2px solid var(--yellow)',
              background: 'rgba(255,201,60,0.15)'
            }}
          >
            <Compass size={26} color="var(--yellow)" strokeWidth={1.5} />
          </div>
          <div
            className="font-display text-[9px] sm:text-[10px] tracking-[0.4em]"
            style={{ color: 'var(--yellow)' }}
          >
            EST. DAY ONE
          </div>
        </div>

        {/* Wordmark */}
        <div className="relative flex flex-col items-center text-center">
          <div
            className="font-display font-medium text-xs sm:text-sm tracking-[0.3em] mb-2 sm:mb-3"
            style={{ color: 'var(--cream)', opacity: 0.95 }}
          >
            EMPLOYEE
          </div>
          <div
            className="font-display font-black text-4xl sm:text-5xl tracking-wide leading-none"
            style={{
              color: 'var(--cream)',
              textShadow: '0 2px 0 rgba(0,0,0,0.2)'
            }}
          >
            PASSPORT
          </div>
          <div
            className="mt-3 sm:mt-4 h-px w-24 sm:w-32"
            style={{ background: 'var(--yellow)', opacity: 0.7 }}
          />
          <div
            className="font-hand text-lg sm:text-xl mt-2 sm:mt-3"
            style={{ color: 'var(--yellow)' }}
          >
            a journey begins
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex flex-col items-center gap-1 sm:gap-2">
          <div
            className="font-display text-[9px] sm:text-[10px] tracking-[0.3em]"
            style={{ color: 'var(--yellow)', opacity: 0.7 }}
          >
            · · ·
          </div>
          <div
            className="font-mono text-[9px] sm:text-[10px] tracking-widest"
            style={{ color: 'rgba(255,248,236,0.55)' }}
          >
            Nº 0001 / DAY-01
          </div>
        </div>
      </motion.div>

      {/* String + luggage tag */}
      <div className="relative flex flex-col items-center mt-6 sm:mt-8">
        <div
          aria-hidden
          style={{
            width: '2px',
            height: '24px',
            background: 'rgba(26,26,46,0.25)',
            marginBottom: '-2px'
          }}
        />
        <motion.div
          animate={{ rotate: [-4, 3, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center' }}
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open passport"
            className="luggage-tag relative px-7 sm:px-8 py-3.5 sm:py-4 rounded-lg font-display font-semibold text-base sm:text-lg transition-all duration-150"
            style={{
              minWidth: '180px',
              background:
                'linear-gradient(180deg, #FFD862 0%, #FFC93C 100%)',
              color: 'var(--ink)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 0 #C99300, 0 8px 18px -4px rgba(26,26,46,0.5)'
            }}
          >
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 w-3 h-3 rounded-full"
              style={{
                transform: 'translateX(-50%)',
                background: 'var(--ink)',
                border: '1px solid rgba(0,0,0,0.5)'
              }}
            />
            <span className="relative">I'm ready</span>
          </button>
        </motion.div>
        <div
          className="mt-5 sm:mt-6 font-hand text-sm sm:text-base"
          style={{ color: 'var(--ink-mute)' }}
        >
          tap the tag to begin
        </div>
      </div>
    </div>
  );
}
