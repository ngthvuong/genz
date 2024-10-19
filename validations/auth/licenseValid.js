'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('representative')
        .trim()
        .notEmpty().withMessage("Người đại diện là bắt buộc!"),
    body('establishedDate')
        .trim()
        .notEmpty().withMessage("Ngày thành lập là bắt buộc!"),
    body('merchantAppID')
        .trim()
        .notEmpty().withMessage("App ID là bắt buộc!"),
    body('merchantKey1')
        .trim()
        .notEmpty().withMessage("Key 1 là bắt buộc!"),
    body('merchantKey2')
        .trim()
        .notEmpty().withMessage("Key 2 là bắt buộc!"),
    body('name')
        .trim()
        .notEmpty().withMessage("Tên giấy phép là bắt buộc!"),
])
module.exports = validation