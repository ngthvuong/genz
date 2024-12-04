'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('name')
        .trim()
        .notEmpty().withMessage("Tên bản đồ là bắt buộc!"),
    body('unit')
        .trim()
        .notEmpty().withMessage("đơn vị tính là bắt buộc!"),
])
module.exports = validation