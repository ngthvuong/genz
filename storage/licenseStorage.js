const UploadHandler = require('./uploadHandler');
const models = require('../models')

class LicenseStorage extends UploadHandler {
    constructor() {
        super()
        this.fieldName = 'licenseImage'
        this.subDirPath = 'licenses/'
        this.type = "single"
    }
    async setFileName(req){
        const userID = req.session.user.id
        const charity = await models.Charity.findOne({where:{userID}})
        if (!charity) {
            throw new Error("không tìm thấy Tổ chức từ thiện nào từ người dùng này")
        }
        this.nameFile = `${charity.id}_license_${Date.now()}`
    }
}

module.exports = new LicenseStorage()