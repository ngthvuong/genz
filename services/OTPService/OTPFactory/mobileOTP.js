'use strict'

const Nexmo = require("../../../thirdParties/OTPSMS")

const mobileOTP = {}


mobileOTP.sendOTP = async (user) => {
    try {
        const result = await Nexmo.sendOTP(user.phone)
        return result
    }
    catch (error) {
        throw new Error("Có lỗi khi gởi OTP, vui lòng chọn phương thức khác!")
    }
}

mobileOTP.verifyOTP = async (OTPInfo, pin) => {
    return await Nexmo.verifyOTP(OTPInfo, pin)
}

module.exports = mobileOTP