import { Calculator, Check, UserCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ACCENT, SPECIAL_TABS, STOPS } from '../data/stops';
import type { AccentColor } from '../data/stops';

interface SideTabsProps {
  activeIndex: number;
  stampedIds: Set<string>;
  onSelect: (index: number) => void;
}

export default function SideTabs({
  activeIndex,
  stampedIds,
  onSelect
}: SideTabsProps) {
  return (
    <nav
      aria-label="Passport pages"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-[2px]"
    >
      {STOPS.map((stop, i) => (
        <Tab
          key={stop.id}
          accent={stop.accent}
          isActive={activeIndex === i}
          isStamped={stampedIds.has(stop.id)}
          onClick={() => onSelect(i)}
          ariaLabel={`Stop ${stop.id} — ${stop.name}`}
        >
          <span className="font-display font-bold text-[11px] tabular-nums">
            {stop.id}
          </span>
        </Tab>
      ))}

      {/* Visual divider gap between stops 1–7 and the special tabs */}
      <div aria-hidden style={{ height: '12px' }} />

      {SPECIAL_TABS.map((tab, i) => {
        const Icon: LucideIcon = tab.id === 'attendance' ? UserCheck : Calculator;
        return (
          <Tab
            key={tab.id}
            accent={tab.accent}
            isActive={activeIndex === STOPS.length + i}
            isStamped={false}
            onClick={() => onSelect(STOPS.length + i)}
            ariaLabel={tab.label}
          >
            <Icon size={14} strokeWidth={2.2} />
          </Tab>
        );
      })}
    </nav>
  );
}

interface TabProps {
  accent: AccentColor;
  isActive: boolean;
  isStamped: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

function Tab({
  accent,
  isActive,
  isStamped,
  onClick,
  ariaLabel,
  children
}: TabProps) {
  const tokens = ACCENT[accent];

  // Three visual states (per brief):
  // 1. inactive + unstamped → outlined, muted
  // 2. inactive + stamped   → filled accent + check overlay
  // 3. active               → extends 8px outward, brighter, shadow
  const filled = isActive || isStamped;
  const baseWidth = 32;
  const activeWidth = 40;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex items-center justify-start pl-2.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
      style={{
        width: `${isActive ? activeWidth : baseWidth}px`,
        height: '36px',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        background: filled ? tokens.bg : 'rgba(255,255,255,0.85)',
        color: filled ? '#FFFFFF' : tokens.dark,
        border: filled ? 'none' : `1.5px solid ${tokens.bg}66`,
        borderRight: 'none',
        boxShadow: isActive
          ? `-4px 4px 12px -4px ${tokens.bg}aa, inset 0 1px 0 rgba(255,255,255,0.25)`
          : isStamped
            ? `inset 0 1px 0 rgba(255,255,255,0.25)`
            : 'none'
      }}
    >
      {children}

      {/* Tiny check overlay for inactive + stamped */}
      {isStamped && !isActive && (
        <span
          aria-hidden
          className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--cream)',
            color: tokens.dark,
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
          }}
        >
          <Check size={9} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
