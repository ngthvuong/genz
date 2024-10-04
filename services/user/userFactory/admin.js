'use strict'

const commonUser = require('./commonUser')
const admin = Object.create(commonUser)

admin.approveLisense = async () => {
    return "admin approveLisense service"
}

module.exports = donor