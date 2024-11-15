'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const newsFeedStorage = require("../storage/newsFeedStorage")
const errors = require("../services/responseErrors")


const controller = {}

controller.show = async (req, res) => {


    const campaign = await models.Campaign.findOne({ where: { id: campaignID } })
    if (!campaign) {
        throw new Error("Chiến dịch không tồn tại!")
    }

    res.render('home')
}

controller.create = async (req, res) => {
    try {
        const { campaignID, content, title } = req.body
        const campaign = await models.Campaign.findOne({ where: { id: campaignID } })
        if (!campaign) {
            throw new Error("Chiến dịch không tồn tại!")
        }
        const userID = req.session.user.id
        const charity = await models.Charity.findOne({ where: { userID } })
        if (!charity) {
            throw new Error("Người dùng không phải là tổ chức từ thiện!")
        }

        const colapTitle = await models.NewsFeed.findOne({ where: { title } })
        if (colapTitle) {
            throw new Error("Tên tiêu đề đã tồn tại!")
        }

        if (!req.file) {
            throw new Error("Vui lòng chọn ảnh minh họa!")
        }
        const newsFeedImage = await newsFeedStorage.saveFile(req)
        const imagePath = newsFeedImage.path


        const NewsFeed = await models.NewsFeed.create({
            title,
            content,
            campaignID,
            imagePath,
            publishedAt: new Date()
        })

        const NewsFeedCreatedEvent = require("../websocket/events/newsFeedCreateEvent")
        await new NewsFeedCreatedEvent({
            newNewsFeed: NewsFeed.toJSON()
        }).dispatch()

        res.json(NewsFeed)
    } catch (error) {
        console.error(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.load = async (req, res) => {
    try {
        const offset = (req.body.offset) ? parseInt(req.body.offset) : 0
        const limit = (req.body.limit) ? parseInt(req.body.limit) : 6
        const newsFeeds = await models.NewsFeed.findAll({

            order: [['publishedAt', 'DESC']],
            limit,
            offset
        })
        return res.json({ success: true, newsFeeds })


    } catch (error) {
        console.error(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

module.exports = controller