'use strict'

const CommonEvent = require('./commonEvent')
const models = require('../../models')

class TransactionModifiedDistributionEvent extends CommonEvent {

    /**
     * name of event
     */
    name = 'transactionModifiedDistributionEvent'
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
        return { distribution: this.event.distribution }
    }
}

module.exports = TransactionModifiedDistributionEvent