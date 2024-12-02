'use strict'

const auth = {}

auth.isLogged = () => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/login")
        }
        if (req.session.user.status == 'inactive' && req.session.user.role == 'charity') {
            return res.redirect("/user/license")
        }
        if (req.session.user.status == 'pending' && req.session.user.role == 'charity') {
            return res.redirect("/user/approval")
        }
        if (req.session.user.status == 'reject' && req.session.user.role == 'charity') {
            return res.redirect("/user/reject")
        }
        res.locals.user = req.session.user;
        res.locals.user.permission = require("../config/permissionConfig.json")[res.locals.user.role]
        next()
    }
}
auth.isLoggedNotActive = () => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/login")
        }
        if (req.session.user.status != 'inactive') {
            return res.redirect("/")
        }
        next()
    }
}
auth.isLoggedPending = () => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/login")
        }
        if (req.session.user.status != 'pending') {
            return res.redirect("/")
        }
        next()
    }
}
auth.isLoggedReject = () => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/auth/login")
        }
        if (req.session.user.status != 'reject') {
            return res.redirect("/")
        }
        next()
    }
}
auth.isNotLogged = () => {
    return async (req, res, next) => {
        if (process.env.TEST_USER) {
            const models = require("../models")
            req.session.user = await models.User.findOne({ where: { phone: process.env.TEST_USER } })
        }
        if (req.session.user) {
            return res.redirect("/")
        }
        next()
    }
}

module.exports = auth