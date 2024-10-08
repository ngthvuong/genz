'use strict'

const controller = {}

controller.showRegister = async (req, res) => {
    res.render('register', {
        user: req.session.tempUser
    })
}
controller.register = async (req, res) => {
    req.session.tempUser = req.body
    req.session.tempUser.step = 'pending'

    const nextUrl = (req.body.role == 'charity') ? "/auth/license/upload" : "/auth/verify";
    return res.json({ success: true, nextUrl })
}

controller.showVerify = async (req, res) => {
    res.render('verify')
}
controller.verify = async (req, res) => {
    return res.json({ success: true, nextUrl: "/auth/completed" })
}

controller.showUploadLicense = async (req, res) => {
    //license and merchant account
    res.render('upload-license')
}
controller.uploadLicense = async (req, res) => {
    return res.json({ success: true, nextUrl: "/auth/completed" })
}

controller.showCompleted = async (req, res) => {
    res.render('completed')
}

controller.showLogin = async (req, res) => {
    res.render('login')
}
controller.login = async (req, res) => {
    return res.json({ success: true, nextUrl: "/" })
}

controller.showForgotPassWord = async (req, res) => {
    res.render('forgot-password')
}
controller.forgotPassWord = async (req, res) => {
    return res.json({ success: true })
}

controller.showResetPassword = async (req, res) => {
    res.render('reset-password')
}
controller.resetPassword = async (req, res) => {
    return res.json({ success: true })
}

module.exports = controller