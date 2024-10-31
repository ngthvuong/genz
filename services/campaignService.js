'use strict'

const models = require("../models")

const campaignService = {}


campaignService.averageRatingItems = (campaigns) => {
    campaigns.forEach(campaign => {
        campaignService.averageRatingItem(campaign)
    })
}


campaignService.averageRatingItem = (campaign) => {
    campaign.averageRating = 0
    const numberRating = campaign.Reviews.length
    if (numberRating) {
        let sumRating = 0

        campaign.Reviews.forEach(review => {
            sumRating += parseFloat(review.rating) || 0
        })

        campaign.averageRating = sumRating / numberRating;
    }
}

campaignService.calTotalParams = async (campaign) => {
    campaign.totalContribution = await models.Transaction.sum('amount', {
        where: {
            campaignID: campaign.id,
            type: "Contribution"
        }
    })
    campaign.totalDistribution = await models.Transaction.sum('amount', {
        where: {
            campaignID: campaign.id,
            type: "Distribution"
        }
    })
    campaign.totalRemaining = campaign.totalContribution - campaign.totalDistribution
}


module.exports = campaignService