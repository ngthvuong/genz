'use strict'

const AbstractJob = require('./abstractJob')
const models = require("../../models")
const TransactionCreatedContributionEvent = require("../../websocket/events/transactionCreatedContributionEvent")
const payment = require("../../services/payment")


class CheckPendingPaymentJob extends AbstractJob {
    name = "checkPendingPaymentJob"
    process = async (job) => {
        const transaction = await models.Transaction.findOne({
            where: {
                status: "Pending",
                id: job.data.id
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
        if (transaction) {
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
        }
    }
}
module.exports = new CheckPendingPaymentJob()