'use strict'

const express = require('express')
const registerValid = require('../validations/auth/registerValid')
const verifyValid = require('../validations/auth/verifyValid')
const loginValid = require('../validations/auth/loginValid')
const resendOTPValid = require('../validations/auth/resendOTPValid')

const controller = require('../controllers/authController')

const router = express.Router()
router.use(require('../middlewares/auth').isNotLogged())
router.use(require('../middlewares/hbs').setLayoutName('single'))

router.get('/register', controller.showRegister)
router.post('/register',registerValid, controller.register)
router.post('/resend-otp',resendOTPValid, controller.resendOTP)
router.get('/verify', controller.showVerify)
router.post('/verify',verifyValid, controller.verify)
router.get('/completed', controller.showCompleted)
router.get('/login', controller.showLogin)
router.post('/login', loginValid, controller.login)

module.exports = router