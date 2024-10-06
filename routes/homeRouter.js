'use strict'

const express = require('express')
const controller = require('../controllers/homeController')
const models = require('../models')

const router = express.Router()

router.get('/sync-db', (req, res) => {
    let models = require("../models")
    models.sequelize.sync().then(() => {
        res.send("data tables created successfully.")
    })
})


router.get('/', controller.show)
router.get('/error', require('../middlewares/hbs').setLayoutName('single'), controller.errorPage)


module.exports = router
