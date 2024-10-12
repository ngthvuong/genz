'use strict'

const auth = {}

auth.isLogged = () => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/login")
        }
        next()
    }
}
auth.isNotLogged = () => {
    return (req, res, next) => {
        if (req.session.user) {
            return res.redirect("/")
        }
        next()
    }
}

module.exports = auth