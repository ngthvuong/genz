'use strict'

const commonUser = require('./commonUser')
const charity = Object.create(commonUser)

charity.avgReview = async () => {
    return "charity avgReview service"
}

module.exports = charity