'use strict'

const Nexmo = require("../../../thirdParties/OTPSMS")

const mobileOTP = {}


mobileOTP.sendOTP = async (destinations) => {
    return await Nexmo.sendOTP(destinations.phone)
}

mobileOTP.verifyOTP = async (OTPInfo, pin) => {
    return await Nexmo.verifyOTP(OTPInfo, pin)
}

module.exports = mobileOTP