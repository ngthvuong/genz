'use strict'

const zaloPay = require("../thirdParties/zaloPay")
const models = require("../models")
const TransactionCreatedContributionEvent = require("../websocket/events/transactionCreatedContributionEvent")


const payment = {}

payment.transfer = async (appTransId, charity, methodCode, data) => {

    zaloPay.setMerchantInfo(charity.merchantAppID, charity.merchantKey1, charity.merchantKey2)
    zaloPay.setMethod(methodCode)
    const transaction = await zaloPay.createOrder(appTransId, data)

    if (transaction.return_code && transaction.return_code != 1) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

payment.callback = async (charity, data) => {
    zaloPay.setMerchantInfo(charity.merchantAppID, charity.merchantKey1, charity.merchantKey2)
    return zaloPay.checkCallbackData(data)
}

payment.getOrder = async (charity, appTransId) => {
    zaloPay.setMerchantInfo(charity.merchantAppID, charity.merchantKey1, charity.merchantKey2)
    const transaction = await zaloPay.getOrder(appTransId)

    if (!transaction.return_code) {
        return { error: transaction.sub_return_message }
    }

    return transaction
}

payment.checkPendingStatus = async () => {
    const pendingTransactions = await models.Transaction.findAll({
        where: {
            status: "Pending"
        },
        include: [
            {
                model: models.Campaign,
                attributes: ['id'],
                include: [
                    {
                        model: models.Charity,
                        attributes: ['id', 'merchantAppID', 'merchantKey1', 'merchantKey2'], 
                        include: [
                            {
                                model: models.User,
                            }
                        ]
                    }
                ]
            }
        ]
    })
    pendingTransactions.forEach(async (transaction) => {
        const order = await payment.getOrder(transaction.Campaign.Charity, transaction.apptransid)
        if (order.return_code == 1) {
            transaction.status = 'Success'
            transaction.madeAt = new Date()
            transaction.amount = order.amount
            await transaction.save()
            await new TransactionCreatedContributionEvent({
                newContribution: transaction
            }).dispatch()
        }
        else if (order.return_code == 2) {
            transaction.status = 'Failed'
            await transaction.save()
        }
    })
}
module.exports = payment