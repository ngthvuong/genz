'use strict'

const Nexmo = require("../../../thirdParties/OTPSMS")

const mobileOTP = {}
const { fullPhoneWithoutPrefix } = require('../../../services/authService')


mobileOTP.sendOTP = async (user) => {
    try {
        const result = await Nexmo.sendOTP(fullPhoneWithoutPrefix(user.phone))
        return result
    }
    catch (error) {
        console.log(error)
        throw new Error("Có lỗi khi gởi OTP, vui lòng chọn phương thức khác!")
    }
}

mobileOTP.verifyOTP = async (OTPInfo, pin) => {
    return await Nexmo.verifyOTP(OTPInfo, pin)
}

module.exports = mobileOTP