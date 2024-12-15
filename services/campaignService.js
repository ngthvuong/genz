'use strict'

const models = require("../models")
const { Op } = require("sequelize")
const moment = require("moment")
const campaignService = {}

campaignService.averageCharityRating = (charity) => {
    charity.averageCharityRating = 0;

    const numberCampaigns = charity.Campaigns.length;
    if (numberCampaigns) {
        let sumCharityRating = 0;

        charity.Campaigns.forEach(campaign => {
            campaignService.averageRatingItem(campaign)
            sumCharityRating += campaign.averageRating
        });
        charity.averageCharityRating = sumCharityRating / numberCampaigns
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
    const totalContribution = await models.Transaction.sum('amount', {
        where: {
            campaignID: campaign.id,
            type: "Contribution",
            status: "Success"
        }
    })
    campaign.totalContribution = totalContribution ? totalContribution : 0

    const totalDistribution = await models.Transaction.sum('amount', {
        where: {
            campaignID: campaign.id,
            type: "Distribution",
            status: "Success"
        }
    })
    campaign.totalDistribution = totalDistribution ? totalDistribution : 0
    campaign.totalRemaining = campaign.totalContribution - campaign.totalDistribution
}

campaignService.updateStatus = async () => {
    const today = moment().startOf('day').tz(process.env.TIME_ZONE).toISOString()
    await models.Campaign.update(
        {
            status: "Running"
        }
        ,
        {
            where: {
                status: "Planning",
                startDate: {
                    [Op.lte]: today
                }
            }
        }
    )

    await models.Campaign.update(
        {
            status: "Closed"
        }
        ,
        {
            where: {
                status: "Running",
                endDate: {
                    [Op.lt]: today
                }
            }
        }
    )
}

module.exports = campaignService