'use strict'

const OTPSMS = {}
OTPSMS.sendOTP = async (phoneNumber) => {
    return true
}

OTPSMS.verifyOTP = async (phoneNumber, pin) => {
    return pin == '123456'
}

module.exports = OTPSMS