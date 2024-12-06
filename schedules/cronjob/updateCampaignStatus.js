'use strict'

const { updateStatus } = require("../../services/campaignService")

const cronjob = {}

cronjob.handle = async () => {
    await updateStatus()
    console.log('Campaign update completed.' + new Date())
}

module.exports = {
    handle: cronjob.handle
}