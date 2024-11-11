'use strict'

const zaloPay = require("../thirdParties/zaloPay")

const payment = {}

payment.transfer = async (appTransId, campaignID, methodCode, data) => {
    //1. store temporary transfer information
   

    //2. get merchant info
    const merchantInfo = {}
    merchantInfo.appid = '2554'
    merchantInfo.key1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn'
    merchantInfo.key2 = 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf'
    //3. create order
    zaloPay.setMerchantInfo(merchantInfo.appid, merchantInfo.key1, merchantInfo.key2)
    zaloPay.setMethod(methodCode)
    const transaction = await zaloPay.createOrder(appTransId, data)

    //4. check creating order successfully
    if (transaction.return_code && transaction.return_code != 1) {
        //5. delete temporary transfer information

        return { error: transaction.sub_return_message }
    }

    //6. storing transaction information

    //7. return order_url of zalo gateway
    return transaction
}

payment.callback = async (data) => {
    return zaloPay.checkCallbackData(data)
    // get and assign temporary transfer information

    if(zaloPay.checkCallbackData(data)){
        // if(success)
            //store data

        // delete temporary transfer information
        // return success or canceled 
    }

    //return error
}

module.exports = payment