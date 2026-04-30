const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const {
    LARK_APP_ID,
    LARK_APP_SECRET,
    LARK_BASE_APP_TOKEN,
    LARK_TABLE_ID,
    LARK_FIELD_NAME = 'Full Name',
    LARK_FIELD_EMAIL = 'Email',
    LARK_FIELD_BRANCH = 'Branch',
    LARK_FIELD_CLOCKIN = 'Clock-in',
    LARK_API_BASE = 'https://open.larksuite.com'
  } = process.env;

  if (!LARK_APP_ID || !LARK_APP_SECRET || !LARK_BASE_APP_TOKEN || !LARK_TABLE_ID) {
    return json(500, {
      ok: false,
      error: 'Server is missing Lark environment variables.'
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body.' });
  }

  const fullName = String(payload.fullName || '').trim();
  const email = String(payload.email || '').trim();
  const branch = String(payload.branch || '').trim();

  if (!fullName) return json(400, { ok: false, error: 'Full name is required.' });
  if (!EMAIL_RE.test(email)) return json(400, { ok: false, error: 'A valid email is required.' });
  if (!branch) return json(400, { ok: false, error: 'Branch is required.' });

  const clockInDate = new Date();
  const clockInIso = clockInDate.toISOString();
  const clockInMs = clockInDate.getTime();

  try {
    // 1. Tenant access token
    const tokenRes = await fetch(
      `${LARK_API_BASE}/open-apis/auth/v3/tenant_access_token/internal`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: LARK_APP_ID, app_secret: LARK_APP_SECRET })
      }
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.code !== 0 || !tokenData.tenant_access_token) {
      console.error('Lark token error:', tokenData);
      return json(502, { ok: false, error: 'Lark authentication failed.' });
    }
    const token = tokenData.tenant_access_token;

    // 2. Create record
    const recRes = await fetch(
      `${LARK_API_BASE}/open-apis/bitable/v1/apps/${LARK_BASE_APP_TOKEN}/tables/${LARK_TABLE_ID}/records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fields: {
            [LARK_FIELD_NAME]: fullName,
            [LARK_FIELD_EMAIL]: email,
            [LARK_FIELD_BRANCH]: branch,
            [LARK_FIELD_CLOCKIN]: clockInMs
          }
        })
      }
    );
    const recData = await recRes.json();
    if (!recRes.ok || recData.code !== 0) {
      console.error('Lark record error:', recData);
      return json(502, {
        ok: false,
        error: recData.msg || 'Failed to write attendance record.'
      });
    }

    return json(200, {
      ok: true,
      recordId: recData.data?.record?.record_id || null,
      clockInIso
    });
  } catch (err) {
    console.error('Lark function unexpected error:', err);
    return json(500, { ok: false, error: 'Unexpected server error.' });
  }
};
