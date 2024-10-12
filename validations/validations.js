'use strict'

const { validationResult } = require('express-validator')
const responseErrors = require("../services/responseErrors")

const validation = {}

validation.handle = (validations) => {
    return [
        ...validations,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(200).json(responseErrors.multiAdd(errors.array()).get());
            }
            next();
        }
    ]
}

module.exports = {
    handle: validation.handle
}