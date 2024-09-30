'use strict'

const hbs = {}

hbs.setLayoutName = (layoutName) => {
    return (req, res, next) => {
        res.locals.layout = layoutName
        next()
    }
}

module.exports = hbs