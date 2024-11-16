'use strict'

const models = require("../models")
const campaignService = {}

campaignService.averageCharityRating = (charity) => {
    charity.averageCharityRating = 0;

    const numberCampaigns = charity.Campaigns.length;
    if (numberCampaigns) {
        let sumCharityRating = 0;

        charity.Campaigns.forEach(campaign => {
               campaignService.averageRatingItem (campaign)
               sumCharityRating += campaign.averageRating
        });
        charity.averageCharityRating = sumCharityRating/numberCampaigns
    }
    if (charity.averageCharityRating === null || isNaN(charity.averageCharityRating)) {
        charity.averageCharityRating = 0;
    }
}


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