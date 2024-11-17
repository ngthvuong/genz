'use strict'

const controller ={};
const { Op, where } = require('sequelize')
const models = require('../models');
const campaignService = require('../services/campaignService')


controller.showCharityList = async (req,res) => {
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
            role: 'charity',
            status: 'active'
        }
    }
    const totalRows = await models.User.count(optionCount)

    const options = {
        ...optionCount,
        include: [
            {
                model: models.Charity, 
                seperate: true,
                include: [
                    {
                        model: models.Campaign,
                        seperate: true,
                        include: [
                            {
                                model: models.Review,
                                seperate: true
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
    });

    const pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query
    }

    const maxPage = parseFloat(totalRows) ? Math.ceil(parseFloat(totalRows) / limit) : 1;
    if (page > maxPage) {
        query.set("page", maxPage)
        return res.redirect(`${req.path}?${query.toString()}`)
    }
    
    res.locals.users = activeUsers;
    res.locals.pagination = pagination;

    res.render('charity/charity-list');
}

controller.showCharityDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

    let charity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'active',
                role: 'charity'
            }
        },{
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

    res.locals.charity = charity;
    res.render('charity/charity-detail')

}
module.exports =controller;