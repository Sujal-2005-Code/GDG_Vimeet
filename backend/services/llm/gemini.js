// Gemini is called over its REST API with the built-in fetch rather than a
// second SDK — one HTTP call, no extra dependency to keep updated.
//
// GEMINI_MODEL has no default on purpose: model names change, and a wrong
// hardcoded one fails at request time. Set it to a current model id from
// Google's docs (the value goes straight into the URL below).
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const CACHE_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/cachedContents';
const TIMEOUT_MS = 20000;
const CACHE_TIMEOUT_MS = 8000; // fail fast into the uncached path rather than double the user's wait
const CACHE_TTL_SECONDS = 3600; // Google's own default; recreated automatically once it lapses
const CACHE_EXPIRY_SAFETY_MARGIN_MS = 60_000; // recreate a minute early, not exactly at expiry
// If cache creation fails (e.g. the project's tier doesn't allow cached-content
// storage at all — confirmed happening today: RESOURCE_EXHAUSTED,
// TotalCachedContentStorageTokensPerModelFreeTier limit=0), don't retry it on
// every single chat message. Back off for a while, then try again once — this
// self-heals if the project is later moved to a paid tier, without needing a
// restart, but stops a permanent per-tier block from costing every request an
// extra doomed round-trip.
const CACHE_RETRY_COOLDOWN_MS = 10 * 60 * 1000;

const isConfigured = () => Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL);

// The FAQ system prompt is byte-identical on every request for every user
// (see faqContext.js), which is exactly what explicit context caching is
// for: create it once, reuse the handle, and only the (tiny) per-turn
// conversation gets sent fresh. https://ai.google.dev/gemini-api/docs/caching
// One cache handle for the process's lifetime — reset if the model or the
// prompt text changes (it won't, short of a restart, but this is cheap and
// keeps a stale cache from ever silently serving the wrong prompt).
let cacheState = null; // { name, model, system, expiresAt }
let creatingCache = null; // in-flight creation promise, to dedupe concurrent requests
let cacheUnavailableUntil = 0; // set after a creation failure; skip retrying until this time

async function fetchJson(url, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const error = new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 200)}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function createCache(model, system) {
  try {
    const data = await fetchJson(
      CACHE_ENDPOINT,
      {
        model: `models/${model}`,
        systemInstruction: { parts: [{ text: system }] },
        ttl: `${CACHE_TTL_SECONDS}s`,
      },
      CACHE_TIMEOUT_MS
    );
    const expiresAt = data.expireTime ? Date.parse(data.expireTime) : Date.now() + CACHE_TTL_SECONDS * 1000;
    cacheState = { name: data.name, model, system, expiresAt };
    return data.name;
  } catch (err) {
    cacheUnavailableUntil = Date.now() + CACHE_RETRY_COOLDOWN_MS;
    throw err;
  }
}

// Returns { name, status } on success, or { name: null, status: 'cooldown' }
// without making any network call at all if a recent creation attempt
// already failed. Only throws for an actual (rare) fresh failure, which the
// caller logs once — cooldown skips are silent by design, since they would
// otherwise log on every single chat message for the whole cooldown window.
async function ensureCache(model, system) {
  const now = Date.now();
  const fresh = cacheState
    && cacheState.model === model
    && cacheState.system === system
    && now < cacheState.expiresAt - CACHE_EXPIRY_SAFETY_MARGIN_MS;
  if (fresh) return { name: cacheState.name, status: 'hit' };

  if (now < cacheUnavailableUntil) return { name: null, status: 'cooldown' };

  if (!creatingCache) {
    creatingCache = createCache(model, system).finally(() => {
      creatingCache = null;
    });
  }
  const name = await creatingCache;
  return { name, status: 'created' };
}

function toResult(data, model, cacheStatus) {
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('\n')
    .trim();

  return {
    text,
    model,
    cacheStatus,
    usage: {
      inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      cacheRead: data.usageMetadata?.cachedContentTokenCount ?? 0,
      cacheWrite: 0,
    },
  };
}

async function generate({ system, messages, maxTokens = 1024 }) {
  const model = process.env.GEMINI_MODEL;
  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
  const generationConfig = { maxOutputTokens: maxTokens };

  let cacheName = null;
  let cacheStatus = 'fallback';
  try {
    const result = await ensureCache(model, system);
    cacheName = result.name;
    cacheStatus = result.status; // 'hit' | 'created' | 'cooldown' (cooldown: no network call was made)
  } catch (err) {
    // A fresh creation attempt just failed (not a cooldown skip) — log it
    // once. No user content in this line, just that caching itself failed.
    console.error(`[chat] gemini cache unavailable (${err.message}); using uncached request`);
  }

  const uncachedBody = { systemInstruction: { parts: [{ text: system }] }, contents, generationConfig };

  if (!cacheName) {
    const data = await fetchJson(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, uncachedBody, TIMEOUT_MS);
    return toResult(data, model, cacheStatus);
  }

  try {
    const cachedBody = { cachedContent: cacheName, contents, generationConfig };
    const data = await fetchJson(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, cachedBody, TIMEOUT_MS);
    return toResult(data, model, cacheStatus);
  } catch (err) {
    // The cache handle may have expired or been deleted server-side between
    // our freshness check and this call. Drop it — the next request creates
    // a new one — and retry this one request uncached rather than fail it.
    console.error(`[chat] gemini cached request failed (${err.message}); retrying uncached`);
    if (cacheState?.name === cacheName) cacheState = null;
    cacheUnavailableUntil = Date.now() + CACHE_RETRY_COOLDOWN_MS;
    const data = await fetchJson(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, uncachedBody, TIMEOUT_MS);
    return toResult(data, model, 'fallback');
  }
}

function isRetryable(error) {
  if (error?.name === 'AbortError') return true;
  if (typeof error?.status === 'number') return error.status === 429 || error.status >= 500;
  return true; // network-level failure
}

module.exports = { name: 'gemini', isConfigured, generate, isRetryable };
