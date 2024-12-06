'use strict'
const errors = require("../services/responseErrors")
const campaignStore = require("../storage/campaignStore")
const models = require("../models")
const { Op } = require('sequelize')
const moment = require("moment")

const controller = {}

controller.share = (req, res, next) => {
    res.locals.searchUrl = "/campaign"
    next()
}

controller.showList = async (req, res) => {
    const charity = await models.Charity.findOne({
        where: {
            userID: res.locals.user.id
        }
    })
    if (!charity) {
        return res.redirect("/")
    }

    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const status = req.query.status ? req.query.status.trim() : ""
    const page = req.query.page ? parseInt(req.query.page.trim()) : 1
    const limit = 10
    const offset = (page - 1) * limit

    const query = new URLSearchParams(req.query)
    let path = req.path == "/" ? req.path : ""

    if (page < 1) {
        query.delete("page")
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)

    }

    const optionCount = {
        where: {
            charityID: charity.id,
            name: {
                [Op.iLike]: `%${keyword}%`
            },
        },
    }
    if (status) {
        optionCount.where.status = status
    }
    const totalRows = await models.Campaign.count(optionCount)

    const options = {
        ...optionCount,
        include: [
            {
                model: models.CampaignImage,
                as: "firstImage"
            }
        ],
        order: [['startDate', 'DESC']],
        limit,
        offset
    }
    const campaigns = await models.Campaign.findAll(options)

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

    return res.render('campaign/list', { campaigns, pagination, keyword, status })
}

controller.create = async (req, res) => {
    return res.render('campaign/create')
}
controller.createCampaign = async (req, res) => {
    try {
        // Lấy dữ liệu từ form
        const { campaignName, campaignLocation, campaignStartDate, campaignEndDate, campaignGoal, campaignBudget,
            campaignDescription } = req.body

        const today = moment().tz(process.env.TIME_ZONE).startOf("day")
        const startDate = moment(campaignStartDate, 'YYYY-MM-DD').tz(process.env.TIME_ZONE)
        const endDate = moment(campaignEndDate, 'YYYY-MM-DD').tz(process.env.TIME_ZONE)
        if (startDate.isBefore(today)) {
            throw new Error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại!")
        }
        if (!endDate.isAfter(startDate)) {
            throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
        }

        const charity = await models.Charity.findOne({
            where: {
                userID: res.locals.user.id
            }
        })
        if (!charity) {
            throw new Error("Bạn không phải là một người dùng tổ chức từ thiện")
        }

        const existedCampaign = await models.Campaign.findOne({
            where: {
                name: campaignName,
                charityID: charity.id
            }
        })
        if (existedCampaign) {
            throw new Error("Bạn đã tạo một chiến dịch cùng tên")
        }

        if (!req.file) {
            throw new Error("Vui lòng upload file")
        }

        // Thực hiện ghi dữ liệu vào cơ sở dữ liệu
        const newCampaign = await models.Campaign.create({
            name: campaignName,
            startDate: campaignStartDate,
            endDate: campaignEndDate,
            goal: campaignGoal,
            budget: campaignBudget,
            description: campaignDescription,
            location: campaignLocation,
            status: 'Planning',
            charityID: charity.id
        })
        const campaignImage = await campaignStore.saveFile(req)
        await models.CampaignImage.create({
            imagePath: campaignImage.path,
            campaignID: newCampaign.id
        })
        // Sau khi thành công, chuyển hướng đến trang báo thành công
        return res.json({
            redirectURL: '/campaign'
        })
    } catch (error) {
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showEdit = async (req, res) => {
    const charity = await models.Charity.findOne({
        where: {
            userID: res.locals.user.id
        }
    })
    if (!charity) {
        return res.redirect("/")
    }

    const id = req.params.id
    const campaign = await models.Campaign.findOne({
        where: {
            id: id,
            charityID: charity.id,
            status: {
                [Op.ne]: "Finished"
            }
        },
        include: [
            {
                model: models.CampaignImage,
                as: "firstImage"
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }
    return res.render('campaign/edit', { campaign })
}

controller.editCampaign = async (req, res) => {
    try {
        const { campaignName, campaignLocation, campaignStartDate, campaignEndDate, campaignGoal, campaignBudget,
            campaignDescription } = req.body

        const id = req.params.id

        const charity = await models.Charity.findOne({
            where: {
                userID: res.locals.user.id
            }
        })
        if (!charity) {
            throw new Error("Bạn không phải là một người dùng tổ chức từ thiện")
        }

        const existedCampaign = await models.Campaign.findOne({
            where: {
                name: campaignName,
                charityID: charity.id,
                id: {
                    [Op.ne]: id
                }
            }
        })
        if (existedCampaign) {
            throw new Error("Bạn đã tạo một chiến dịch cùng tên")
        }

        const updatedCampaign = await models.Campaign.findOne({
            where: {
                id,
                status: {
                    [Op.notIn]: ["Closed", "Finished"]
                },
                charityID: charity.id,
            }
        })
        if (!updatedCampaign) {
            throw new Error("Chiến dịch không tồn tại")
        }

        if (updatedCampaign.status == 'Planning') {
            const today = moment().tz(process.env.TIME_ZONE).startOf("day")
            const startDate = moment(campaignStartDate, 'YYYY-MM-DD').tz(process.env.TIME_ZONE)
            const endDate = moment(campaignEndDate, 'YYYY-MM-DD').tz(process.env.TIME_ZONE)
            if (startDate.isBefore(today)) {
                throw new Error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại!")
            }
            if (!endDate.isAfter(startDate)) {
                throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
            }
            updatedCampaign.name = campaignName
            updatedCampaign.startDate = campaignStartDate
            updatedCampaign.endDate = campaignEndDate
            updatedCampaign.goal = campaignGoal
            updatedCampaign.budget = campaignBudget
            updatedCampaign.description = campaignDescription
            updatedCampaign.location = campaignLocation
        }
        if (updatedCampaign.status == 'Running') {
            const today = moment().tz(process.env.TIME_ZONE).startOf("day")
            const endDate = moment(campaignEndDate, 'YYYY-MM-DD').tz(process.env.TIME_ZONE)
            if (!endDate.isAfter(today)) {
                throw new Error("Ngày kết thúc phải lớn hơn ngày hiện tại!")
            }
            updatedCampaign.name = campaignName
            updatedCampaign.endDate = campaignEndDate
            updatedCampaign.goal = campaignGoal
            updatedCampaign.budget = campaignBudget
            updatedCampaign.description = campaignDescription
            updatedCampaign.location = campaignLocation
        }

        await updatedCampaign.save()

        if (req.file) {
            const campaignImageFile = await campaignStore.saveFile(req)
            let campaignImage = await models.CampaignImage.findOne({
                where: {
                    campaignID: id
                }
            })
            if (!campaignImage) {
                campaignImage = new models.CampaignImage()
                campaignImage.campaignID = id

            }
            campaignImage.imagePath = campaignImageFile.path
            await campaignImage.save()

        }
        // Sau khi thành công, chuyển hướng đến trang báo thành công
        return res.json({
            redirectURL: '/campaign'
        })
    } catch (error) {
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.changeCampaignFinishedStatus = async (req, res) => {
    try {
        const id = req.params.id

        const charity = await models.Charity.findOne({
            where: {
                userID: res.locals.user.id
            }
        })
        if (!charity) {
            throw new Error("Bạn không phải là một người dùng tổ chức từ thiện")
        }

        const updatedCampaign = await models.Campaign.findOne({
            where: {
                id,
                status: "Closed",
                charityID: charity.id,
            }
        })
        if (!updatedCampaign) {
            throw new Error("Chiến dịch không tồn tại")
        }

        updatedCampaign.status = "Finished"

        await updatedCampaign.save()

        return res.json({
            redirectURL: '/campaign'
        })
    } catch (error) {
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.deleteCampaign = async (req, res) => {
    try {
        const id = req.params.id

        const charity = await models.Charity.findOne({
            where: {
                userID: res.locals.user.id
            }
        })
        if (!charity) {
            throw new Error("Bạn không phải là một người dùng tổ chức từ thiện!")
        }

        const updatedCampaign = await models.Campaign.findOne({
            where: {
                id,
                status: {
                    [Op.eq]: "Planning",
                },
                charityID: charity.id,
            },
            include: [
                {
                    model: models.CampaignImage,
                }
            ]
        })
        if (!updatedCampaign) {
            throw new Error("Chiến dịch không tồn tại!")
        }
        updatedCampaign.CampaignImages.forEach(image => {
            image.destroy()
        })
        updatedCampaign.destroy()

        // Sau khi thành công, chuyển hướng đến trang báo thành công
        return res.json({
            redirectURL: '/campaign'
        })
    } catch (error) {
        console.error(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showContributions = async (req, res) => {
    const userID = res.locals.user.id
    const campaignID = req.params.campaignID
    const campaign = await models.Campaign.findOne({
        where: {
            id: campaignID,
            status: {
                [Op.notIn]: ["Planning", "Finished"]
            }
        },
        include: [
            {
                model: models.Charity,
                require: true,
                where: {
                    userID
                }
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }

    return res.render("campaign/contribution/list", { campaign })
}

controller.showDistributions = async (req, res) => {
    const userID = res.locals.user.id
    const campaignID = req.params.campaignID
    const campaign = await models.Campaign.findOne({
        where: {
            id: campaignID,
            status: {
                [Op.notIn]: ["Planning", "Finished"]
            }
        },
        include: [
            {
                model: models.Charity,
                require: true,
                where: {
                    userID
                }
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }
    return res.render("campaign/distribution/list", { campaign })
}

controller.loadContributions = async (req, res) => {
    try {
        const campaignID = req.params.campaignID
        const { offset, limit } = req.body

        const checkCampaign = await models.Campaign.findOne({
            attributes: ["id"],
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
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
            order: [["madeAt", "DESC"]],
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
        const campaignID = req.params.campaignID
        const { offset, limit } = req.body

        const checkCampaign = await models.Campaign.findOne({
            attributes: ["id"],
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
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
            order: [["madeAt", "DESC"]],
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

controller.showCreateContribution = async (req, res) => {
    const userID = res.locals.user.id
    const campaignID = req.params.campaignID
    const campaign = await models.Campaign.findOne({
        where: {
            id: campaignID,
            status: {
                [Op.notIn]: ["Planning", "Finished"]
            }
        },
        include: [
            {
                model: models.Charity,
                require: true,
                where: {
                    userID
                }
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }
    return res.render("campaign/contribution/create", { campaign })
}
controller.showCreateDistribution = async (req, res) => {
    const userID = res.locals.user.id
    const campaignID = req.params.campaignID
    const campaign = await models.Campaign.findOne({
        where: {
            id: campaignID,
            status: {
                [Op.notIn]: ["Planning", "Finished"]
            }
        },
        include: [
            {
                model: models.Charity,
                require: true,
                where: {
                    userID
                }
            }
        ]
    })
    if (!campaign) {
        return res.redirect("/")
    }
    return res.render("campaign/distribution/create", { campaign })

}

controller.createContribution = async (req, res) => {
    try {
        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const { sender, amount, message } = req.body
        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }
        const paymentMethod = await models.PaymentMethod.findOne({
            where: {
                code: "CASH"
            }
        })
        const contribution = new models.Transaction()
        contribution.type = "Contribution"
        contribution.status = "Success"
        contribution.madeAt = new Date()
        contribution.receiver = res.locals.user.name

        contribution.sender = sender
        contribution.amount = amount
        contribution.message = message

        contribution.campaignID = campaignID
        contribution.paymentMethodID = paymentMethod.id
        await contribution.save()

        const TransactionCreatedContributionEvent = require("../websocket/events/transactionCreatedContributionEvent")
        await new TransactionCreatedContributionEvent({
            newContribution: contribution
        }).dispatch()

        return res.json({
            success: true,
            newContribution: contribution,
            redirectURL: `/campaign/${campaignID}/contributions`
        })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.createDistribution = async (req, res) => {
    try {

        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const { receiver, amount, message } = req.body
        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }
        const paymentMethod = await models.PaymentMethod.findOne({
            where: {
                code: "CASH"
            }
        })
        const distribution = new models.Transaction()
        distribution.type = "Distribution"
        distribution.status = "Success"
        distribution.madeAt = new Date()
        distribution.sender = res.locals.user.name

        distribution.receiver = receiver
        distribution.amount = amount
        distribution.message = message

        distribution.campaignID = campaignID
        distribution.paymentMethodID = paymentMethod.id
        await distribution.save()

        const TransactionCreatedDistributionEvent = require("../websocket/events/transactionCreatedDistributionEvent")
        await new TransactionCreatedDistributionEvent({
            newDistribution: distribution
        }).dispatch()

        return res.json({
            success: true,
            newDistribution: distribution,
            redirectURL: `/campaign/${campaignID}/distributions`
        })
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showEditContribution = async (req, res) => {
    const userID = res.locals.user.id

    const campaignID = req.params.campaignID
    const id = req.params.id

    const contribution = await models.Transaction.findOne({
        where: {
            id,
            type: "Contribution"
        },
        include: [
            {
                model: models.Campaign,
                require: true,
                where: {
                    id: campaignID,
                    status: {
                        [Op.notIn]: ["Planning", "Finished"]
                    }
                },
                include: [
                    {
                        model: models.Charity,
                        require: true,
                        where: {
                            userID
                        }
                    }
                ]
            }
        ]
    })
    if (!contribution) {
        return res.redirect("/")
    }
    return res.render("campaign/contribution/edit", { contribution })
}
controller.showEditDistribution = async (req, res) => {
    const userID = res.locals.user.id

    const campaignID = req.params.campaignID
    const id = req.params.id

    const distribution = await models.Transaction.findOne({
        where: {
            id,
            type: "Distribution"
        },
        include: [
            {
                model: models.Campaign,
                require: true,
                where: {
                    id: campaignID,
                    status: {
                        [Op.notIn]: ["Planning", "Finished"]
                    }
                },
                include: [
                    {
                        model: models.Charity,
                        where: {
                            userID
                        }
                    }
                ]
            }
        ]
    })
    if (!distribution) {
        return res.redirect("/")
    }

    return res.render("campaign/distribution/edit", { distribution })
}

controller.editContribution = async (req, res) => {
    try {
        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const id = req.params.id

        const { sender, amount, message } = req.body
        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const contribution = await models.Transaction.findOne({
            where: {
                id,
                type: "Contribution",
                donorID: null
            }
        })
        if (!contribution) {
            throw new Error("Khoản đóng góp không tồn tại!")
        }

        contribution.sender = sender
        contribution.amount = amount
        contribution.message = message
        await contribution.save()

        const TransactionModifiedContributionEvent = require("../websocket/events/transactionModifiedContributionEvent")
        await new TransactionModifiedContributionEvent({
            contribution: contribution
        }).dispatch()

        return res.json({
            success: true,
            contribution: contribution,
            redirectURL: `/campaign/${campaignID}/contributions`
        })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.editDistribution = async (req, res) => {
    try {
        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const id = req.params.id

        const { receiver, amount, message } = req.body

        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID,
                status: {
                    [Op.notIn]: ["Planning", "Finished"]
                }
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const distribution = await models.Transaction.findOne({
            where: {
                id,
                type: "Distribution",
                donorID: null
            }
        })
        if (!distribution) {
            throw new Error("Khoản cứu trợ không tồn tại!")
        }

        distribution.receiver = receiver
        distribution.amount = amount
        distribution.message = message
        await distribution.save()

        const TransactionModifiedDistributionEvent = require("../websocket/events/transactionModifiedDistributionEvent")
        await new TransactionModifiedDistributionEvent({
            distribution: distribution
        }).dispatch()

        return res.json({
            success: true,
            distribution: distribution,
            redirectURL: `/campaign/${campaignID}/distributions`
        })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.deleteContribution = async (req, res) => {
    try {
        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const id = req.params.id

        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const contribution = await models.Transaction.findOne({
            where: {
                id,
                type: "Contribution",
                donorID: null
            }
        })
        if (!contribution) {
            throw new Error("Khoản đóng góp không tồn tại!")
        }

        contribution.destroy()

        const TransactionDeletedContributionEvent = require("../websocket/events/transactionDeletedContributionEvent")
        await new TransactionDeletedContributionEvent({
            id: id
        }).dispatch()

        return res.json({
            success: true,
        })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.deleteDistribution = async (req, res) => {
    try {
        const userID = res.locals.user.id
        const campaignID = req.params.campaignID
        const id = req.params.id

        const campaign = await models.Campaign.findOne({
            where: {
                id: campaignID
            },
            include: [
                {
                    model: models.Charity,
                    require: true,
                    where: {
                        userID
                    }
                }
            ]
        })
        if (!campaign) {
            throw new Error("Chiến Dịch không tồn tại!")
        }

        const distribution = await models.Transaction.findOne({
            where: {
                id,
                type: "Distribution",
                donorID: null
            }
        })
        if (!distribution) {
            throw new Error("Khoản cứu trợ không tồn tại!")
        }
        distribution.destroy()

        const TransactionDeletedDistributionEvent = require("../websocket/events/transactionDeletedDistributionEvent")
        await new TransactionDeletedDistributionEvent({
            id: id
        }).dispatch()

        return res.json({
            success: true,
        })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

module.exports = controller