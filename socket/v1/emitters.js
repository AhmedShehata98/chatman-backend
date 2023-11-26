const emitters = [
    function (socket, io) {
        setInterval(() => {
            socket.emit('test', { id: socket.id });
        }, 3000);
    },
];

function registerEmitters(socket, io) {
    emitters.forEach((listener) => {
        if (typeof listener === 'function') {
            listener(socket, io);
        }
    });
}

module.exports = registerEmitters;
