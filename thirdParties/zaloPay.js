'use strict'

const axios = require('axios')
const crypto = require('crypto')

const hmac_algorithm = 'sha256'

const zaloPay = {}

zaloPay.method = ["zalopay_wallet"]
zaloPay.merchantInfo = {}

zaloPay.setMethod = (method) => {
    switch (method) {
        case 'ATM':
            zaloPay.method = ["domestic_card", "account"]
            break
        case 'MASTERCARD':
            zaloPay.method = ["international_card"]
            break
        case 'ZALOAPP':
            zaloPay.method = ["zalopay_wallet"]
            break
    }
}
zaloPay.setMerchantInfo = (appid, key1, key2) => {
    zaloPay.merchantInfo.appid = appid
    zaloPay.merchantInfo.key1 = key1
    zaloPay.merchantInfo.key2 = key2
}

zaloPay.createOrder = async (appTransId, data) => {
    if (Object.keys(zaloPay.merchantInfo).length === 0) {
        throw new Error("Merchant information is missing for ZaloPay.");
    }
    const endpoint = process.env.ZALO_CREATE_ORDER_URL

    const defaultEmbedData = {
        redirecturl: process.env.ZALO_CALLBACK_URL
    };
    if (zaloPay.method) {
        defaultEmbedData.preferred_payment_method = zaloPay.method
    }

    const parsedEmbedData = data.embed_data ? data.embed_data : {};
    const mergedEmbedData = { ...defaultEmbedData, ...parsedEmbedData };
    const embedData = JSON.stringify(mergedEmbedData);

    const fields = new URLSearchParams({
        app_id: zaloPay.merchantInfo.appid,
        app_trans_id: appTransId,
        app_user: data.appUser,
        amount: data.amount,
        app_time: Date.now(),
        embed_data: embedData,
        item: data.item,
        description: data.description,
        bankcode: ""
    })

    const hmac_input = ''
        + fields.get('app_id')
        + '|' + fields.get('app_trans_id')
        + '|' + fields.get('app_user')
        + '|' + fields.get('amount')
        + '|' + fields.get('app_time')
        + '|' + fields.get('embed_data')
        + '|' + fields.get('item')

    fields.set('mac', crypto.createHmac(hmac_algorithm, zaloPay.merchantInfo.key1).update(hmac_input).digest('hex'))
    console.log(fields)
    try {
        const response = await axios.post(endpoint, fields.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data
    } catch (error) {
        return { error: error }
    }
}
zaloPay.checkCallbackData = async (data) => {
    return true
}

zaloPay.getOrder = async (appTransId) => {
    return true
}

module.exports = {
    setMethod: zaloPay.setMethod,
    setMerchantInfo: zaloPay.setMerchantInfo,
    createOrder: zaloPay.createOrder,
    getOrder: zaloPay.getOrder,
    checkCallbackData: zaloPay.checkCallbackData,
}