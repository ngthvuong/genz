'use strict'

const CommonEvent = require('./commonEvent')
const models = require('../../models')

class userRejectedEvent extends CommonEvent {

    /**
     * name of event
     */
    name = 'userApprovedEvent'
    /**
     * only send to auth client socket
     */
    isAuth = true

    /**
     * set true to isFilter to filter users
     * list this->userIDs should be filter on handle function
     */
    isFilter = true

    /**
     * 1. this.event is the second param when object is created.
     * 
     * 2. Return payload data that send to client
     * 
     * 3. If isFilter is true, should be assign a list of userID to this->userIDs
     */
    handle = async () => {
        const userID = this.event.user.id
        this.userIDs = [userID]

        return {
            userID,
            status: 'active'
        }
    }
}

module.exports = userRejectedEvent