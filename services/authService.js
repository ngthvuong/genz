'use strict'

const bcrypt = require('bcrypt')

const steps = Object.freeze({
    PENDING: 'pending',
    VERIFYING: 'verifying',
    COMPLETED: 'completed'
})

const saltRounds = 8

const fullPhone = (phone) => {
    return phone.replace(/^0/, '+84')
}

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds))
}
const comparePassword = (password, hashedCode) => {
    return bcrypt.compareSync(password, hashedCode)
}

module.exports = {
    steps, saltRounds, fullPhone, hashPassword, comparePassword
}



