'use strict'
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const responseErrors = require("../services/responseErrors")

class UploadHandler {
    #rootDirPath = 'media'
    fieldName = ''
    subDirPath = ''
    type = 'single'
    nameFile = ''
    upload = null

    async setFileName(req) {
        const { originalname } = req.file;
        const ext = path.extname(originalname);
        this.nameFile = path.basename(originalname, ext);
    }
    getFullDirPath() {
        return path.join(this.#rootDirPath, this.subDirPath)
    }

    fileFilter(req, file, cb) {
        const allowedTypes = /jpg|jpeg|png|gif/
        const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const isValidMimeType = allowedTypes.test(file.mimetype);
        const maxSize = 5 * 1024 * 1024

        if (file.size >= maxSize) {
            return cb(new Error('File upload lớn hơn 5MB.'));
        }
        if (!isValidType || !isValidMimeType) {
            return cb(new Error('File upload phải có định dạng jpg, jpeg, png, gif'));
        }

        cb(null, true)
    }

    handlerError() {
        return (req, res, next) => {
            this.upload(req, res, (error) => {
                if (error) {
                    return res.status(200).json(responseErrors.add({ msg: error.message }).get())
                }
                next()
            })
        }
    }

    handlerCache() {
        const storage = multer.memoryStorage();
        if (this.type == "single") {
            this.upload = multer({ storage, fileFilter: this.fileFilter.bind(this) }).single(this.fieldName);
        } else if (this.type === "multiple") {
            this.upload = multer({ storage, fileFilter: this.fileFilter.bind(this) }).array(this.fieldName);
        } else {
            throw new Error('Unsupported upload type');
        }
        return this.handlerError()
    }

    handlerDisk() {
        this.config = multer.diskStorage({
            destination: (req, file, done) => {
                done(null, this.getFullDirPath());
            },
            filename: (req, file, done) => {
                const ext = path.extname(file.originalname);
                const imageName = path.basename(file.originalname, ext);
                done(null, `${imageName}${ext}`);
            }
        });
        if (this.type == "single") {
            this.upload = multer({ storage: this.config }).single(this.fieldName);
        } else if (this.type === "multiple") {
            this.upload = multer({ storage: this.config }).array(this.fieldName);
        } else {
            throw new Error('Unsupported upload type');
        }
        return this.handlerError()
    }

    saveFile(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.file) {
                return reject(new Error('Vui lòng upload file!'))
            }

            await this.setFileName(req)

            const { originalname, buffer } = req.file;
            const ext = path.extname(originalname);

            const rootProductPath = process.cwd();
            const fullDirPath = path.join(rootProductPath, this.getFullDirPath())
            const fullName = `${this.nameFile}${ext}`
            const destinationPath = path.join(fullDirPath, fullName);

            if (!fs.existsSync(fullDirPath)) {
                fs.mkdirSync(fullDirPath, { recursive: true });
            }

            fs.writeFile(destinationPath, buffer, (err) => {
                delete req.file.buffer

                if (err) {
                    console.error("Error writing file:", err);
                    return reject(new Error('Có lỗi trong quá trình lưu tệp tin hoặc tên bài viết chứa ký tự đặt biệt!'))
                }
                resolve({
                    fileName: fullName,
                    dirPath: this.getFullDirPath().replace(/\\/g, '/'),
                    path: path.join(`\\${this.getFullDirPath()}`, fullName).replace(/\\/g, '/')
                })
            });
        })
    }
}

module.exports = UploadHandler