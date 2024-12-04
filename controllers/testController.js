'use strict'

const payment = require("../services/payment")
const OTPService = require("../services/OTPService")

const models = require("../models")


const controller = {}

controller.transfer = async (req, res) => {
    const charity = await models.Charity.findOne();
    const transaction = await payment.transfer("1111" + Date.now(), charity, 'MASTERCARD', {
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

controller.callback = async (req, res) => {
    const charity = await models.Charity.findOne();
    console.log(charity)
    const transaction = await payment.callback(charity, req.query)
    console.log(transaction)


    if (transaction) {
        return res.send("hihi")
    }
    return res.send("hhuhu")
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
    const heatMap = await models.HeatMap.findOne({
        where: {
            status: 'enable'
        },
        include: [
            {
                model: models.HeatMapProvince,
                include: [
                    {
                        model: models.Province,
                    }
                ]
            }
        ],
        order: [['createdAt', 'desc']]
    })

    const heatMapService = require("../services/heatMapService")
    const heatMapData = heatMapService.buildData(heatMap)

    res.render("test/heatmap", { 
        heatMapData : JSON.stringify(heatMapData)
    })
}

controller.permission = async (req, res) => {
    res.render("test/permission")
}

controller.sendMailOtp = async (req, res) => {
    const OTPNotify = OTPService.init("email")
    const result = await OTPNotify.sendOTP({ email: "ngthvuong@gmail.com" })
    req.session.test = result
    res.send("hihi")
}
controller.verifyotp = async (req, res) => {
    const { pin } = req.params
    console.log(pin)

    const OTPNotify = OTPService.init("email")

    const result = await OTPNotify.verifyOTP(req.session.test, pin)
    console.log(result)
    res.send("hihi 2")
}

module.exports = controller