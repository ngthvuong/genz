'use strict'

const express = require('express')
const controller = require('../controllers/userController')

const router = express.Router()

router.get('/register', require('../middlewares/hbs').setLayoutName('single'), controller.register)
router.get('/login', require('../middlewares/hbs').setLayoutName('single'), controller.login)
router.get('/profile', controller.profile)


router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/profile', controller.register)

module.exports = router