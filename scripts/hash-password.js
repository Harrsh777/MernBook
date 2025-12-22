// Utility script to hash passwords for client creation
// Usage: node scripts/hash-password.js <password>

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-password.js <password>');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nHashed password:');
console.log(hash);
console.log('\nUse this in your SQL INSERT statement:\n');

