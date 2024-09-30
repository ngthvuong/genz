'use strict'

const controller = {}

controller.show = async (req, res) => {
    res.render('home')
}

module.exports = controller