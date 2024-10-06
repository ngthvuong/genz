'use strict'
const speedSMS = require('../../../repositories/speedSMS')

const commonUser = {}

commonUser.register = async () => {
    //throw error if user has id
    // let sendOTP = await speedSMS.sendOTP(this.phone)

     return "user register service"
}
commonUser.verify = async () => {

    // $checkOTP = await speedSMS.verifyOTP(this.phone, this.pin)

    return "user verify service"
}

commonUser.login = async () => {
    return "user login service"
}

module.exports = commonUser