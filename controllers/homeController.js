'use strict'

const controller = {}

controller.show = async (req, res) => {
    console.log(process.env.ENCRYPTION_KEY)
    res.render('home')
}
controller.errorPage = async (req, res) => {
    res.render('errorPage')
}

module.exports = controller