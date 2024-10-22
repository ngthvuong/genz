'use strict'
const models = require('../models')
const errors = require("../services/responseErrors")
const licenseStorage = require("../storage/licenseStorage")
const avatarStorage = require("../storage/avatarStorage")
const { hashPassword } = require('../services/authService')

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
        const { representative, establishedDate, merchantAppID, merchantKey1, merchantKey2, name } = req.body

        const charity = await models.Charity.create({
            representative,
            establishedDate,
            merchantAppID,
            merchantKey1,
            merchantKey2,
            userID: req.session.user.id
        })

        const licenseImage = await licenseStorage.saveFile(req)

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

controller.resetUserSession = async (req, res) => {
    const { userID } = req.body

    const user = await models.User.findOne({ where: { id: userID } })
    if (user) {
        req.session.user = user
    }
    return res.json({ success: true, user: req.session.user })
}

controller.showProfile = async (req, res) => {
    const userID = req.session.user ? req.session.user.id : 0;
    const user = await models.User.findOne({
        where: { id: userID },
        include: [
            {
                model: models.Charity,
                include: [
                    {
                        model: models.License
                    }
                ]
            }
        ]
    })

    if (!user) {
        return res.redirect("/")
    }

    return res.render('user/profile', {
        title: "Thông Tin Tài Khoản",
        user: user
    })
}

controller.editProfile = async (req, res) => {
    try {
        const userID = req.session.user ? req.session.user.id : 0;
        const { name, address, isChangePassword, password } = req.body
        const updateData = {}
        if (name) {
            updateData.name = name
        }
        if (address) {
            updateData.address = address
        }

        if (isChangePassword) {
            updateData.password = hashPassword(password)
        }

        if (req.file) {
            const avatarImage = await avatarStorage.saveFile(req)
            updateData.avatarPath = avatarImage.path
        }


        if (await models.User.update(updateData, { where: { id: userID } })) {
            const user = await models.User.findOne({ where: { id: userID } })
            return res.json({
                success: true, data: {
                    user
                }
            })
        }

        throw new Error("có lỗi trong quá trình cập nhật dữ liệu người dùng")
        
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

module.exports = controller