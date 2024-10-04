'use strict'

const payment = require("../services/payment")

const controller = {}

controller.transfer = async (req, res) => {

    const transaction = await payment.transfer('ATM', {
        appUser: '0909976102',
        amount: '100000',
        item: '[{"itemid":"1","itemname":"đóng góp"}]',
        description: "Genz - Đóng góp",
    })

    if (transaction.error) {
        return res.render('errorPage', {
            message: transaction.error
        })
    }
    return res.redirect(transaction.order_url)
}

module.exports = controller