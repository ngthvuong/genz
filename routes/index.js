'use strict'

const express = require('express')
const userRouter = require('./userRouter')
const homeRouter = require('./homeRouter')


const router = express.Router()

router.use('/user', userRouter)
router.use('/', homeRouter)

module.exports = router
