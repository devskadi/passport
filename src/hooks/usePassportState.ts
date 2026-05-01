import { useCallback, useEffect, useState } from 'react';

export interface StampRecord {
  stampedAt: string;
  rotation: number;
}

export interface PassportState {
  stamps: Record<string, StampRecord>;
  hasOpenedCover: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'passport.v1';

const DEFAULT_STATE: PassportState = {
  stamps: {},
  hasOpenedCover: false,
  soundEnabled: true
};

function isStampRecord(value: unknown): value is StampRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StampRecord).stampedAt === 'string' &&
    typeof (value as StampRecord).rotation === 'number'
  );
}

function sanitizeStamps(input: unknown): Record<string, StampRecord> {
  if (typeof input !== 'object' || input === null) return {};
  const out: Record<string, StampRecord> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (isStampRecord(value)) out[key] = value;
  }
  return out;
}

function loadState(): PassportState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      stamps: sanitizeStamps(parsed.stamps),
      hasOpenedCover:
        typeof parsed.hasOpenedCover === 'boolean'
          ? parsed.hasOpenedCover
          : false,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true
    };
  } catch (err) {
    console.warn('passport.v1: failed to load state', err);
    return DEFAULT_STATE;
  }
}

function saveState(state: PassportState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Quota / private mode etc. — keep state in memory only
    console.warn('passport.v1: failed to save state', err);
  }
}

export interface UsePassportStateApi {
  state: PassportState;
  stampStop: (stopId: string) => void;
  markCoverOpened: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetAll: () => void;
}

export function usePassportState(): UsePassportStateApi {
  const [state, setState] = useState<PassportState>(loadState);

  // Persist on every mutation. Cheap (the JSON is tiny) and synchronous.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const stampStop = useCallback((stopId: string) => {
    setState((prev) => {
      if (prev.stamps[stopId]) return prev;
      const rotation = Math.round(Math.random() * 16) - 8;
      return {
        ...prev,
        stamps: {
          ...prev.stamps,
          [stopId]: {
            stampedAt: new Date().toISOString(),
            rotation
          }
        }
      };
    });
  }, []);

  const markCoverOpened = useCallback(() => {
    setState((prev) =>
      prev.hasOpenedCover ? prev : { ...prev, hasOpenedCover: true }
    );
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setState((prev) =>
      prev.soundEnabled === enabled ? prev : { ...prev, soundEnabled: enabled }
    );
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return { state, stampStop, markCoverOpened, setSoundEnabled, resetAll };
}
