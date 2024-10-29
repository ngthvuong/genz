'use strict'

const payment = require("../services/payment")
const models = require("../models")
const { password } = require("pg/lib/defaults")


const controller = {}

controller.transfer = async (req, res) => {

    const transaction = await payment.transfer(1, 'MASTERCARD', {
        appUser: '0909976102',
        amount: '111111',
        item: '[{"itemid":"1","itemname":"Chiến Dich 1"}]',
        description: "Genz -  Đóng góp abc",
    })

    if (transaction.error) {
        return res.render('errorPage', {
            message: transaction.error
        })
    }
    return res.redirect(transaction.order_url)
}

controller.event = async (req, res) => {

    await models.User.update(
        {
            status: 'active'
        },
        { where: { id: 3 } })

    const UserApprovedEvent = require("../websocket/events/userApprovedEvent")
    await new UserApprovedEvent({
        user: { id: 3 }
    }).dispatch()

    return res.send("hihi this is event page")
}

controller.eventReject = async (req, res) => {

    await models.User.update(
        {
            status: 'reject'
        },
        { where: { id: 3 } })

    const userRejectedEvent = require("../websocket/events/userRejectedEvent")
    await new userRejectedEvent({
        user: { id: 3 }
    }).dispatch()

    return res.send("hihi this is event page")
}

controller.eventRollback = async (req, res) => {
    await models.User.update(
        {
            status: 'pending'
        },
        { where: { id: 12 } })
    return res.send("hihi this is event rollback page")

}
controller.heatmap = async (req, res) => {
    res.render("test/heatmap")
}

module.exports = controller