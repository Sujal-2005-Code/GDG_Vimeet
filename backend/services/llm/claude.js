// The SDK is exported as both a default and a namespace depending on how it
// is consumed; this works under CommonJS either way.
const AnthropicModule = require('@anthropic-ai/sdk');

const Anthropic = AnthropicModule.default ?? AnthropicModule;

const DEFAULT_MODEL = 'claude-opus-5';

let client;
const getClient = () => (client ??= new Anthropic());

const isConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

async function generate({ system, messages, maxTokens = 1024 }) {
  const model = process.env.CHAT_MODEL || DEFAULT_MODEL;

  const response = await getClient().messages.create({
    model,
    max_tokens: maxTokens,
    // Cached: the FAQ prefix is identical on every request, so repeat turns
    // within a conversation read it back at a fraction of the input cost.
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  return {
    text,
    model,
    usage: {
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
      cacheRead: response.usage?.cache_read_input_tokens ?? 0,
      cacheWrite: response.usage?.cache_creation_input_tokens ?? 0,
    },
  };
}

// Worth failing over to the other provider: rate limits, upstream faults and
// connection problems. A 400 or 401 is our bug or our key — retrying it
// elsewhere just produces a second failure.
function isRetryable(error) {
  if (error instanceof Anthropic.RateLimitError) return true;
  if (error instanceof Anthropic.APIConnectionError) return true;
  if (error instanceof Anthropic.APIError) return typeof error.status === 'number' && error.status >= 500;
  return false;
}

module.exports = { name: 'claude', isConfigured, generate, isRetryable };
