'use strict'

const express = require('express')
const registerValid = require('../validations/auth/registerValid')

const controller = require('../controllers/authController')

const router = express.Router()
router.use(require('../middlewares/hbs').setLayoutName('single'))

router.get('/register', controller.showRegister)
router.post('/register',registerValid, controller.register)
router.get('/verify', controller.showVerify)
router.post('/verify',registerValid, controller.verify)

router.get('/login', controller.showLogin)
router.post('/login', controller.login)

module.exports = router