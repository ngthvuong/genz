'use strict'

const express = require('express')
const controller = require('../controllers/homeController')

const router = express.Router()


router.get('/sync-db', (req, res) => {
    let models = require("../models")
    models.sequelize.sync().then(() => {
        res.send("data tables created successfully.")
    })
})

router.use(require('../middlewares/auth').isLogged())
router.get('/', controller.show)
router.get('/error', require('../middlewares/hbs').setLayoutName('single'), controller.errorPage)


module.exports = router
