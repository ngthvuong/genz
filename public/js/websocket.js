
const gate = "ws://localhost:8878"

const socket = io(gate, {
    withCredentials: true,
    transports: ['websocket'],
})

socket.on('connect', () => {
    console.log("connected to websocket")
})

socket.on('disconnect', () => {
    eventWS.listenEvent = {}
    console.log("Disconnected from websocket");
});

const eventWS = {
    listenEvent: {}
}

// handling incoming message by listeners
socket.on('channel', (data) => {
    const { eventName, payload } = data

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
