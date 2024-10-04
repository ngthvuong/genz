'use strict'

const permission = {}

permission.check = () => {
    return (req, res, next) => {

        next()
    }
}

module.exports = permission