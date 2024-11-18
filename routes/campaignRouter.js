'use strict'
const campaignStore = require("../storage/campaignStore")

const express = require('express')
const createCampaignValid = require('../validations/campaign/createCampaignValid')
const editCampaignValid = require('../validations/campaign/editCampaignValid')

const controller = require('../controllers/campaignController')

const router = express.Router()

router.use(controller.share)
router.use(require('../middlewares/auth').isLogged())
const permission = require("../middlewares/permission")
router.use(permission.check("campaign", "all"))

router.get('/', controller.showlist)
router.get('/create', controller.create)
router.get('/edit/:id', controller.showEdit)

router.post('/create',
    campaignStore.handlerCache(),
    createCampaignValid,
    controller.createCampaign
)
router.post('/edit/:id',
    campaignStore.handlerCache(),
    editCampaignValid,
    controller.editCampaign
)
router.delete('/delete/:id', controller.deleteCampaign)

module.exports = router
