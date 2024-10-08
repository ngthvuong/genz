'use strict'

const controller = {}

controller.show = async (req, res) => {
    res.render('campaign')
}
controller.showDetail = async (req, res) => {
    res.render('campaignDetail')
}


controller.shows = async (req, res) => {
    res.render('campaignDetail')
}
controller.rating = async (req, res) => {
    res.render('campaignDetail')
}

module.exports = controller