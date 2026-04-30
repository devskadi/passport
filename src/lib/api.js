export async function submitAttendance({ fullName, email, branch }) {
  const res = await fetch('/api/lark-attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, branch })
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok || !data?.ok) {
    const message = data?.error || `Check-in failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
