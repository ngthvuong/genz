'use strict'

const middleware = {}

middleware.setShareVariables = () => {
    return (req, res, next) => {
        res.locals.appName = process.env.APP_NAME
        res.locals.searchUrl = "/report"

        next()
    }
}

module.exports = middleware