import { useCallback, useRef } from 'react';

/**
 * Procedurally-generated "thunk" sound for stamp presses.
 * No audio asset needed — uses a short low-frequency Web Audio burst with
 * fast attack and exponential decay.
 *
 * Returns a `play()` callback. Calls do nothing when `enabled` is false or
 * Web Audio is unavailable.
 */
export function useStampSound(enabled: boolean): () => void {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    try {
      if (!ctxRef.current) {
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (!ctx) return;
      // Browsers (esp. iOS Safari) start the AudioContext suspended until a
      // user gesture. The stamp press is itself a gesture, so resume here.
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (err) {
      console.warn('Stamp sound failed:', err);
    }
  }, [enabled]);
}
