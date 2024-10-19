'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('userID')
        .trim()
        .notEmpty().withMessage("userID là bắt buộc!"),
])
module.exports = validation