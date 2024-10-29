'use strict'

const errors = require("../services/responseErrors")
const OTPSMS = require('../thirdParties/OTPSMS')
const models = require('../models')
const { steps, fullPhone, hashPassword, comparePassword } = require('../services/authService')


const controller = {}

controller.showRegister = async (req, res) => {
    return res.render('auth/register', {
        user: req.session.tempUser,
        title: "Đăng Ký"
    })
}
controller.register = async (req, res) => {

    try {
        let { phone, email, name, password, role } = req.body

        const existingPhoneUser = await models.User.findOne({ where: { phone } });

        if (existingPhoneUser) {
            throw new Error("Số điện thoại này đã được đăng ký!")
        }
        const existingEmailUser = await models.User.findOne({ where: { phone } });
        if (existingEmailUser) {
            throw new Error("Email này đã được đăng ký!")
        }

        if (! await OTPSMS.sendOTP(fullPhone(phone))) {
            throw new Error("Có lỗi khi gởi OTP, vui lòng kiểm tra lại số Điện thoại!")
        }

        req.session.tempUser = {
            phone,
            email,
            name,
            role,
            password: hashPassword(password),
        }
        req.session.authProcess = {
            step: steps.VERIFYING
        }

        const nextUrl = "/auth/verify";
        return res.json({ success: true, nextUrl })

    } catch (error) {
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showVerify = async (req, res) => {
    if (!req.session.tempUser || req.session.authProcess.step != steps.VERIFYING) {
        return res.redirect('/auth/register')
    }
    res.render('auth/verify', {
        title: "Xác Thực Tài Khoản"
    })
}
controller.verify = async (req, res) => {
    try {
        if (!req.session.tempUser || req.session.authProcess.step != steps.VERIFYING) {
            throw new Error("Không có quyền truy cập!")
        }
        const { pin } = req.body

        if (! await OTPSMS.verifyOTP(fullPhone(req.session.tempUser.phone), pin)) {
            throw new Error("Mã xác thực không chính xác!")
        }

        req.session.tempUser.status = (req.session.tempUser.role == 'charity') ? 'inactive' : 'active'

        await models.User.create(req.session.tempUser)

        req.session.authProcess.step = steps.COMPLETED
        return res.json({ success: true, nextUrl: "/auth/completed" })

    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.showCompleted = async (req, res) => {
    if (!req.session.tempUser || req.session.authProcess.step != steps.COMPLETED) {
        return res.redirect('/auth/register')
    }
    const user = {
        'name': req.session.tempUser.name
    }
    delete req.session.tempUser
    delete req.session.authProcess
    return res.render('auth/completed', {
        user,
        title: "Đăng Ký Thành Công"
    })
}

controller.showLogin = async (req, res) => {
    res.render('auth/login', {
        title: "Đăng Nhập"
    })
}
controller.login = async (req, res) => {
    try {
        const { phone, password } = req.body
        const user = await models.User.findOne({ where: { phone } })
        if (!user) {
            throw new Error("Tài khoản không tồn tại!")
        }

        if (!comparePassword(password, user.password)) {
            throw new Error("Mật khẩu không đúng!")
        }
        req.session.user = user
        return res.json({ success: true, nextUrl: "/" })
    } catch (error) {
        console.error(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
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