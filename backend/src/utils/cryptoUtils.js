/**
 * @module utils/cryptoUtils
 * @description Centralized AES-256-CBC encryption routines. Handles dynamic buffering of the ENCRYPTION_KEY environment variables to securely process OAuth payloads before database insertion.
 */
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(16).toString('hex');
const VALID_KEY = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32); 
const IV_LENGTH = 16;

/**
 * Encrypts a plaintext string.
 * @param {string} text - The raw plaintext.
 * @returns {string} The iv and cipher text separated by a colon.
 */
function encryptText(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', VALID_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts a previously encrypted cipher string.
 * @param {string} text - The encrypted string containing the iv prefix.
 * @returns {string} The decrypted plaintext.
 */
function decryptText(text) {
    if (!text || !text.includes(':')) return text;
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', VALID_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
    encryptText,
    decryptText
};
