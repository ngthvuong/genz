'use strict'

const express = require('express')
const userRouter = require('./userRouter')
const homeRouter = require('./homeRouter')
const callbackRouter = require('./callbackRouter')
const authRouter = require('./authRouter')
const testRouter = require('./testRouter')
const reportRouter = require('./reportRouter')
const campaignRouter = require('./campaignRouter')
const newsFeedRouter = require('./newsFeedRouter')

const charityVerificationRouter = require('./charityVerificationRouter')
const charityListRouter = require('./charityListRouter')


const commonMiddleware = require('../middlewares/commonMiddleware')

const router = express.Router()

router.use(commonMiddleware.setShareVariables())
router.use('/user', userRouter)
router.use('/callback', callbackRouter)
router.use('/auth', authRouter)
router.use('/report', reportRouter)
router.use('/campaign', campaignRouter)
router.use('/news-feed', newsFeedRouter)


router.use('/test', testRouter)
router.use('/', homeRouter)
router.use('/charityVerification', charityVerificationRouter)
router.use('/charity', charityListRouter)

module.exports = router
