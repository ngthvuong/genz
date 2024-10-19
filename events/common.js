'use strict'

const { getIoInstance, connectedClients } = require('../websocket')

class CommonEvent {
    constructor(name, payload) {
        this.name = name
        this.payload = payload
        this.users = []
        this.isAuth = false
        this.isFilter = false
    }

    dispatch = () => {
        const io = getIoInstance()
        const data = {
            eventName: this.name,
            payload: this.payload
        }

        if (!this.isAuth) {
            io.emit('channel', data)
        } else if (!this.isFilter) {
            io.to('connectedGroup').emit('channel', data)
        } else {
            connectedClients.forEach((sockets, userID) => {
                if (this.users.includes(userID)) {
                    sockets.forEach((socketId) => {
                        io.emit('channel', data)
                        console.log(`Sent '${this.name}' to user ${userID} via socket ${socketId}`)
                    });
                }
            });
        }

    }
}

module.exports = CommonEvent
