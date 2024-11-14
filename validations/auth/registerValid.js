'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('name')
        .trim()
        .notEmpty().withMessage("Tên là bắt buộc!"),
    body('email')
        .trim()
        .notEmpty().withMessage("Email là bắt buộc!")
        .isEmail().withMessage("Định dạng email không đúng!"),
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
    body('confirmPassword')
        .trim()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword != req.body.password) {
                throw new Error("Xác nhận mật khẩu không đúng")
            }
            return true
        }),
    body('role')
        .trim()
        .notEmpty().withMessage("Loại người dùng là bắt buộc!")
        .isIn(['donor', 'recipient', 'charity'])
        .withMessage("Vai trò phải là một trong các giá trị hợp lệ!"),
])
module.exports = validation