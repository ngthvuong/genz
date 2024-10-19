
const gate = "ws://localhost:8878"
const WSToken = crypto.randomUUID()

const socket = io(gate, {
    withCredentials: true,
    transports: ['websocket'],
})

socket.on('connect', () => {
    console.log("connected to websocket")
    socket.emit('setToken', { token: WSToken })
})
socket.on('setToken', (data) => {
    if (data && data.result) {
        console.log("create token successful!")
    } else {
        console.log("create token failed!")
        socket.disconnect()
    }
})

socket.on('disconnect', () => {
    console.log("Disconnected from websocket");
});

// handling incoming message by listeners
socket.on('channel', (data) => {
    const { token, eventName, payload } = data
    if (token == WSToken)
        if (eventWS.listenEvent[eventName]) {
            Object.keys(eventWS.listenEvent[eventName]).forEach((action) => {
                const handleAction = eventWS.listenEvent[eventName][action]
                if (typeof handleAction == 'function') {
                    handleAction(payload)
                } else {
                    console.error(`Registered action for event '${eventName}' is not a function:`, handleAction);
                }
            });
        }
});

const eventWS = {
    listenEvent: {}
}

//send message to server
eventWS.send = (eventName, message) => {
    const payload = {
        ...message
    }

    socket.emit('channel', { eventName, payload })
}

// register event listeners 
eventWS.registerListener = (eventName, componentName, action) => {
    if (!eventWS.listenEvent[eventName]) {
        eventWS.listenEvent[eventName] = {}
    }
    eventWS.listenEvent[eventName][componentName] = action
}
