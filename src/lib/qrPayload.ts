/**
 * QR payload format for v1 stations: `passport://stop/XX`
 * where XX is the two-digit zero-padded stop ID (01–07).
 */
export type ParsedPayload =
  | { kind: 'stop'; id: string }
  | { kind: 'unknown' };

const STOP_PATTERN = /^passport:\/\/stop\/([0-9]{2})$/;

export function parsePayload(text: string): ParsedPayload {
  const stopMatch = text.trim().match(STOP_PATTERN);
  if (stopMatch && stopMatch[1]) {
    return { kind: 'stop', id: stopMatch[1] };
  }
  return { kind: 'unknown' };
}

export function buildStopPayload(stopId: string): string {
  return `passport://stop/${stopId}`;
}
