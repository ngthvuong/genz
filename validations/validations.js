'use strict'

const { validationResult } = require('express-validator')
const validation = {}

validation.handle = (validations) => {
    return [
        ...validations,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(200).json({ errors: errors.array() });
            }
            next();
        }
    ]
}

module.exports = {
    handle: validation.handle
}