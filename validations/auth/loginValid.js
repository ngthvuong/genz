'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('phone')
        .trim()
        .notEmpty().withMessage("Điện thoại là bắt buộc!")
        .matches(/^0/).withMessage("Điện thoại bắt đầu là 0!"),
    body('password')
        .trim()
        .notEmpty().withMessage("Mật khẩu là bắt buộc!")
        .isLength({ min: 8 }).withMessage("Mật khẩu phải chứa ít nhất 8 ký tự")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/)
        .withMessage("Mật khẩu phải có ít nhất một chữ cái thường, một chữ cái hoa, một chữ số, và một ký tự đặc biệt!"),
])
module.exports = validation