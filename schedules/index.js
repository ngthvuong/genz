'use strict'

const nodeSchedule = require("node-schedule")

const schedule = {}

const updateTransferPendingStatus = require("./cronjob/updateTransferPendingStatus")
const updateCampaignStatus = require("./cronjob/updateCampaignStatus")


const commands = {
    'updateTransferPendingStatus': updateTransferPendingStatus.handle,
    'updateCampaignStatus': updateCampaignStatus.handle
}

schedule.dispatch = () => {
    nodeSchedule.scheduleJob('*/1 * * * *', async () => {
        console.log('Running order update schedule...' + new Date())
        await commands.updateTransferPendingStatus()
    });
    nodeSchedule.scheduleJob('*/1 * * * *', async () => {
        console.log('Running campaign update schedule...' + new Date())
        await commands.updateCampaignStatus()
    });
}

module.exports = {
    dispatch: schedule.dispatch
}