'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('name')
        .trim()
        .notEmpty().withMessage("Tên là bắt buộc!"),
    body('password')
        .trim()
        .custom((value, { req }) => {
            if (req.body.isChangePassword) {
                if (!value) {
                    throw new Error("Mật khẩu là bắt buộc!");
                }
                if (value.length < 8) {
                    throw new Error("Mật khẩu phải chứa ít nhất 8 ký tự");
                }
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(value)) {
                    throw new Error("Mật khẩu phải có ít nhất một chữ cái thường, một chữ cái hoa, một chữ số, và một ký tự đặc biệt!");
                }
            }
            return true;
        }),
    body('confirmPassword')
        .trim()
        .custom((confirmPassword, { req }) => {
            if (req.body.isChangePassword && confirmPassword != req.body.password) {
                throw new Error("Xác nhận mật khẩu không đúng")
            }
            return true
        }),
])
module.exports = validation