'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const campaignService = require("../services/campaignService")
const errors = require("../services/responseErrors")


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
                include: models.User,
                separate: true,
                order: [['createdAt', 'DESC']]
            },
            {
                model: models.Comment,
                include: models.User,
                separate: true,
                order: [['createdAt', 'DESC']]
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }

    const userID = res.locals.user.id
    const userReview = await models.Review.findOne({
        where: {
            userID,
            campaignID: id
        }
    })

    campaignService.averageRatingItem(campaign)
    res.render('report/details', { campaign, userReview })
}

controller.review = async (req, res) => {
    try {
        const { userID, campaignID, reviewMessage, reviewRating } = req.body

        const checkUser = await models.User.findOne({
            attributes: ["id"],
            where: { id: userID }
        })
        if (!checkUser) {
            throw new Error("Người dùng không tồn tại!")
        }

        const checkCampaign = await models.Campaign.findOne({
            attributes: ["id"],
            where: {
                id: campaignID,
                status: { [Op.ne]: "Planning" }
            }
        })
        if (!checkCampaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const checkReview = await models.Review.findOne({
            attributes: ["id"],
            where: {
                campaignID,
                userID
            }
        })
        if (checkReview) {
            throw new Error("Bạn đã đánh giá cho chiến dịch này!")
        }

        const review = await models.Review.create({
            message: reviewMessage,
            rating: reviewRating,
            campaignID,
            userID
        })
        const newReview = await models.Review.findOne({
            where: { id: review.id },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "name", "avatarPath"]
                },
                {
                    model: models.Campaign,
                    attributes: ["id", "name"]
                }
            ]
        })
        const CampaignCreatedReviewEvent = require("../websocket/events/campaignCreatedReviewEvent")
        await new CampaignCreatedReviewEvent({
            newReview: newReview.toJSON()
        }).dispatch()

        return res.json({ success: true, data: newReview.toJSON() })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.comment = async (req, res) => {
    try {
        const { userID, campaignID, commentContent } = req.body

        const checkUser = await models.User.findOne({
            attributes: ["id"],
            where: { id: userID }
        })
        if (!checkUser) {
            throw new Error("Người dùng không tồn tại!")
        }

        const checkCampaign = await models.Campaign.findOne({
            attributes: ["id"],
            where: {
                id: campaignID,
                status: { [Op.ne]: "Planning" }
            }
        })
        if (!checkCampaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const comment = await models.Comment.create({
            content: commentContent,
            campaignID,
            userID,
        })

        const newComment = await models.Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "name", "avatarPath"]
                },
                {
                    model: models.Campaign,
                    attributes: ["id", "name"]
                }
            ]
        })
        const CampaignCreatedCommentEvent = require("../websocket/events/campaignCreatedCommentEvent")
        await new CampaignCreatedCommentEvent({
            newComment: newComment.toJSON()
        }).dispatch()

        return res.json({ success: true, data: comment.toJSON() })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showStatement = async (req, res) => {
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
            },
            {
                model: models.Transaction,
                separate: true,
                as: "Contributions",
                limit: 10
            },
            {
                model: models.Transaction,
                separate: true,
                as: "Distributions",
                limit: 10
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }

    campaignService.calTotalParams(campaign)

    return res.render("report/statement", { campaign })
}

controller.download = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)
}
module.exports = controller