import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import type { MotionValue, PanInfo } from 'framer-motion';

interface UseSwipeNavOptions {
  activeIndex: number;
  pageCount: number;
  onChange: (newIndex: number) => void;
  /** Min horizontal drag distance (in fraction of page width) to commit a page change. */
  distanceFraction?: number;
  /** Min horizontal velocity (px/s) to commit a page change regardless of distance. */
  velocityThreshold?: number;
}

interface UseSwipeNavResult {
  containerRef: React.RefObject<HTMLDivElement>;
  width: number;
  x: MotionValue<number>;
  dragConstraints: { left: number; right: number };
  onDragEnd: (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
}

/**
 * Encapsulates horizontal swipe-to-navigate for a fixed-width page track.
 *
 * Pattern: a motion.div track of width = pageCount * containerWidth, translated
 * by `x` to put the active page in view. Drag offset/velocity decides whether
 * to commit to the next/prev page or spring back.
 */
export function useSwipeNav({
  activeIndex,
  pageCount,
  onChange,
  distanceFraction = 0.25,
  velocityThreshold = 500
}: UseSwipeNavOptions): UseSwipeNavResult {
  const containerRef = useRef<HTMLDivElement>(null!);
  const x = useMotionValue(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Spring-snap to the active page whenever the index or container width changes.
  useEffect(() => {
    if (width <= 0) return;
    const controls = animate(x, -activeIndex * width, {
      type: 'spring',
      damping: 30,
      stiffness: 280
    });
    return () => controls.stop();
  }, [activeIndex, width, x]);

  const onDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (width <= 0) return;
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    let nextIndex = activeIndex;
    if (offsetX < -width * distanceFraction || velocityX < -velocityThreshold) {
      nextIndex = Math.min(activeIndex + 1, pageCount - 1);
    } else if (
      offsetX > width * distanceFraction ||
      velocityX > velocityThreshold
    ) {
      nextIndex = Math.max(activeIndex - 1, 0);
    }
    onChange(nextIndex);
  };

  return {
    containerRef,
    width,
    x,
    dragConstraints: {
      left: -(pageCount - 1) * width,
      right: 0
    },
    onDragEnd
  };
}
