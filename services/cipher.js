const crypto = require('crypto')
const algorithm = 'aes-256-gcm'
const key = process.env.ENCRYPTION_KEY || "478acae15b8972420798e31d010d11b6"

const cipher = {}

cipher.encrypt = (text) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
}

cipher.decrypt = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(':')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

module.exports = cipher