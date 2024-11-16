'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('campaignID')
        .trim()
        .notEmpty().withMessage("Vui lòng chọn chiến dịch!"),
    body('paymentMethodID')
        .trim()
        .notEmpty().withMessage("Vui lòng chọn phương thức thanh toán!"),
    body('amount')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập số tiền đóng góp!")
        .isInt({ min: 10000 }).withMessage("Số tiền đóng góp phải lớn hơn 10.000 VNĐ!")
        .isInt({ max: 50000000 }).withMessage("Số tiền đóng góp phải nhỏ hơn 50.000.000 VNĐ!"),
    body('message')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập nội dung đóng góp!")        
])
module.exports = validation