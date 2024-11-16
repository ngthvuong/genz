'use strict'

const express = require('express')
const controller =require('../controllers/charityVerificationController')
const router = express.Router()


router.get('/', controller.showUnapprovedCharityList);
router.get('/:id', controller.showPendingCharityDetails);
router.put('/charities/approve/:id', controller.updateApprovedCharityStatus);
router.put('/charities/reject/:id', controller.updateRejectedCharityStatus);
module.exports=router