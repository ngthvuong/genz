'use strict'

const express = require('express')
const controller = require('../controllers/userController')

const router = express.Router()

router.get('/profile', controller.profile)
router.post('/profile', controller.register)

module.exports = router