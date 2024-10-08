'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const registerValid = handle([
    body('name').trim().notEmpty().withMessage("Tên là bắt buộc!"),
    body('email').trim().notEmpty().withMessage("Email là bắt buộc!").isEmail().withMessage("Định dạng email không đúng!"),
    body('phone').trim().notEmpty().withMessage("Điện thoại là bắt buộc!"),
    body('password').trim().notEmpty().withMessage("Password là bắt buộc!"),
    body('confirmPassword').custom((confirmPassword, { req }) => {
        if (confirmPassword != req.body.password) {
            throw new Error("Xác nhận mật khẩu không đúng")
        }
        return true
    }),
    body('role').trim().notEmpty().withMessage("Loại người dùng là bắt buộc!"),
])
module.exports = registerValid