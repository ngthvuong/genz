'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('commentContent')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập nội dung tin nhắn!"),
    body('campaignID')
        .trim()
        .notEmpty().withMessage("Chiến dịch không được để trống!"),
    body('userID')
        .trim()
        .notEmpty().withMessage("Người dùng không được để trống!")
])
module.exports = validation