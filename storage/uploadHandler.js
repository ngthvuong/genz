'use strict'
const multer = require('multer')
const path = require('path')
const fs = require('fs');


class UploadHandler {
    #rootDirPath ='media'
    fieldName = '';
    subDirPath = '';
    type = 'single';
    nameFile = ''

    async setFileName(req) {
        const { originalname } = req.file;
        const ext = path.extname(originalname);
        this.nameFile = path.basename(originalname, ext);
    }
    getFullDirPath(){
        return path.join(this.#rootDirPath, this.subDirPath)
    }

    handlerCache() {
        const storage = multer.memoryStorage();
        if (this.type == "single") {
            return multer(storage).single(this.fieldName);
        }
        throw new Error('Unsupported upload type');
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
            return multer({ storage: this.config }).single(this.fieldName);
        }
        throw new Error('Unsupported upload type');
    }

    upload(req) {
        return new Promise(async (resolve, reject) => {
            if (!req.file) {
                throw new Error('File is not provided in the request.');
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
                if (err) {
                    console.error("Error writing file:", err);
                    return reject(err);
                }
                console.log("File successfully written.");

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