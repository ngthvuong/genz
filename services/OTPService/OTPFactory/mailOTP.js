'use strict'

const Nexmo = require("../../../thirdParties/OTPSMS")

const mailOTP = {}

mailOTP.sendOTP = async (phoneNumber) => {
    return Nexmo.sendOTP(phoneNumber)
}

mailOTP.verifyOTP = async (OTPInfo, pin) => {
    return Nexmo.sendOTP(OTPInfo, pin)
}

module.exports = mailOTP