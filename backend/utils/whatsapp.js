const axios = require('axios');

/**
 * Sends a WhatsApp message using Meta's Official Cloud API.
 * 
 * @param {string} mobileNumber - The 10-digit mobile number (or with country code).
 * @param {string} message - The text message to send.
 */
async function sendWhatsAppMessage(mobileNumber, message) {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.warn('WhatsApp API credentials not configured. Skipping message sending.');
      return;
    }

    // Ensure the number starts with the country code. 
    // If it's exactly 10 digits, assume it's an Indian number and prepend '91'.
    let formattedNumber = mobileNumber.trim();
    if (formattedNumber.length === 10) {
      formattedNumber = '91' + formattedNumber;
    }

    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: formattedNumber,
      type: 'text',
      text: {
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('WhatsApp message sent successfully to', formattedNumber, 'Message ID:', response.data.messages?.[0]?.id);
    return response.data;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
  }
}

module.exports = { sendWhatsAppMessage };
