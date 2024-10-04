'use strict'

const speedSMS = {}
speedSMS.sendOTP = async (phoneNumber) => {
    return true
}

speedSMS.verifyOTP = async (phoneNumber, pin) => {
    return pin == '123456'
}

module.exports = speedSMS