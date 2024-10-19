const UploadHandler = require('./uploadHandler');
const models = require('../models')

class LicenseStorage extends UploadHandler {
    constructor() {
        super()
        /**
         * fieldName is name of file input/inputs of submitted form 
         */
        this.fieldName = 'licenseImage'

        /**
         * subDirPath is name of subforder that image will be save, root is media directory
         */
        this.subDirPath = 'licenses/'

        /**
         * type file input is an list or single
         * single : fieldName include only one files
         * multiple : fieldName include multi files
         *  
         */
        this.type = "single"
    }
    async setFileName(req) {
        const userID = req.session.user.id
        const charity = await models.Charity.findOne({ where: { userID } })
        if (!charity) {
            throw new Error("không tìm thấy Tổ chức từ thiện nào từ người dùng này")
        }
        this.nameFile = `${charity.id}_license_${Date.now()}`
    }
}

module.exports = new LicenseStorage()