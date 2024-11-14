'use strict'

const Nexmo = require("../../../thirdParties/OTPSMS")

const mobileOTP = {}


mobileOTP.sendOTP = async (user) => {
    return await Nexmo.sendOTP(user.phone)
}

mobileOTP.verifyOTP = async (OTPInfo, pin) => {
    return await Nexmo.verifyOTP(OTPInfo, pin)
}

module.exports = mobileOTP