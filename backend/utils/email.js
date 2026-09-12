const axios = require('axios');
const https = require('https');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Reuse a single keep-alive agent so retries don't pay a fresh TCP+TLS
// handshake every time, and cap how long a single attempt can hang for —
// axios has no timeout by default, so a stalled connection would otherwise
// sit open until the OS's own TCP retry limit gives up (~2 minutes on Linux).
const httpsAgent = new https.Agent({ keepAlive: true });

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends an email via the Brevo (Sendinblue) transactional email HTTP API.
 *
 * Render's free tier firewalls off outbound SMTP ports (25/465/587), so
 * direct Gmail SMTP (nodemailer) silently times out there. Brevo's API is
 * plain HTTPS on port 443, which Render allows, so this works on the free
 * tier without any infra changes.
 *
 * NOTE: even the HTTPS call to Brevo has been observed to occasionally hang
 * for ~2 minutes before failing with "Connection timeout" on Render's free
 * tier (a raw TCP-level stall, no HTTP response at all — consistent with
 * flaky/shared free-tier egress rather than a port block). This function
 * retries a few times with a short per-attempt timeout so a transient stall
 * doesn't turn into a 2+ minute hang, and logs enough detail (error code)
 * to tell a network-path failure apart from a Brevo API rejection.
 *
 * Setup required (one-time):
 *   1. Create a free Brevo account (brevo.com) — 300 emails/day free, no card.
 *   2. Under Senders, add & verify EMAIL_USER (e.g. gdscvimeet@gmail.com) as a sender.
 *   3. Generate an API key under SMTP & API > API Keys.
 *   4. Set BREVO_API_KEY (and EMAIL_USER) in Render's environment variables.
 *
 * @param {string} recipientEmail - The applicant's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} htmlContent - The HTML body of the email.
 */
async function sendEmailMessage(recipientEmail, subject, htmlContent) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    console.warn('Brevo credentials not configured (BREVO_API_KEY / EMAIL_USER). Skipping email sending.');
    return;
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await axios.post(
        BREVO_API_URL,
        {
          sender: { name: 'GDG Vimeet', email: senderEmail },
          to: [{ email: recipientEmail }],
          subject,
          htmlContent,
        },
        {
          httpsAgent,
          timeout: ATTEMPT_TIMEOUT_MS,
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log('Email sent successfully to', recipientEmail, 'Message ID:', response.data.messageId);
      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === MAX_ATTEMPTS;
      const detail = error.response
        ? { status: error.response.status, data: error.response.data }
        : { code: error.code, message: error.message };
      console.error(
        `Failed to send email (attempt ${attempt}/${MAX_ATTEMPTS})${isLastAttempt ? ', giving up' : ', retrying'}:`,
        detail
      );
      if (!isLastAttempt) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
}

module.exports = { sendEmailMessage };
