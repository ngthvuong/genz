'use strict'

const OTPService = {}

OTPService.init = (channel) => {
    if (channel == 'phone') {
        return require("./OTPFactory/mobileOTP")
    }
    if (channel == 'email') {
        return require("./OTPFactory/mailOTP")
    }
}

module.exports = OTPService