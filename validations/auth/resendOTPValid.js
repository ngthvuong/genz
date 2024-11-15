'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('notifyChannel')
        .trim()
        .notEmpty().withMessage("Kênh xác thức là bắt buộc!")
        .isIn(['phone', 'email'])
        .withMessage("Kênh xác thực phải là một trong các giá trị hợp lệ!"),
])
module.exports = validation