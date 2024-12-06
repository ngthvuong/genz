'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

const validation = handle([
    body('campaignName')
        .trim()
        .notEmpty().withMessage("Tên chiến dịch là bắt buộc!"),
    body('campaignLocation')
        .trim()
        .notEmpty().withMessage("Địa điểm là bắt buộc!"),
    body('campaignStartDate')
        .trim()
        .notEmpty().withMessage("Ngày bắt đầu là bắt buộc!")
        .isISO8601().withMessage("Ngày bắt đầu không hợp lệ!"),
    body('campaignEndDate')
        .trim()
        .notEmpty().withMessage("Ngày kết thúc là bắt buộc!")
        .isISO8601().withMessage("Ngày kết thúc không hợp lệ!"),
    body('campaignGoal')
        .trim()
        .notEmpty().withMessage("Mục tiêu là bắt buộc!"),
    body('campaignBudget')
        .trim()
        .notEmpty().withMessage("Ngân sách là bắt buộc!"),
    body('campaignDescription')
        .trim()
        .notEmpty().withMessage("Mô tả là bắt buộc!")

])
module.exports = validation