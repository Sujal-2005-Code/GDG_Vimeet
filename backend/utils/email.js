const nodemailer = require('nodemailer');

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

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
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
