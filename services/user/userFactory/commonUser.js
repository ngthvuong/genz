'use strict'

const commonUser = {}

commonUser.register = async () => {
    return "user register service"
}
commonUser.verify = async () => {
    return "user verify service"
}

commonUser.login = async () => {
    return "user login service"
}

module.exports = commonUser