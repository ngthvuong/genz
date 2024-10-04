'use strict'

const express = require('express')
const userRouter = require('./userRouter')
const campaignRouter = require('./campaignRouter')
const reportRouter = require('./reportRouter')
const homeRouter = require('./homeRouter')
const callbackRouter = require('./callbackRouter')
const authRouter = require('./authRouter')
const testRouter = require('./testRouter')



const router = express.Router()

router.use('/user', userRouter)
router.use('/campaign', campaignRouter)
router.use('/report', reportRouter)
router.use('/callback', callbackRouter)
router.use('/auth', authRouter)
router.use('/test', testRouter)
router.use('/', homeRouter)



module.exports = router
