'use strict'
const errors = require("../services/responseErrors")
const campaignStore = require("../storage/campaignStore")
const models = require("../models")
const { Op } = require('sequelize')


const controller = {}

controller.share = (req, res, next) => {
    res.locals.searchUrl = "/campaign"
    next()
}

controller.showlist = async (req, res) => {
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
            campaignDescription, campaignStatus } = req.body

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
            status: campaignStatus,
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
            campaignDescription, campaignStatus } = req.body

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
                    [Op.ne]: "Finished"
                }
            }
        })
        if (!updatedCampaign) {
            throw new Error("Chiến dịch không tồn tại")
        }

        updatedCampaign.name = campaignName
        updatedCampaign.startDate = campaignStartDate
        updatedCampaign.endDate = campaignEndDate
        updatedCampaign.goal = campaignGoal
        updatedCampaign.budget = campaignBudget
        updatedCampaign.description = campaignDescription
        updatedCampaign.location = campaignLocation
        updatedCampaign.status = campaignStatus
        updatedCampaign.save()

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
            campaignImage.save()

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
                    [Op.eq]: "Planning"
                },
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

module.exports = controller