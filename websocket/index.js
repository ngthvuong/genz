'use strict'
const { Server } = require('socket.io');
const sharedSession = require('express-socket.io-session');

const port = process.env.WS_PORT || 8878
let io;
const connectedClients = new Map();

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
            if (!clients.has(userID)) {
                clients.set(userID, new Set());
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
            clearInterval(userApprovalInterval);
            clearInterval(paymentSuccessInterval);
        });
        socket.on('channel', (data) => {
            console.log("channel data")
            console.log(data)
        })

        // Send data to the client every 5 seconds
        const userApprovalInterval = setInterval(() => {
            socket.emit('channel', {
                eventName: 'userApproval',
                payload: {
                    message: 'Hello Message from server!',
                    timestamp: new Date()
                }
            });
        }, 2000)
        const paymentSuccessInterval = setInterval(() => {
            socket.emit('channel', {
                eventName: 'paymentSuccess',
                payload: {
                    amount: 'Hello Payment $1000 from server!',
                    timestamp: new Date()
                }
            });
        }, 4000)
    });

    return server;
}

const getIoInstance = () => {
    if (!io) {
        throw new Error("WebSocket instance has not been initialized. Call setupWebSocket first.")
    }
    return io
};

module.exports = { setupWebSocket, getIoInstance, connectedClients };
