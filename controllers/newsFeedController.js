'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const newsFeedStorage = require("../storage/newsFeedStorage")
const errors = require("../services/responseErrors")


const controller = {}

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

        const duplicateTitle = await models.NewsFeed.findOne({ where: { title } })
        if (duplicateTitle) {
            throw new Error("Tên tiêu đề đã tồn tại!")
        }

        if (!req.file) {
            throw new Error("Vui lòng chọn ảnh minh họa!")
        }
        const newsFeedImage = await newsFeedStorage.saveFile(req)
        const imagePath = newsFeedImage.path


        const newsFeed = await models.NewsFeed.create({
            title,
            content,
            campaignID,
            imagePath,
            publishedAt: new Date(),
            authorID: userID
        })

        const newNewsFeed = await models.NewsFeed.findOne({
            where: {
                id: newsFeed.id
            },
            include: [
                {
                    model: models.NewsFeedComment,
                    separate: true,
                    order: [['createdAt', 'desc']],
                    include: {
                        model: models.User
                    }
                },
                {
                    model: models.NewsFeedFeeling,
                    include: {
                        model: models.User
                    }
                }
            ]
        })


        const NewsFeedCreatedEvent = require("../websocket/events/newsFeedCreateEvent")
        await new NewsFeedCreatedEvent({
            newNewsFeed: newNewsFeed.toJSON()
        }).dispatch()

        return res.json(newsFeed)
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
            include: [
                {
                    model: models.NewsFeedComment,
                    separate: true,
                    order: [['createdAt', 'desc']],
                    include: {
                        model: models.User
                    }
                },
                {
                    model: models.NewsFeedFeeling,
                    include: {
                        model: models.User
                    }
                }
            ],
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

controller.showDetails = async (req, res) => {
    const { id } = req.params
    const userID = req.session.user.id
    const type = 'like'

    const newsFeed = await models.NewsFeed.findOne({
        where: { id },
        include: [
            {
                model: models.Campaign,
                include: [
                    {
                        model: models.Charity,
                    }
                ]
            },
            {
                model: models.User,
                as: 'Author'
            },
            {
                model: models.NewsFeedComment,
                separate: true,
                order: [['createdAt', 'desc']],
                include: {
                    model: models.User
                }
            },
            {
                model: models.NewsFeedFeeling,
                include: {
                    model: models.User
                }
            }
        ]
    })

    if (!newsFeed) {
        return res.redirect("/")
    }

    const isLiked = await models.NewsFeedFeeling.findOne({
        where: {
            newsFeedID: newsFeed.id,
            userID,
            type
        }
    })

    return res.render("newsFeed/details", {
        newsFeed,
        isLiked
    })

}

controller.createComment = async (req, res) => {
    try {
        const { userID, newsFeedID, commentContent } = req.body
        const checkUser = await models.User.findOne({
            attributes: ["id"],
            where: { id: userID }
        })
        if (!checkUser) {
            throw new Error("Người dùng không tồn tại!")
        }

        const checkNewsFeed = await models.NewsFeed.findOne({
            attributes: ["id"],
            where: {
                id: newsFeedID
            }
        })
        if (!checkNewsFeed) {
            throw new Error("Bảng tin không tồn tại!")
        }

        const comment = await models.NewsFeedComment.create({
            content: commentContent,
            newsFeedID,
            userID,
        })

        const newComment = await models.NewsFeedComment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "name", "avatarPath"]
                },
                {
                    model: models.NewsFeed
                }
            ]
        })
        const NewsFeedCreatedCommentEvent = require("../websocket/events/newsFeedCreatedCommentEvent")
        await new NewsFeedCreatedCommentEvent({
            newComment: newComment.toJSON()
        }).dispatch()

        return res.json({ success: true, data: comment.toJSON() })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.touchFeeling = async (req, res) => {
    try {
        const { userID, newsFeedID } = req.body
        const type = 'like'
        const checkUser = await models.User.findOne({
            attributes: ["id"],
            where: { id: userID }
        })
        if (!checkUser) {
            throw new Error("Người dùng không tồn tại!")
        }

        const checkNewsFeed = await models.NewsFeed.findOne({
            attributes: ["id"],
            where: {
                id: newsFeedID
            }
        })
        if (!checkNewsFeed) {
            throw new Error("Bảng tin không tồn tại!")
        }

        const oldFeeling = await models.NewsFeedFeeling.findOne({
            where: {
                newsFeedID,
                userID,
                type
            }
        })

        if (oldFeeling) {
            console.log("hihi")
            await oldFeeling.destroy()
        } else {
            await models.NewsFeedFeeling.create({
                newsFeedID,
                userID,
                type
            })
        }

        const newFeeling = await models.NewsFeedFeeling.findOne({
            where: {
                newsFeedID,
                userID,
                type
            },
            include: [
                {
                    model: models.User,
                    attributes: ["id", "name", "avatarPath"]
                }
            ]
        })
        const newFeelingJson = newFeeling ? newFeeling.toJSON() : newFeeling
        const NewsFeedTouchFeelingEvent = require("../websocket/events/newsFeedTouchFeelingEvent")
        await new NewsFeedTouchFeelingEvent({
            newFeeling: newFeelingJson,
            newsFeedID: newsFeedID
        }).dispatch()

        return res.json({ success: true, data: newFeelingJson })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

module.exports = controller