'use strict'

const express = require('express')
const reviewValid = require('../validations/report/reviewValid')
const commentValid = require('../validations/report/commentValid')


const controller = require('../controllers/reportController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.get('/', controller.show)
router.get('/:id', controller.showDetails)
router.get('/statement/:id', controller.showStatement)
router.post('/contribution/load', controller.loadContributions)
router.post('/distribution/load', controller.loadDistributions)


router.get('/export/:id', controller.download)
router.post('/review', reviewValid, controller.review)
router.post('/comment', commentValid, controller.comment)
router.post('/download', controller.download)





module.exports = router