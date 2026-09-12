require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sendEmailMessage } = require('./utils/email');

async function test() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const result = await sendEmailMessage(
    "gdscvimeet@gmail.com", // sending to themselves
    "Test Email",
    "<p>This is a test email.</p>"
  );
  if (result) {
    console.log("SUCCESS!");
  } else {
    console.log("FAILED to send email.");
  }
}

test();
