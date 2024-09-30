'use strict'

const controller = {}

controller.register = async (req, res) => {
    res.render('register')
}

controller.login = async (req, res) => {
    res.render('login')
}

module.exports = controller