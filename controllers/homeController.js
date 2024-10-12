'use strict'

const controller = {}

controller.show = async (req, res) => {
    console.log(process.env.ENCRYPTION_KEY)
    res.render('home')
}
controller.errorPage = async (req, res) => {
    res.render('errorPage', {
        title: req.query.title,
        message: req.query.message
    })
}

module.exports = controller