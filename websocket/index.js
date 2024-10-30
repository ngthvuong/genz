'use strict'
const { Server } = require('socket.io');
const sharedSession = require('express-socket.io-session');

const port = process.env.WS_PORT || 8878
let io;
const connectedClients = new Map();
const socketTokens = new Map();


const setupWebSocket = (app, session, corsConfig) => {
    const server = app.listen(port, () => {
        console.log(`Websocket is running on port ${port}`)
    });

    io = new Server(server, {
        cors: corsConfig
    });

    io.use(sharedSession(session, {
        autoSave: true
    }));

    io.on('connection', (socket) => {
        const user = socket.handshake.session?.user
        if (user) {
            const userID = user.id;
            if (!connectedClients.has(userID)) {
                connectedClients.set(userID, new Set());
            }
            connectedClients.get(userID).add(socket.id);

            socket.join('connectedGroup');
        } else {
            socket.join('guestGroup');
        }

        socket.on("disconnect", () => {
            if (user) {
                const userID = user.id;
                connectedClients.get(userID).delete(socket.id);
                if (connectedClients.get(userID).size === 0) {
                    connectedClients.delete(userID);
                }
            }
        });
        socket.on('setToken', (data) => {
            if (data && data.token) {
                if (!socketTokens.has(socket.id)) {
                    socketTokens.set(socket.id, data.token)
                }
                socket.emit('setToken', {
                    result: true
                })
            } else {
                socket.emit('setToken', {
                    result: false
                })
                socket.disconnect()
            }
        })

        socket.on('channel', (data) => {
            console.log("channel data")
            console.log(data)
        })
    });

    return server;
}

const getIoInstance = () => {
    if (!io) {
        throw new Error("WebSocket instance has not been initialized. Call setupWebSocket first.")
    }
    return io
};

module.exports = { setupWebSocket, getIoInstance, connectedClients, socketTokens };
