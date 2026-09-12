const nodemailer = require('nodemailer');
const dns = require('dns');

// Fix for Render ENETUNREACH IPv6 errors when connecting to Gmail
dns.setDefaultResultOrder('ipv4first');

/**
 * Sends an email using Gmail SMTP.
 * 
 * @param {string} recipientEmail - The applicant's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} htmlContent - The HTML body of the email.
 */
async function sendEmailMessage(recipientEmail, subject, htmlContent) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.warn('Gmail credentials not configured. Skipping email sending.');
      return;
    }

    // Create a transporter using explicit Gmail SMTP settings to force IPv4
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass
      },
      // Force IPv4 socket connection (bypasses Render IPv6 block)
      family: 4
    });

    const mailOptions = {
      from: `"GDG Vimeet" <${user}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', recipientEmail, 'Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}

module.exports = { sendEmailMessage };
