interface AttendancePayload {
  fullName: string;
  email: string;
  branch: string;
}

export interface AttendanceResponse {
  ok: true;
  recordId: string | null;
  clockInIso: string;
}

/**
 * POSTs to the Netlify Function which forwards to the Lark Base API.
 * Throws an Error with the server-provided message on any non-success response.
 */
export async function submitAttendance(
  payload: AttendancePayload
): Promise<AttendanceResponse> {
  const res = await fetch('/api/lark-attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  const responseOk =
    typeof data === 'object' &&
    data !== null &&
    (data as { ok?: boolean }).ok === true;

  if (!res.ok || !responseOk) {
    const errorMsg =
      typeof data === 'object' &&
      data !== null &&
      typeof (data as { error?: unknown }).error === 'string'
        ? ((data as { error: string }).error)
        : `Check-in failed (${res.status})`;
    throw new Error(errorMsg);
  }

  return data as AttendanceResponse;
}
