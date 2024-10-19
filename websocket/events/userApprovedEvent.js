'use strict'

const CommonEvent = require('./commonEvent')
const models = require('../../models')

class UserApprovedEvent extends CommonEvent {
    /**
     * only send to auth client socket
     */
    isAuth = true

    /**
     * set true to isFilter to filter users
     * list this->userID should be filter on handle function
     */
    isFilter = true


    isUpdateSession = true

    /**
     * 1. this.event is the second param when object is created.
     * 
     * 2. Return payload data that send to client
     * 
     * 3. If isFilter is true, should be assign a list of userID to this->userID
     */
    handler = async () => {
        this.userIDs = [this.event.user.id]
        this.additionalSession = {user : this.event.user}
        
        return {
            userID,
            status: 'active'
        }
    }
}

module.exports = UserApprovedEvent