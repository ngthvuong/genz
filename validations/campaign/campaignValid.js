'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('campaignName')
        .trim()
        .notEmpty().withMessage("Tên chiến dịch là bắt buộc!"),
    body('campaignLocation')
        .trim()
        .notEmpty().withMessage("Địa điểm chiến dịch là bắt buộc!"),    
    
])
module.exports = validation