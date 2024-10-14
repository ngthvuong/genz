'use strict'

const permission = {}

permission.check = () => {
    return (req, res, next) => {
        console.log(req.path)
        next()
    }
}

module.exports = permission