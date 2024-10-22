'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const campaignService = require("../services/campaignService")


const controller = {}

controller.show = async (req, res) => {
    res.render('home')
}

controller.search = async (req, res) => {
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
        include : [
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

    res.render('search', { campaigns, keyword, pagination })
}
controller.errorPage = async (req, res) => {
    res.render('errorPage', {
        title: req.query.title,
        message: req.query.message
    })
}

module.exports = controller