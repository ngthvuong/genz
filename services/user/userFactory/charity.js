'use strict'

const commonUser = require('./commonUser')
const charity = Object.create(commonUser)

charity.register = async () => {
    return "charity register service"
}

charity.avgReview = async () => {
    return "charity avgReview service"
}

module.exports = charity