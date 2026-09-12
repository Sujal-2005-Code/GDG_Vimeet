const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends an email via the Brevo (Sendinblue) transactional email HTTP API.
 *
 * Render's free tier firewalls off outbound SMTP ports (25/465/587), so
 * direct Gmail SMTP (nodemailer) silently times out there. Brevo's API is
 * plain HTTPS on port 443, which Render allows, so this works on the free
 * tier without any infra changes.
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
    console.error('Failed to send email:', error.response?.data || error.message);
  }
}

module.exports = { sendEmailMessage };
