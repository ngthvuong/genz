'use strict'

const express = require('express')
const userRouter = require('./userRouter')
const homeRouter = require('./homeRouter')
const callbackRouter = require('./callbackRouter')
const authRouter = require('./authRouter')
const testRouter = require('./testRouter')

const commonMiddleware = require('../middlewares/commonMiddleware')

const router = express.Router()

router.use(commonMiddleware.setShareVariables())
router.use('/user', userRouter)
router.use('/callback', callbackRouter)
router.use('/auth', authRouter)
router.use('/test', testRouter)
router.use('/', homeRouter)

module.exports = router
