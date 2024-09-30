'use strict'

const controller = {}

controller.register = async (req, res) => {
    res.render('register')
}

controller.login = async (req, res) => {
    res.render('login')
}

controller.profile = async (req, res) => {
    res.render('profile')
}

module.exports = controller