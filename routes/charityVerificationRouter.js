'use strict'

const express = require('express')
const controller =require('../controllers/charityVerificationController')
const router = express.Router()


router.get('/', controller.showUnapprovedCharityList);
router.get('/:id', controller.showPendingCharityDetails);
router.put('/charities/approve/:id', controller.updateCharityStatus);
module.exports=router