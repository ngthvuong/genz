'use strict'

const express = require('express')
const authMiddleware = require('../middlewares/auth')
const controller = require('../controllers/userController')
const licenseValid = require('../validations/auth/licenseValid')
const licenseStorage = require("../storage/licenseStorage")
const sessionValid = require('../validations/user/sessionValid')
const avatarStorage = require("../storage/avatarStorage")
const editProfileValid = require('../validations/user/editProfileValid')


const router = express.Router()

router.get('/logout', controller.logout)
router.get('/profile', controller.showProfile)
router.post('/profile', avatarStorage.handlerCache(), editProfileValid, controller.editProfile)


router.use(require('../middlewares/hbs').setLayoutName('single'))
router.get('/license', authMiddleware.isLoggedNotActive(), controller.showUpdateLicense)
router.post('/license', licenseStorage.handlerCache(), licenseValid, controller.updateLicense)
router.get('/approval', authMiddleware.isLoggedPending(), controller.showPendingApproval)
router.post('/resetSession', sessionValid, controller.resetUserSession)

module.exports = router