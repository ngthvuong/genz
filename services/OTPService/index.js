'use strict'

const OTPService = {}

OTPService.init = (channel) => {
    if (channel == 'phone') {
        return require("./OTPFactory/mobileOTP")
    }
}

module.exports = OTPService