'use strict'

const donor = require('./user')

donor.contribute = async () => {
    return "donor contribute service"
}

module.exports = donor