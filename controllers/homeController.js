'use strict'

const models = require("../models")
const { Op } = require('sequelize')
const campaignService = require("../services/campaignService")


const controller = {}

controller.show = async (req, res) => {
    const userID = req.session.user.id
    const charity = await models.Charity.findOne({
        where: {
            userID
        },
        include: [
            {
                model: models.Campaign,
                attributes:["id", "name"]
            }
        ]
    })

    res.render('home', {charity})
}

controller.errorPage = async (req, res) => {
    res.render('errorPage', {
        title: req.query.title,
        message: req.query.message
    })
}

module.exports = controller