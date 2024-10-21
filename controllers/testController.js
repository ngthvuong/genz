'use strict'

const payment = require("../services/payment")
const user = require("../services/user")
const models = require("../models")
const { password } = require("pg/lib/defaults")


const controller = {}

controller.transfer = async (req, res) => {

    const transaction = await payment.transfer('MASTERCARD', {
        appUser: '0909976102',
        amount: '111111',
        item: '[{"itemid":"1","itemname":"Chiến Dich 1"}]',
        description: "Genz - Vuong Đóng góp abc",
    })

    if (transaction.error) {
        return res.render('errorPage', {
            message: transaction.error
        })
    }
    return res.redirect(transaction.order_url)
}

controller.user = async (req, res) => {
    const charity = user({
        name: "hihi",
        role: "charity"
    })
    console.log(await charity.register())
    console.log(await charity.avgReview())
    console.log(await charity.role)

    models.User.create({
        phone: '0909976102',
        password: '12321123',
        status: 'active',
        role: 'charity'
    })
    return res.json("hihi")
}

controller.event = async (req, res) => {

    await models.User.update(
        {
            status: 'active'
        },
        { where: { id: 4 } })

    const UserApprovedEvent = require("../websocket/events/userApprovedEvent")
    await new UserApprovedEvent({
        user: { id: 4 }
    }).dispatch()

    return res.send("hihi this is event page")
}

controller.eventRollback = async (req, res) => {
    await models.User.update(
        {
            status: 'pending'
        },
        { where: { id: 4 } })
    return res.send("hihi this is event rollback page")

}
module.exports = controller