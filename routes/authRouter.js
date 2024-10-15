'use strict'

const express = require('express')
const registerValid = require('../validations/auth/registerValid')
<<<<<<< HEAD

=======
const verifyValid = require('../validations/auth/verifyValid')
const loginValid = require('../validations/auth/loginValid')
>>>>>>> 0a85bf9bc66f072958131c181c15a83016e1255b
const controller = require('../controllers/authController')

const router = express.Router()
router.use(require('../middlewares/auth').isNotLogged())
router.use(require('../middlewares/hbs').setLayoutName('single'))

router.get('/register', controller.showRegister)
router.post('/register',registerValid, controller.register)
router.get('/verify', controller.showVerify)
<<<<<<< HEAD
router.post('/verify',registerValid, controller.verify)

router.get('/login', controller.showLogin)
router.post('/login', controller.login)
=======
router.post('/verify',verifyValid, controller.verify)
router.get('/completed', controller.showCompleted)
router.get('/login', controller.showLogin)
router.post('/login', loginValid, controller.login)
>>>>>>> 0a85bf9bc66f072958131c181c15a83016e1255b

module.exports = router