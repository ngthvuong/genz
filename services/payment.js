'use strict'

const zaloPay = require("../thirdParties/zaloPay")

const payment = {}

payment.transfer = async (appTransId, charity, methodCode, data) => {

    zaloPay.setMerchantInfo(charity.appid, charity.key1, charity.key2)
    zaloPay.setMethod(methodCode)
    const transaction = await zaloPay.createOrder(appTransId, data)

    if (transaction.return_code && transaction.return_code != 1) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

payment.callback = async (charity, data) => {
    zaloPay.setMerchantInfo(charity.appid, charity.key1, charity.key2)
    return zaloPay.checkCallbackData(data)
}

payment.getOrder = async (charity, appTransId) => {
    zaloPay.setMerchantInfo(charity.appid, charity.key1, charity.key2)    
    const transaction = await zaloPay.getOrder(appTransId)

    if (!transaction.return_code) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

module.exports = payment