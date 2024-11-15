const UploadHandler = require('./uploadHandler');


class CampaignStore extends UploadHandler {
    constructor() {
        super()
        /**
         * fieldName is name of file input/inputs of submitted form 
         */
        this.fieldName = 'campaignPicture'

        /**
         * subDirPath is name of subforder that image will be save, root is media directory
         */
        this.subDirPath = 'campaigns/'

        /**
         * type file input is an list or single
         * single : fieldName include only one files
         * multiple : fieldName include multi files
         *  
         */
        this.type = "single"
    }
    
}

module.exports = new CampaignStore()