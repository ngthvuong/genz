'use strict'

const commonUser = require('./commonUser')
const donor = Object.create(commonUser)

donor.contribute = async () => {
    return "donor contribute service"
}

module.exports = donor