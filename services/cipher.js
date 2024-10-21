const crypto = require('crypto')
const algorithm = 'aes-256-gcm'
const key = process.env.ENCRYPTION_KEY || "478acae15b8972420798e31d010d11b6"

const cipher = {}

cipher.encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`
}

cipher.decrypt = (encryptedText) => {
    const [iv, encrypted, authTag] = encryptedText.split(':')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'))
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted;
    try {
        decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (error) {
        console.error("Decryption failed:", error.message);
        throw new Error("Decryption failed due to invalid data or authentication tag");
    }
    return decrypted
}

module.exports = cipher