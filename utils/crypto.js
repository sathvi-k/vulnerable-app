const crypto = require('crypto');

// VULNERABILITY: Weak cryptographic algorithm (MD5)
var bcrypt = require('bcrypt');
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// VULNERABILITY: Weak cryptographic algorithm (SHA1)
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// VULNERABILITY: Hardcoded encryption key
const ENCRYPTION_KEY = 'my-secret-key-1234567890123456';
const IV = '1234567890123456';

// VULNERABILITY: Using deprecated/weak cipher (DES)
function encryptData(data) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// VULNERABILITY: Insecure random bytes
function generateSessionId() {
  // Using Math.random instead of crypto.randomBytes
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
  hashPassword,
  hashToken,
  encryptData,
  generateSessionId
};
