'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const campaignService = require("../services/campaignService")


const controller = {}

controller.show = async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";
    const page = req.query.page ? parseInt(req.query.page.trim()) : 1;
    const limit = 12
    const offset = (page - 1) * limit

    const query = new URLSearchParams(req.query)
    if (page < 1) {
        query.delete("page")
        return res.redirect(`${req.path}?${query.toString()}`)

    }

    const optionCount = {
        where: {
            name: {
                [Op.iLike]: `%${keyword}%`
            },
            status: {
                [Op.ne]: 'Planning'
            }
        }
    }
    const totalRows = await models.Campaign.count(optionCount)

    const options = {
        ...optionCount,
        include: [
            {
                model: models.CampaignImage,
                as: 'firstImage'
            },
            {
                model: models.Review
            },
        ],
        limit,
        offset
    }

    const campaigns = await models.Campaign.findAll(options)

    campaignService.averageRatingItems(campaigns)

    const pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query
    }

    const maxPage = Math.ceil(parseFloat(totalRows) / limit);
    if (page > maxPage) {
        query.set("page", maxPage)
        return res.redirect(`${req.path}?${query.toString()}`)
    }

    res.render('report/list', { campaigns, keyword, pagination })
}

controller.showDetails = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)
    const campaign = await models.Campaign.findOne({
        where: {
            id,
            status: { [Op.ne]: "Planning" }
        },
        include: [
            {
                model: models.Charity,
                attributes: ["id"],
                include: [
                    { model: models.User }
                ]
            }, {
                model: models.Review,
                include: models.User
            },
            {
                model: models.Comment,
                include: models.User
            }
        ]


    })
    if (!campaign) {
        return res.redirect("/")
    }

    campaignService.averageRatingItem(campaign)

    res.render('report/details', { campaign })
}

controller.review = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

}

controller.comment = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)
}

controller.showStatement = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

}

controller.download = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)
}
module.exports = controller