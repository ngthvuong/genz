'use strict'

const auth = {}

auth.check = () => {
    return (req, res, next) => {

        if(1){
            res.redirect("/auth/login")
        }
        next()
    }
}

module.exports = auth