'use strict'

const Mailjet = require('node-mailjet')
const jwt = require("../../jwt")

const mailOTP = {}

mailOTP.sendOTP = async (user) => {
    const pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE,
    );

    mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "ngthvuong@gmail.com",
                        Name: "GenZ"
                    },
                    To: [
                        {
                            Email: user.email
                        }
                    ],
                    Subject: "[Genz] Mã Xác Thực Tài Khoản",
                    HTMLPart: `
                    <p>Chào Bạn,</p>
                    <p>Mã xác thực của bạn là <b>${pin}</b>. có hiệu lực trong 3 phút.</p>
                    <br/>
                    <p>Trân Trọng,</p>
                    <p>GenZ Team</p>
                    `
                }
            ]
        })

    const token = jwt.sign({ email: user.email, pin })

    return {
        token
    }
}

mailOTP.verifyOTP = async (OTPInfo, pin) => {
    const jwtInfo = jwt.verify(OTPInfo.token)
    if(jwtInfo){
        const { data } = jwt.verify(OTPInfo.token)   
        return data.pin == pin
    }
    return false
}

module.exports = mailOTP