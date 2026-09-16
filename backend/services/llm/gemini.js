// Gemini is called over its REST API with the built-in fetch rather than a
// second SDK — one HTTP call, no extra dependency to keep updated.
//
// GEMINI_MODEL has no default on purpose: model names change, and a wrong
// hardcoded one fails at request time. Set it to a current model id from
// Google's docs (the value goes straight into the URL below).
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 20000;

const isConfigured = () => Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL);

async function generate({ system, messages, maxTokens = 1024 }) {
  const model = process.env.GEMINI_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const error = new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 200)}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('\n')
      .trim();

    return {
      text,
      model,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
        cacheRead: data.usageMetadata?.cachedContentTokenCount ?? 0,
        cacheWrite: 0,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

function isRetryable(error) {
  if (error?.name === 'AbortError') return true;
  if (typeof error?.status === 'number') return error.status === 429 || error.status >= 500;
  return true; // network-level failure
}

module.exports = { name: 'gemini', isConfigured, generate, isRetryable };
