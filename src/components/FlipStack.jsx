const ACCENT_COLORS = ['#FF6B4A', '#0DB5A6', '#FFC93C', '#FF3D7F'];

export default function FlipStack({
  count,
  perPageMs = 400,
  staggerMs = 50,
  startDelayMs = 0,
  color,
  direction = 'next'
}) {
  const animationName = direction === 'prev' ? 'pageFlipPrev' : 'pageFlip';
  // Both flip around the left spine — only the rotation direction differs (next: 0 → -180, prev: 0 → 180).
  const transformOrigin = 'left center';

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 50%',
        zIndex: 50
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="page-flip absolute inset-0"
          style={{
            background: color ?? ACCENT_COLORS[i % ACCENT_COLORS.length],
            animationName,
            transformOrigin,
            animationDelay: `${startDelayMs + i * staggerMs}ms`,
            animationDuration: `${perPageMs}ms`,
            zIndex: count - i
          }}
        />
      ))}
    </div>
  );
}
