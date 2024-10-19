'use strict'

const { getIoInstance, connectedClients, socketTokens} = require('../')

class CommonEvent {

    userIDs = []
    isAuth = false
    isFilter = false

    constructor(event) {
        this.event = event
    }

    dispatch = async () => {
        const payload = await this.handle();
        const io = getIoInstance()
        const data = {
            eventName: this.name,
            payload
        }
        if (!this.isAuth) {
            io.emit('channel', data)
        } else if (!this.isFilter) {
            io.to('connectedGroup').emit('channel', data)
        } else {
            connectedClients.forEach((sockets, userID) => {
                if (this.userIDs.includes(userID)) {
                    sockets.forEach((socketId) => {
                        data.token = socketTokens.get(socketId)
                        io.emit('channel', data)
                        console.log(`Sent '${this.name}' to user ${userID} via socket ${socketId}`)
                    });
                }
            });
        }
    }
}

module.exports = CommonEvent
