'use strict'

const express = require('express')
const controller = require('../controllers/homeController')

const router = express.Router()

router.get('/', controller.show)
router.get('/error', require('../middlewares/hbs').setLayoutName('single'), controller.errorPage)


module.exports = router
