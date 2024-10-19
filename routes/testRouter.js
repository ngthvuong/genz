'use strict'

const express = require('express')
const controller = require('../controllers/testController')

const router = express.Router()

router.get('/transfer', controller.transfer)
router.get('/user', controller.user)
router.get('/event', controller.event)
router.get('/event-rollback', controller.eventRollback)


router.get('/socket', (req, res) =>{
    res.render("test/socket")
})



module.exports = router
