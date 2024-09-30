'use strict'

const controller = {}

controller.show = async (req, res) => {
    res.render('home')
}
controller.errorPage = async (req, res) => {
    res.render('errorPage')
}

module.exports = controller