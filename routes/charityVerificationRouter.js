'use strict'

const express = require('express')
const controller =require('../controllers/charityVerificationController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
const permission = require("../middlewares/permission")
router.use(permission.check("user", "verifyLicense"))
router.use(controller.share)

router.get('/', controller.showUnapprovedCharityList)
router.get('/:id', controller.showPendingCharityDetails)
router.put('/charities/approve/:id', controller.updateApprovedCharityStatus)
router.put('/charities/reject/:id', controller.updateRejectedCharityStatus)
module.exports=router