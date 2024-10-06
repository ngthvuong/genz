
const commonUser = require("./userFactory/commonUser")
const donor = require("./userFactory/donor")
const charity = require("./userFactory/charity")
const recipient = require("./userFactory/recipient")
const admin = require("./userFactory/admin")

const userFactory = (userData) => {
    let user;
    switch (userData.role) {
        case 'donor':
            user = Object.assign(Object.create(donor), userData)
            break
        case 'charity':
            user = Object.assign(Object.create(charity), userData)
            break
        case 'recipient':
            user = Object.assign(Object.create(recipient), userData)
            break
        case 'admin':
            user = Object.assign(Object.create(admin), userData)
            break
        default:
            throw new Error('Invalid user role');
    }

    Object.defineProperty(user, 'role', {
        writable: false,
        configurable: false
    });
    return user
}
module.exports = userFactory