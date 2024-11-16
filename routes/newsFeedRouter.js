'use strict'

const express = require('express')
const newsFeedValid = require('../validations/newsFeed/newsFeedValid')
const newsFeedStorage = require("../storage/newsFeedStorage")
const permission = require("../middlewares/permission")

const controller = require('../controllers/newsFeedController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.post('/create', permission.check("news", "create"), newsFeedStorage.handlerCache(), newsFeedValid, controller.create)

router.post('/load', controller.load)

module.exports = router