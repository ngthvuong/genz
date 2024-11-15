'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('title')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập tiêu đề tin!"),
    body('content')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập nội dung tin!"),
    body('campaignID')
        .trim()
        .notEmpty().withMessage("Chiến dịch không được để trống!")
])
module.exports = validation