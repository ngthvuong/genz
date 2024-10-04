'use strict'

const controller = {}

controller.zaloPay = async (req, res) => {
    console.log(process.env.ENCRYPTION_KEY)
    res.render('home')
}

module.exports = controller