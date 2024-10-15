'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('pin')
        .trim()
        .notEmpty().withMessage("Mã Pin là bắt buộc!")
        .isLength({min: 6, max:6}).withMessage("Mã Pin gồm 6 chữ số")
])
module.exports = validation