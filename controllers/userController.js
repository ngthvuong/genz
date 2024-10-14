'use strict'
const models = require('../models')
const errors = require("../services/responseErrors")
const licenseStorage = require("../storage/licenseStorage")

const controller = {}

controller.logout = (req, res) => {
    delete req.session.user
    res.redirect('/auth/login')
}

controller.showUpdateLicense = async (req, res) => {
    return res.render('auth/license', {
        title: "Bổ Sung Giấy Phép"
    })
}
controller.updateLicense = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role != 'charity') {
            throw new Error("Không có quyền truy cập!")
        }
        if (!req.file) {
            throw new Error("Vui lòng upload file")
        }
        const { merchantAppID, merchantKey1, merchantKey2, name } = req.body

        const charity = await models.Charity.create({
            merchantAppID,
            merchantKey1,
            merchantKey2,
            userID: req.session.user.id
        })

        const licenseImage = await licenseStorage.upload(req)

        await models.License.create({
            name,
            imgPath: licenseImage.path,
            charityID: charity.id
        })

        await models.User.update({ status: 'pending' }, { where: { id: req.session.user.id } })
        req.session.user.status = 'pending'

        return res.json({ success: true, nextUrl: "/auth/approval" })
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}
controller.showPendingApproval = async (req, res) => {
    return res.render('auth/pending', {
        title: "Chờ Xét Duyệt",
        user: req.session.user
    })
}

module.exports = controller