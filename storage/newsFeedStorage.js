const UploadHandler = require('./uploadHandler');
const models = require('../models')
const slugService = require("../services/slugService")

class NewsFeedStorage extends UploadHandler {
    constructor() {
        super()
        /**
         * fieldName is name of file input/inputs of submitted form 
         */
        this.fieldName = 'image'

        /**
         * subDirPath is name of subforder that image will be save, root is media directory
         */
        this.subDirPath = 'newsfeed/'

        /**
         * type file input is an list or single
         * single : fieldName include only one files
         * multiple : fieldName include multi files
         *  
         */
        this.type = "single"
    }
    async setFileName(req) {
        const title = slugService.textToSlug(req.body.title)
        this.nameFile = `${req.body.campaignID}_${title}_${Date.now()}`
    }
}

module.exports = new NewsFeedStorage()