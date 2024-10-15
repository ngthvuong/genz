'use strict'
const { body } = require('express-validator')
const { handle } = require('../validations')

// Custom validation for image file
const fileValidation = (req, res, next) => {
    const image = req.files?.image; // Assuming you're using a file upload middleware like multer
    if (!image) {
        return res.status(400).json({ errors: [{ msg: "Hình ảnh là bắt buộc!" }] });
    }
    if (image.size > 4 * 1024 * 1024) { // 4 MB in bytes
        return res.status(400).json({ errors: [{ msg: "Hình ảnh không được vượt quá 4 MB!" }] });
    }
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(image.mimetype)) {
        return res.status(400).json({ errors: [{ msg: "Hình ảnh phải là JPEG, PNG hoặc GIF!" }] });
    }
    next();
};

const validation = handle([
    body('representative')
        .trim()
        .notEmpty().withMessage("Người đại diện là bắt buộc!"),
    body('establishedDate')
        .trim()
        .notEmpty().withMessage("Ngày thành lập là bắt buộc!"),
    body('merchantAppID')
        .trim()
        .notEmpty().withMessage("App ID là bắt buộc!"),
    body('merchantKey1')
        .trim()
        .notEmpty().withMessage("Key 1 là bắt buộc!"),
    body('merchantKey2')
        .trim()
        .notEmpty().withMessage("Key 2 là bắt buộc!"),
    body('name')
        .trim()
        .notEmpty().withMessage("Tên giấy phép là bắt buộc!"),
])
module.exports = validation