'use strict'

const CommonEvent = require('./commonEvent')

class NewsFeedCreateEvent extends CommonEvent {

    /**
     * name of event
     */
    name = 'newsFeedCreateEvent'
    /**
     * only send to auth client socket
     */
    isAuth = true

    /**
     * 1. this.event is the second param when object is created.
     * 
     * 2. Return payload data that send to client
     * 
     * 3. If isFilter is true, should be assign a list of userID to this->userIDs
     */
    handle = async () => {
        return { newNewsFeed: this.event.newNewsFeed }
    }
}

module.exports = NewsFeedCreateEvent