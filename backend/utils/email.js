const nodemailer = require('nodemailer');
const dns = require('dns');

// Fix for Render ENETUNREACH IPv6 errors when connecting to Gmail
dns.setDefaultResultOrder('ipv4first');

// Helper to forcefully resolve Gmail's IPv4 address
function getGmailIPv4() {
  return new Promise((resolve) => {
    dns.resolve4('smtp.gmail.com', (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve('smtp.gmail.com'); // Fallback
      } else {
        resolve(addresses[0]); // Return guaranteed IPv4 address
      }
    });
  });
}

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

    const ipv4Host = await getGmailIPv4();

    // Create a transporter using guaranteed IPv4 address
    const transporter = nodemailer.createTransport({
      host: ipv4Host,
      port: 465,
      secure: true,
      tls: {
        // Required when using an IP address to verify the TLS certificate matches the domain
        servername: 'smtp.gmail.com'
      },
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
