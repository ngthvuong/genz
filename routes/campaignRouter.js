'use strict'

const express = require('express')
const controller = require('../controllers/campaignController')

const router = express.Router()

router.get('/', controller.show)
router.get('/:id', controller.showDetail)



module.exports = router