// websocket.js
const { WebSocketServer } = require('ws');

const port = process.env.WS_PORT || 8878

function setupWebSocket(app) {
    const server = app.listen(port, ()=>{
        console.log(`Websocket is running on port ${port}`)
    }); // Use the same port as your Express app
    const wss = new WebSocketServer({ server });

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        console.log('New client connected.');

        ws.on('message', (message) => {
            console.log('Received:', message);
        });

        ws.on('close', () => {
            console.log('Client disconnected.');
        });

        // Send data to the client every 5 seconds
        setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ message: 'Hello from server!', timestamp: new Date() }));
            }
        }, 5000);
    });

    return server;
}

module.exports = setupWebSocket;
