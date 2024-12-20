'use strict'

const express = require('express')
const userRouter = require('./userRouter')
const homeRouter = require('./homeRouter')
const authRouter = require('./authRouter')
const testRouter = require('./testRouter')
const reportRouter = require('./reportRouter')
const campaignRouter = require('./campaignRouter')
const newsFeedRouter = require('./newsFeedRouter')
const charityVerificationRouter = require('./charityVerificationRouter')
const charityListRouter = require('./charityListRouter')
const transactionRouter = require('./transactionRouter')
const heatMapRouter = require('./heatMapRouter')

const commonMiddleware = require('../middlewares/commonMiddleware')

const router = express.Router()

router.use(commonMiddleware.setShareVariables())
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/report', reportRouter)
router.use('/campaign', campaignRouter)
router.use('/news-feed', newsFeedRouter)
router.use('/transaction', transactionRouter)
router.use('/test', testRouter)
router.use('/', homeRouter)
router.use('/charity-verification', charityVerificationRouter)
router.use('/charity', charityListRouter)
router.use('/heatmap', heatMapRouter)


module.exports = router
