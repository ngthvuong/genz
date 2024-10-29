'use strict'

const express = require('express')
const controller = require('../controllers/reportController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.get('/', controller.show)
router.get('/:id', controller.showDetails)
router.get('/statement/:id', controller.showStatement)
router.get('/export/:id', controller.download)





module.exports = router
