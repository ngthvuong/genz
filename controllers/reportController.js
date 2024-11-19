'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const campaignService = require("../services/campaignService")
const errors = require("../services/responseErrors")


const controller = {}

controller.show = async (req, res) => {
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

    const maxPage = parseFloat(totalRows) ? Math.ceil(parseFloat(totalRows) / limit) : 1

    if (page > maxPage) {
        query.set("page", maxPage)
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)
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
                order: [["createdAt", "DESC"]],
                limit: 10
            },
            {
                model: models.Transaction,
                separate: true,
                as: "Distributions",
                order: [["createdAt", "DESC"]],
                limit: 10
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }

    await campaignService.calTotalParams(campaign)

    return res.render("report/statement", { campaign })
}
controller.loadContributions = async (req, res) => {
    try {
        const { offset, limit, campaignID } = req.body

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

        const contributions = await models.Transaction.findAll({
            where: {
                campaignID,
                type: "Contribution",
                status: "Success"
            },
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        })


        return res.json({ success: true, contributions })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.loadDistributions = async (req, res) => {
    try {
        const { offset, limit, campaignID } = req.body

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

        const distributions = await models.Transaction.findAll({
            where: {
                campaignID,
                type: "Distribution",
                status: "Success"
            },
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        })


        return res.json({ success: true, distributions })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.download = async (req, res) => {
    try {
        const { campaignID } = req.body

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

        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID
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
                    order: [["createdAt", "DESC"]],
                },
                {
                    model: models.Transaction,
                    separate: true,
                    as: "Distributions",
                    order: [["createdAt", "DESC"]],
                }
            ],
        })

        const ExcelJS = require('exceljs')
        const workbook = new ExcelJS.Workbook()
        const contributionSheet = workbook.addWorksheet("Đóng Góp")
        const distributionSheet = workbook.addWorksheet("Hỗ Trợ")
        const headerConfig = [
            {
                header: "ID",
                key: "id",
                width: 8,
                style: {
                    alignment: {
                        horizontal: 'center',
                        indent: 1
                    }
                }
            },
            {
                header: "Ngày",
                key: "madeAt",
                width: 20,
                style: {
                    alignment: {
                        horizontal: 'center',
                        indent: 1
                    }
                }
            },
            {
                header: "Người Gởi",
                key: "sender",
                width: 30,
                style: {
                    alignment: {
                        indent: 1
                    }
                }
            },
            {
                header: "Người Nhận",
                key: "receiver",
                width: 30,
                style: {
                    alignment: {
                        indent: 1
                    }
                }
            },
            {
                header: "Số Tiền",
                key: "amount",
                width: 30,
                style: {
                    numFmt: '"₫" #,##0',
                    alignment: {
                        horizontal: 'right',
                        indent: 1
                    }
                }
            },
            {
                header: "Mô Tả",
                key: "message",
                width: 100,
                style: {
                    alignment: {
                        wrapText: true,
                        indent: 1

                    }
                }
            },
        ]

        contributionSheet.columns = headerConfig
        distributionSheet.columns = headerConfig

        campaign.Contributions.forEach((contribution, index) => {

            contributionSheet.addRow({
                id: index + 1,
                madeAt: contribution.madeAt,
                sender: contribution.sender || "",
                receiver: contribution.receiver || "",
                amount: parseInt(contribution.amount),
                message: contribution.message || "",
            })
        })
        campaign.Distributions.forEach((distribution, index) => {

            distributionSheet.addRow({
                id: index + 1,
                madeAt: distribution.madeAt,
                sender: distribution.sender || "",
                receiver: distribution.receiver || "",
                amount: parseInt(distribution.amount),
                message: distribution.message || "",
            })
        })

        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        await workbook.xlsx.write(res)
        res.end()

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
module.exports = controller