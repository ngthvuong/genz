'use strict'

const controller = {}

controller.logout = (req, res) => {
    delete req.session.user
    res.redirect('/auth/login')
}

module.exports = controller