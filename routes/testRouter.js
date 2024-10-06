'use strict'

const express = require('express')
const controller = require('../controllers/testController')

const router = express.Router()

router.get('/transfer', controller.transfer)
router.get('/user', controller.user)


module.exports = router
