
const commonUser = require("./userFactory/commonUser")
const donor = require("./userFactory/donor")
const charity = require("./userFactory/charity")
const recipient = require("./userFactory/recipient")
const admin = require("./userFactory/admin")

const userFactory = (userData) => {
    switch (userData.role) {
        case 'donor':
            return Object.assign(Object.create(donor), userData)
        case 'charity':
            return Object.assign(Object.create(charity), userData)
        case 'recipient':
            return Object.assign(Object.create(recipient), userData)
        case 'admin':
            return Object.assign(Object.create(admin), userData)
        default:
            throw new Error('Invalid user role');
    }
}
module.exports = userFactory