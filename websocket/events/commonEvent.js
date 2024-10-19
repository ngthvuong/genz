'use strict'

const { getIoInstance, connectedClients } = require('../')

class CommonEvent {
    userIDs = []
    isAuth = false
    isFilter = false
    isUpdateSession = false
    additionalSession = {}

    constructor(name, event) {
        this.name = name
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
                        if(isUpdateSession){
                            const socket = io.sockets.sockets.get(socketId)
                            this.updateSession(socket, this.additionalSession)
                        }
                        io.emit('channel', data)
                        console.log(`Sent '${this.name}' to user ${userID} via socket ${socketId}`)
                    });
                }
            });
        }
    }
    updateSession(socket, newSessionData) {
        socket.handshake.session = {
            ...socket.handshake.session,
            ...newSessionData,
        };
        socket.handshake.session.save()
    }
}

module.exports = CommonEvent
