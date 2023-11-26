const { createServer } = require('http');
const { Server } = require('socket.io');
const { socketVersion } = require('../config/config');

const registerListeners = require(`./v${socketVersion}/listeners.js`);
const registerEmitters = require(`./v${socketVersion}/emitters.js`);

function createSocketServer(app) {
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: 'http://127.0.0.1:5500',
        },
    });

    return {
        server,
        initConnection: () => {
            io.on('connection', (socket) => {
                console.count(
                    `New Client : ${socket.id} ,was connected success`,
                );
                registerEmitters(socket, io);
                registerListeners(socket, io);
            });
        },
    };
}

module.exports = createSocketServer;
