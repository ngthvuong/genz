'use strict'

const controller = {}

controller.show = async (req, res) => {
    res.render('report')
}
controller.showDetail = async (req, res) => {
    res.render('reportDetail')
}

module.exports = controller