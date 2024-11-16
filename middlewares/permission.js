'use strict'
const errors = require("../services/responseErrors")

const permission = {}

permission.check = (feature, action) => {
    return (req, res, next) => {
        const isPermit = req.session.user.permission[feature] && req.session.user.permission[feature][action]
        if(!isPermit){
            if(req.method == "GET"){
                return res.redirect("/")
            }
            errors.add({ msg: "Không có quyền tiếp cận" })
            return res.json(errors.get())
        }
        next()
    }
}

module.exports = permission