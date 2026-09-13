// One-off helper to generate the bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-password.js "your-chosen-password"
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-chosen-password"');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nSet this as ADMIN_PASSWORD_HASH in your backend environment variables:\n');
  console.log(hash);
  console.log('');
});
