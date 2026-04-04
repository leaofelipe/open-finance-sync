const PLUGGY_BASE_URL = 'https://api.pluggy.ai';
const API_KEY_TTL_MS = 90 * 60 * 1000;

let cachedApiKey = null;
let cachedApiKeyExpiresAt = null;

async function getApiKey() {
  const now = Date.now();

  if (cachedApiKey && cachedApiKeyExpiresAt && now < cachedApiKeyExpiresAt) {
    return cachedApiKey;
  }

  const response = await fetch(`${PLUGGY_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pluggy auth failed: ${response.status} - ${body}`);
  }

  const data = await response.json();
  cachedApiKey = data.apiKey;
  cachedApiKeyExpiresAt = now + API_KEY_TTL_MS;

  return cachedApiKey;
}

async function pluggyFetch(path) {
  const apiKey = await getApiKey();

  const response = await fetch(`${PLUGGY_BASE_URL}${path}`, {
    headers: { 'X-API-KEY': apiKey },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pluggy request failed [${path}]: ${response.status} - ${body}`);
  }

  return response.json();
}

module.exports = { PLUGGY_BASE_URL, getApiKey, pluggyFetch };
