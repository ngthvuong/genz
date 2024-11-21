'use strict'

const controller = {}
const models = require('../models')
const { Op } = require('sequelize')
const campaignService = require('../services/campaignService')

controller.share = (req, res, next) => {
    res.locals.searchUrl = "/charity-verification"
    next()
}

controller.showUnapprovedCharityList = async (req, res) => {
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
            status: 'pending',
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
    const pendingUsers = await models.User.findAll(options)

    pendingUsers.forEach(user => {
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

    res.locals.users = pendingUsers
    res.locals.pagination = pagination

    res.render('charity/pending-charity-verification')
}

controller.showPendingCharityDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

    let pendingCharity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'pending',
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
    campaignService.averageCharityRating(pendingCharity)

    if (!pendingCharity) {
        return res.redirect("/")
    }

    res.locals.charity = pendingCharity
    res.render('charity/pending-charity-detail')
}

controller.updateApprovedCharityStatus = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

    let approvedCharity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'pending',
                role: 'charity'
            }
        }
        ]
    })

    if (approvedCharity) {
        approvedCharity.User.status = 'active'
        await approvedCharity.User.save()

        const UserApprovedEvent = require("../websocket/events/userApprovedEvent")
        await new UserApprovedEvent({
            user: approvedCharity.User
        }).dispatch()

        return res.status(200).send('Tổ chức từ thiện đã được phê duyệt.')
    } else {
        return res.status(404).send('Tổ chức từ thiện không tìm thấy hoặc đã được phê duyệt.')
    }
}

controller.updateRejectedCharityStatus = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)

    let rejectedCharity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'pending',
                role: 'charity'
            }
        }
        ]
    })

    if (rejectedCharity) {
        rejectedCharity.User.status = 'reject'
        await rejectedCharity.User.save()

        const userRejectedEvent = require("../websocket/events/userRejectedEvent")
        await new userRejectedEvent({
            user: rejectedCharity.User
        }).dispatch()

        return res.status(200).send('Tổ chức từ thiện bị từ chối do thông tin không hợp lệ.')
    } else {
        return res.status(404).send('Tổ chức từ thiện không tìm thấy hoặc đã bị từ chối.')
    }
}


module.exports = controller