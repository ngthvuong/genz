'use strict'

const controller ={};
const models = require('../models');
const campaignService = require('../services/campaignService');

controller.showUnapprovedCharityList = async (req,res) => {
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
            status: 'pending'
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
    const pendingUsers = await models.User.findAll(options)

    pendingUsers.forEach(user => {
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

    res.locals.users = pendingUsers;
    res.locals.pagination = pagination;

    res.render('charity/pending-charity-verification');
}

controller.showPendingCharityDetails = async (req, res) =>{
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

    let pendingCharity = await models.Charity.findOne({
        include: [{
            model: models.User,
            where: {
                id,
                status: 'pending',
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
    campaignService.averageCharityRating(pendingCharity)

    if (!pendingCharity) {
        return res.redirect("/")
    }

    res.locals.charity=pendingCharity;
    res.render('charity/pending-charity-detail')
}

controller.updateCharityStatus=async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

    try {
        let user = await models.User.findOne(id);
        if (!user) {
            return res.status(404).send('Người dùng không tìm thấy.');
        }

        user.status = 'active';
        await user.save();

        res.status(200).send('Tổ chức từ thiện đã được chấp nhận.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra.');
    }
};

controller.updateCharityStatus = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

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
    
    if(approvedCharity)
    {
        approvedCharity.User.status ='active';
        approvedCharity.User.save();
        
        const UserApprovedEvent = require("../websocket/events/userApprovedEvent")
        await new UserApprovedEvent({
            user: approvedCharity.User
        }).dispatch()

        return res.status(200).send('Tổ chức từ thiện đã được chấp nhận.');
    } else {
        return res.status(404).send('Tổ chức từ thiện không tìm thấy hoặc đã được phê duyệt.');
    }
};


module.exports =controller;