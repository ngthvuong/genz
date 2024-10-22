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


module.exports = campaignService