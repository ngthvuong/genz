'use strict'

const express = require('express')
const controller = require('../controllers/testController')

const router = express.Router()

router.get('/transfer', controller.transfer)
router.get('/callback', controller.callback)

router.get('/heatmap', controller.heatmap)

router.get('/event', controller.event)
router.get('/event-reject', controller.eventReject)

router.get('/event-rollback', controller.eventRollback)

router.get('/socket', (req, res) =>{
    res.render("test/socket")
})

router.use(require('../middlewares/auth').isLogged())
router.get('/permission', controller.permission)
router.get('/sendmail', controller.sendMailOtp)
router.get('/verifyotp/:pin', controller.verifyotp)


module.exports = router
