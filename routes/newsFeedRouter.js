'use strict'

const express = require('express')
const newsFeedValid = require('../validations/newsFeed/newsFeedValid')
const newsFeedStorage = require("../storage/newsFeedStorage")
const permission = require("../middlewares/permission")
const commentValid = require('../validations/newsFeed/commentValid')


const controller = require('../controllers/newsFeedController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.post('/create', permission.check("news", "create"), newsFeedStorage.handlerCache(), newsFeedValid, controller.create)
router.post('/comment', commentValid, controller.createComment)
router.post('/feeling', controller.touchFeeling)



router.post('/load', controller.load)
router.get('/details/:id', controller.showDetails)

module.exports = router