'use strict'

const express = require('express')
const controller = require('../controllers/userController')

const router = express.Router()

router.use(require('../middlewares/hbs').setLayoutName('auth'))

router.get('/register', controller.register)
router.get('/login', controller.login)

router.post('/register', controller.register)
router.post('/login', controller.login)

module.exports = router