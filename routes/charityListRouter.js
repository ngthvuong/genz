'use strict'

const express = require('express')
const controller =require('../controllers/charityController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.use(controller.share)

router.get('/', controller.showCharityList)
router.get('/:id', controller.showCharityDetails)
module.exports=router