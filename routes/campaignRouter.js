'use strict'
const campaignStore = require("../storage/campaignStore")

const express = require('express')
const campaignValid = require('../validations/campaign/campaignValid')
const controller = require('../controllers/campaignController')

const router = express.Router()

router.use(require('../middlewares/auth').isLogged());
const permission = require("../middlewares/permission")
router.use(permission.check("campaign", "all"))

router.get('/', controller.showlist)
//=> phải đăng ký campainRouter trong routes/index.js
router.get('/create', controller.create)
router.get('/createsuccess', controller.createSuccess)

router.get('/edit/:id', controller.showEdit)
router.post('/create',
    campaignStore.handlerCache(),
    campaignValid,    
    controller.createCampaign
)

module.exports = router
