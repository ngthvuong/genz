'use strict'

const middleware = {}

middleware.setShareVariables = () => {
    return (req, res, next) => {
        res.locals.appName = process.env.APP_NAME
        next()
    }
}

module.exports = middleware