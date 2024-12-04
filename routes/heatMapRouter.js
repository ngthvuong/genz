'use strict'

const express = require('express')

const createValid = require('../validations/heatMap/createValid')
const editValid = require('../validations/heatMap/editValid')

const permission = require("../middlewares/permission")

const controller = require('../controllers/heatMapController')
const router = express.Router()

router.use(require('../middlewares/auth').isLogged())
router.use(permission.check("heatmap", "config"))

router.use(controller.share)
router.get('/manage/list', controller.showManageList)

router.get('/manage/create', controller.create)
router.post('/manage/create', createValid, controller.insert)

router.get('/manage/edit/:id', controller.edit)
router.put('/manage/edit/:id', editValid, controller.update)

router.delete('/manage/delete/:id', controller.delete)






module.exports = router