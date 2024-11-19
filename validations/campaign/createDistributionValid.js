'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('receiver')
        .trim()
        .notEmpty().withMessage("Người nhận cứu trợ là bắt buộc!"),
    body('amount')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập số tiền cứu trợ!")
        .isInt({ min: 10000 }).withMessage("Số tiền cứu trợ phải lớn hơn 10.000 VNĐ!")
        .isInt({ max: 500000000 }).withMessage("Số tiền cứu trợ phải nhỏ hơn 500.000.000 VNĐ!"),
    body('message')
        .trim()
        .notEmpty().withMessage("Vui lòng Nhập lời nhắn!")
])
module.exports = validation