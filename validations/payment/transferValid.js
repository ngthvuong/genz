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
        .notEmpty().withMessage("Số tiền nhập không hợp lệ, xin lui lòng đảm bảo giá trị nhập lớn hơn 10000 VND và nhỏ hơn 50000000 VND")
        .isInt({ min: 10000 }).withMessage("Số tiền nhập không hợp lệ, xin lui lòng đảm bảo giá trị nhập lớn hơn 10000 VND và nhỏ hơn 50000000 VND")
        .isInt({ max: 50000000 }).withMessage("Số tiền nhập không hợp lệ, xin lui lòng đảm bảo giá trị nhập lớn hơn 10000 VND và nhỏ hơn 50000000 VND"),
    body('message')
        .trim()
        .notEmpty().withMessage("Vui lòng nhập nội dung đóng góp!")        
])
module.exports = validation