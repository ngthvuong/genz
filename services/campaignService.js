'use strict'

const campaign = require("../models/campaign")

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

campaignService.calTotalParams = (campaign) => {
    const contributionAmount = campaign.Contributions.length
    const distributionAmount = campaign.Distributions.length
    campaign.totalContribution = 0
    campaign.totalDistribution = 0

    if (contributionAmount) {
        campaign.Contributions.forEach(Contribution => {
            campaign.totalContribution += parseInt(Contribution.amount)
        })
    }
    if (distributionAmount) {
        campaign.Distributions.forEach(Distribution => {
            campaign.totalContribution += parseInt(Distribution.amount)
        })
    }
    campaign.totalRemaining = campaign.totalContribution - campaign.totalDistribution
}


module.exports = campaignService