'use strict'

const { validationResult } = require('express-validator')
<<<<<<< HEAD
=======
const responseErrors = require("../services/responseErrors")

>>>>>>> 0a85bf9bc66f072958131c181c15a83016e1255b
const validation = {}

validation.handle = (validations) => {
    return [
        ...validations,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
<<<<<<< HEAD
                return res.status(200).json({ errors: errors.array() });
=======
                return res.status(200).json(responseErrors.multiAdd(errors.array()).get());
>>>>>>> 0a85bf9bc66f072958131c181c15a83016e1255b
            }
            next();
        }
    ]
}

module.exports = {
    handle: validation.handle
}