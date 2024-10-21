const UploadHandler = require('./uploadHandler');
const models = require('../models')

class AvatarStorage extends UploadHandler {
    constructor() {
        super()
        /**
         * fieldName is name of file input/inputs of submitted form 
         */
        this.fieldName = 'avatarImage'

        /**
         * subDirPath is name of subforder that image will be save, root is media directory
         */
        this.subDirPath = 'avatars/'

        /**
         * type file input is an list or single
         * single : fieldName include only one files
         * multiple : fieldName include multi files
         *  
         */
        this.type = "single"
    }
    async setFileName(req) {
        const userID = req.session.user?.id
        if (!userID) {
            throw new Error("không tìm thấy người dùng này")
        }
        this.nameFile = `${userID}_avatar`
    }
}

module.exports = new AvatarStorage()