'use strict'
const axios = require('axios')

const OTPSMS = {}

const endpoint = process.env.NEXMO_VERIFY_URL
const apiKey = process.env.NEXMO_API_KEY
const apiSecret = process.env.NEXMO_API_SECRET
const basicApiKey = btoa(`${apiKey}:${apiSecret}`)
OTPSMS.sendOTP = async (phoneNumber) => {
    const fields = {
        "brand": "Genz",
        "workflow": [
            {
                "channel": "sms",
                "to": phoneNumber
            }
        ]
    }
    const response = await axios.post(endpoint, fields, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicApiKey}`
        }
    })
    console.log(response.data)

    return response.data

}

OTPSMS.verifyOTP = async (OTPInfo, pin) => {
    try{
        const fields = {
            "code": pin
        }
        const response = await axios.post(`${endpoint}/${OTPInfo.request_id}`, fields, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${basicApiKey}`
            }
        })
        return response.data.status == "completed"

    } catch(error){
        return false
    }
}

module.exports = OTPSMS