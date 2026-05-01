import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertTriangle, Camera, X } from 'lucide-react';

interface Props {
  open: boolean;
  /** Exact payload that signals a successful scan, e.g. `passport://stop/01`. */
  expectedPayload: string;
  /** Hex/CSS colour for the viewfinder cutout border. */
  accentColor: string;
  /** Caption displayed above the viewfinder. */
  caption?: string;
  /** Called once the expected payload is detected. */
  onSuccess: (payload: string) => void;
  /** Called when the user closes the modal (X tap or escape). */
  onClose: () => void;
  /** Optional: resolve a scanned payload to a human stop name for the mismatch toast. */
  resolveScannedStopName?: (payload: string) => string | null;
}

const READER_ID = 'qr-reader-container';
const MISMATCH_COOLDOWN_MS = 1500;
const TOAST_DURATION_MS = 2500;

export default function QRScannerModal({
  open,
  expectedPayload,
  accentColor,
  caption = 'Point at the QR code at this station',
  onSuccess,
  onClose,
  resolveScannedStopName
}: Props) {
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>(
    'pending'
  );
  const [toast, setToast] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [scope, animate] = useAnimate();
  const cooldownUntilRef = useRef(0);
  const onSuccessRef = useRef(onSuccess);
  const resolveNameRef = useRef(resolveScannedStopName);

  // Keep refs current without retriggering the camera-init effect.
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    resolveNameRef.current = resolveScannedStopName;
  }, [onSuccess, resolveScannedStopName]);

  // Camera lifecycle — re-initialised whenever the modal opens or the user retries.
  useEffect(() => {
    if (!open) return;

    setPermission('pending');
    setToast(null);
    cooldownUntilRef.current = 0;

    const scanner = new Html5Qrcode(READER_ID, /* verbose */ false);
    let stopped = false;

    const handleDecoded = (text: string) => {
      if (Date.now() < cooldownUntilRef.current) return;
      const trimmed = text.trim();
      if (trimmed === expectedPayload) {
        cooldownUntilRef.current = Date.now() + 5000; // freeze further reads
        onSuccessRef.current(trimmed);
        return;
      }
      // Mismatch — shake viewfinder + toast
      const name = resolveNameRef.current?.(trimmed) ?? null;
      const msg = name
        ? `Wrong station — this is for ${name}`
        : 'That QR code isn’t for this station';
      setToast(msg);
      animate(
        scope.current,
        { x: [0, -10, 10, -7, 7, -3, 3, 0] },
        { duration: 0.36, ease: 'easeInOut' }
      );
      cooldownUntilRef.current = Date.now() + MISMATCH_COOLDOWN_MS;
      window.setTimeout(() => {
        setToast((current) => (current === msg ? null : current));
      }, TOAST_DURATION_MS);
    };

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleDecoded,
        () => {
          // continuously fired when no QR in frame — silently ignored
        }
      )
      .then(() => {
        if (!stopped) setPermission('granted');
      })
      .catch((err) => {
        console.error('Camera init failed:', err);
        if (!stopped) setPermission('denied');
      });

    return () => {
      stopped = true;
      scanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          try {
            scanner.clear();
          } catch {
            // ignore — already stopped
          }
        });
    };
  }, [open, expectedPayload, retryToken, animate, scope]);

  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ background: '#0F0F1F' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Camera reader (html5-qrcode mounts a <video> inside this div) */}
          <div
            id={READER_ID}
            className="absolute inset-0"
            style={{
              // Stretch the injected video to fill the modal.
              ['--qr-fit' as string]: 'cover'
            }}
          />
          <style>{`
            #${READER_ID} > video,
            #${READER_ID} > canvas {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              display: block !important;
            }
          `}</style>

          {permission === 'denied' ? (
            <PermissionFallback
              onRetry={() => setRetryToken((n) => n + 1)}
              onClose={onClose}
            />
          ) : (
            <>
              {/* Dim overlay with a square cutout via large outset shadow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  ref={scope}
                  className="rounded-3xl"
                  style={{
                    width: '256px',
                    height: '256px',
                    boxShadow: '0 0 0 9999px rgba(15,15,31,0.72)',
                    border: `3px solid ${accentColor}`
                  }}
                />
              </div>

              {/* Caption above viewfinder */}
              <div
                className="absolute left-0 right-0 text-center px-6 pointer-events-none"
                style={{ top: 'calc(50% - 180px)' }}
              >
                <p className="font-display font-semibold text-base text-white">
                  {caption}
                </p>
              </div>

              {/* Pending state hint */}
              {permission === 'pending' && (
                <div
                  className="absolute left-0 right-0 text-center px-6 pointer-events-none"
                  style={{ top: 'calc(50% + 150px)' }}
                >
                  <p className="font-hand text-lg text-white/75">
                    starting camera…
                  </p>
                </div>
              )}

              {/* Mismatch toast */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    className="absolute left-6 right-6 bottom-12 px-4 py-3 rounded-2xl flex items-center gap-2"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: 'var(--pink)',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.45)'
                    }}
                  >
                    <AlertTriangle size={18} strokeWidth={2.4} />
                    <span className="text-sm font-medium">{toast}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Close X — always visible */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FallbackProps {
  onRetry: () => void;
  onClose: () => void;
}

function PermissionFallback({ onRetry, onClose }: FallbackProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
      style={{ background: '#0F0F1F' }}
    >
      <div
        className="flex items-center justify-center rounded-3xl mb-5"
        style={{
          background: 'rgba(255,201,60,0.15)',
          color: 'var(--yellow)',
          width: '88px',
          height: '88px',
          border: '2px solid rgba(255,201,60,0.4)'
        }}
      >
        <Camera size={40} strokeWidth={1.6} />
      </div>
      <h2 className="font-display font-bold text-2xl text-white mb-2">
        Camera blocked
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-xs leading-relaxed">
        We need camera access to read the QR code at this station. Enable it in
        your browser settings, then try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-3 rounded-full font-display font-semibold text-base"
        style={{
          background: 'var(--yellow)',
          color: 'var(--ink)',
          boxShadow: '0 8px 20px -6px rgba(255,201,60,0.6)'
        }}
      >
        Try again
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 text-sm text-white/60 underline"
      >
        Cancel
      </button>
    </div>
  );
}
