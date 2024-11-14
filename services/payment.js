'use strict'

const zaloPay = require("../thirdParties/zaloPay")

const payment = {}

payment.transfer = async (appTransId, merchant, methodCode, data) => {

    zaloPay.setMerchantInfo(merchant.appid, merchant.key1, merchant.key2)
    zaloPay.setMethod(methodCode)
    const transaction = await zaloPay.createOrder(appTransId, data)

    if (transaction.return_code && transaction.return_code != 1) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

payment.callback = async (merchant, data) => {
    zaloPay.setMerchantInfo(merchant.appid, merchant.key1, merchant.key2)
    return zaloPay.checkCallbackData(data)
}

payment.getOrder = async (merchant, appTransId) => {
    zaloPay.setMerchantInfo(merchant.appid, merchant.key1, merchant.key2)    
    const transaction = await zaloPay.getOrder(appTransId)

    if (!transaction.return_code) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

module.exports = payment