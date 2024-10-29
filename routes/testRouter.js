'use strict'

const express = require('express')
const controller = require('../controllers/testController')

const router = express.Router()

router.get('/transfer', controller.transfer)
router.get('/heatmap', controller.heatmap)

router.get('/event', controller.event)
router.get('/event-reject', controller.eventReject)

router.get('/event-rollback', controller.eventRollback)


router.get('/socket', (req, res) =>{
    res.render("test/socket")
})



module.exports = router
