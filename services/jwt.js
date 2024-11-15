'use strict'

const jwt = require('jsonwebtoken')
const JWT_SECRET = "asd!@lkj!#"

function sign(data, expiresIn = "3m") {
    return jwt.sign(
        { data },
        process.env.JWT_SECRET || JWT_SECRET,
        { expiresIn }
    )
}

function verify(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET)
    } catch (error) {
        return false
    }
}

module.exports = { sign, verify }