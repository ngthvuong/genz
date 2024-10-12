'use strict'

const express = require('express')
const controller = require('../controllers/userController')

const router = express.Router()
router.use(require('../middlewares/auth').isLogged())

router.get('/logout', controller.logout)

module.exports = router