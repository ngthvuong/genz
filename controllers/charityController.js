'use strict'

const controller = {}
const { Op } = require('sequelize')
const models = require('../models')
const campaignService = require('../services/campaignService')

controller.share = (req, res, next) => {
    res.locals.searchUrl = "/charity"
    next()
}

controller.showCharityList = async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const page = req.query.page ? parseInt(req.query.page.trim()) : 1
    const limit = 12
    const offset = (page - 1) * limit

    const query = new URLSearchParams(req.query)
    let path = req.path == "/" ? req.path : ""

    if (page < 1) {
        query.delete("page")
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)

    }

    const optionCount = {
        where: {
            role: 'charity',
            status: 'active',
            name: {
                [Op.iLike]: `%${keyword}%`
            },
        }
    }
    const totalRows = await models.User.count(optionCount)

    const options = {
        ...optionCount,
        include: [
            {
                model: models.Charity,
                include: [
                    {
                        model: models.Campaign,
                        separate: true,
                        include: [
                            {
                                model: models.Review,
                                separate: true
                            }
                        ]
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
    }
    const activeUsers = await models.User.findAll(options)


    activeUsers.forEach(user => {
        campaignService.averageCharityRating(user.Charity)
    })

    const pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query
    }

    const maxPage = parseFloat(totalRows) ? Math.ceil(parseFloat(totalRows) / limit) : 1

    if (page > maxPage) {
        query.set("page", maxPage)
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)
    }

    res.locals.users = activeUsers
    res.locals.pagination = pagination

    res.render('charity/charity-list')
}

controller.showCharityDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

    let charity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'active',
                role: 'charity'
            }
        }, {
            model: models.License,
        },
        {
            model: models.Campaign,
            include: [
                {
                    model: models.Review,
                }
            ]
        }
        ]
    })

    campaignService.averageCharityRating(charity)

    res.locals.charity = charity
    res.render('charity/charity-detail')

}
module.exports = controller