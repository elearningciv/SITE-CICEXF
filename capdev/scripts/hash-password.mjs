// Usage: npm run hash-password -- "mot de passe"
// Prints the two lines to paste into the server's .env file.
import crypto from 'node:crypto';

const pwd = process.argv[2];
if (!pwd || pwd.length < 10) {
  console.error('Donnez un mot de passe d\'au moins 10 caractères : npm run hash-password -- "..."');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString('hex');
console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt}$${crypto.scryptSync(pwd, salt, 64).toString('hex')}`);
console.log(`SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`);
