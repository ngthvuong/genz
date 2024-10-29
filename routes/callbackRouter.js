'use strict'

const express = require('express')
const controller = require('../controllers/callbackController')

const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.get('/payment/zalopay', controller.zaloPay)

module.exports=router