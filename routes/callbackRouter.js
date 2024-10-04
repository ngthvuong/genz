'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/callbackController')

router.get('/payment/zalopay', controller.zaloPay)

module.exports=router