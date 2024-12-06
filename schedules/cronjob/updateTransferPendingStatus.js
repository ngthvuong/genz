'use strict'

const { checkPendingStatus } = require("../../services/payment")

const cronjob = {}

cronjob.handle = async () => {
    await checkPendingStatus()
    console.log('Orders update completed.' + new Date())
}

module.exports = {
    handle: cronjob.handle
}