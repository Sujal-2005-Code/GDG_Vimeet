const express = require('express');

const { chatRateLimit } = require('../middleware/chatRateLimit');
const { SYSTEM_PROMPT, extractSources, suggestedQuestions } = require('../utils/faqContext');
const { generateReply, availableProviders, NoProviderError } = require('../services/llm');

const router = express.Router();

// Caps exist so a public, unauthenticated endpoint can't be used to run up a
// bill. The server owns the system prompt and only ever accepts plain
// user/assistant turns — a client-supplied "system" role would be an attempt
// to overwrite the grounding rules, so it is rejected outright.
const MAX_MESSAGES = 12;
const MAX_CONTENT_CHARS = 600;
const MAX_TOTAL_CHARS = 4000;
const MAX_HISTORY = 8;

function validate(body) {
  const messages = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Send a "messages" array with at least one message.' };
  }
  if (messages.length > MAX_MESSAGES) {
    return { error: `Conversation too long. Start a new chat (limit ${MAX_MESSAGES} messages).` };
  }

  let totalChars = 0;
  for (const message of messages) {
    if (!message || typeof message !== 'object') {
      return { error: 'Each message must be an object.' };
    }
    if (message.role !== 'user' && message.role !== 'assistant') {
      return { error: 'Each message role must be "user" or "assistant".' };
    }
    if (typeof message.content !== 'string' || message.content.trim().length === 0) {
      return { error: 'Each message needs non-empty text content.' };
    }
    if (message.content.length > MAX_CONTENT_CHARS) {
      return { error: `Please keep each message under ${MAX_CONTENT_CHARS} characters.` };
    }
    totalChars += message.content.length;
  }

  if (totalChars > MAX_TOTAL_CHARS) {
    return { error: 'Conversation too long. Please start a new chat.' };
  }
  if (messages[messages.length - 1].role !== 'user') {
    return { error: 'The last message must be from the user.' };
  }

  return {
    messages: messages
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content: content.trim() })),
  };
}

router.post('/', chatRateLimit, async (req, res) => {
  // Kill switch: flip CHAT_ENABLED=false to stop all spend without a redeploy.
  if (process.env.CHAT_ENABLED === 'false') {
    return res.status(503).json({ error: 'The assistant is currently unavailable.' });
  }

  const { error, messages } = validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const result = await generateReply({ system: SYSTEM_PROMPT, messages });
    const { reply, sources, noMatch } = extractSources(result.text);

    if (!reply) {
      return res.status(502).json({ error: 'The assistant did not return an answer. Please try again.' });
    }

    return res.json({ reply, sources, provider: result.provider, noMatch });
  } catch (err) {
    if (err instanceof NoProviderError) {
      console.error('Chat is enabled but no provider is configured.');
      return res.status(503).json({ error: 'The assistant is not configured yet.' });
    }
    console.error('Chat request failed:', err);
    return res.status(502).json({ error: 'The assistant is having trouble right now. Please try again.' });
  }
});

// Feeds the widget's empty state; no model call, so it is cheap to hit.
router.get('/suggestions', (_req, res) => {
  res.json({
    enabled: process.env.CHAT_ENABLED !== 'false' && availableProviders().length > 0,
    suggestions: suggestedQuestions,
  });
});

module.exports = router;
