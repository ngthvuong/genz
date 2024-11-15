'use strict'
const errors = require("../services/responseErrors")
const campaignStore = require("../storage/campaignStore")
const models = require("../models")

const controller = {}

controller.showlist = async (req, res) => {
    const charity = await models.Charity.findOne({
        where: {
            userID: res.locals.user.id
        }
    })
    if(!charity){
        return res.redirect("/")
    }
    
    const campaigns = await models.Campaign.findAll({
        where: {
            charityID: charity.id
        },
        include:[
            {
                model: models.Transaction,
                as: "Contributions"
            }
        ]
    })

    return res.render('campaign/list', {campaigns})
}

controller.create = async (req, res) => {
    return res.render('campaign/create')
}
controller.createSuccess = async (req, res) => {
    return res.render('campaign/createsucces')
}

controller.showEdit = async (req, res) => {
    const id = req.params.id
    const campaign = await models.Campaign.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: models.CampaignImage,
                as: "firstImage"
            }
        ]
    })
    console.log(campaign)
    console.log(campaign.firstImage)

    return res.render('campaign/edit', {campaign})
}
controller.createCampaign = async (req, res) => {
    try {
       
        if (!req.file) {
            throw new Error("Vui lòng upload file")
        }
        // Lấy dữ liệu từ form
        const {campaignName, campaignLocation,  campaignStartDate, campaignEndDate, campaignGoal, campaignBudget, 
            campaignDescription,campaignStatus} = req.body;
        

        // Thực hiện ghi dữ liệu vào cơ sở dữ liệu
        const newCampaign = await models.Campaign.create({
            name: campaignName,
            startDate: campaignStartDate,
            endDate: campaignEndDate,
            goal: campaignGoal,
            budget: campaignBudget,
            description: campaignDescription,
            location: campaignLocation,
            status: campaignStatus
        });
        const campaignImage = await campaignStore.saveFile(req)
        await models.CampaignImage.create({
            imagePath: campaignImage.path,
            campaignID: newCampaign.id
        })
        // Sau khi thành công, chuyển hướng đến trang báo thành công
       
        return res.json({
            redirectURL:'/campaign/createsuccess'
        });
    } catch (error) {
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
};

module.exports = controller