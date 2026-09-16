const claude = require('./claude');
const gemini = require('./gemini');

// One interface, two providers. LLM_PROVIDER picks the primary; if that call
// fails in a way worth retrying, the other one answers instead, so a rate
// limit or outage at one provider doesn't take the assistant down.
const PROVIDERS = { claude, gemini };

function providerOrder() {
  const preferred = process.env.LLM_PROVIDER === 'gemini' ? 'gemini' : 'claude';
  const fallback = preferred === 'claude' ? 'gemini' : 'claude';
  return [PROVIDERS[preferred], PROVIDERS[fallback]].filter((p) => p.isConfigured());
}

function availableProviders() {
  return Object.values(PROVIDERS).filter((p) => p.isConfigured()).map((p) => p.name);
}

class NoProviderError extends Error {
  constructor() {
    super('No LLM provider is configured. Set ANTHROPIC_API_KEY, or GEMINI_API_KEY with GEMINI_MODEL.');
    this.name = 'NoProviderError';
  }
}

async function generateReply({ system, messages, maxTokens }) {
  const chain = providerOrder();
  if (chain.length === 0) throw new NoProviderError();

  let lastError;
  for (const [index, provider] of chain.entries()) {
    const startedAt = Date.now();
    try {
      const result = await provider.generate({ system, messages, maxTokens });
      // One line per answered request — this is the spend and latency record.
      // Never includes message text: only token counts, timing, and cache state.
      const cacheStatus = result.cacheStatus ? ` cacheStatus=${result.cacheStatus}` : '';
      console.log(
        `[chat] provider=${provider.name} model=${result.model} in=${result.usage.inputTokens} out=${result.usage.outputTokens} cacheRead=${result.usage.cacheRead}${cacheStatus} ms=${Date.now() - startedAt}${index > 0 ? ' (failover)' : ''}`
      );
      return { ...result, provider: provider.name };
    } catch (error) {
      lastError = error;
      const willFailOver = provider.isRetryable(error) && index < chain.length - 1;
      console.error(`[chat] provider=${provider.name} failed: ${error.message}${willFailOver ? ' — failing over' : ''}`);
      if (!provider.isRetryable(error)) break;
    }
  }

  throw lastError;
}

module.exports = { generateReply, availableProviders, NoProviderError };
