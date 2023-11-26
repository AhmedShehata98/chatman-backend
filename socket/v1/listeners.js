const { createMessage } = require('../../controller/message.controller');
const {
    addContacts,
    toggleUserStatus,
} = require('../../controller/users.controller');
const {
    createConversation,
} = require('../../controller/conversation.controller');

const listeners = [
    function (socket, io) {
        socket.on('join-room', async function ({ participants, roomId }) {
            if (!roomId) {
                const room = await createConversation({ participants });
                await addContacts({ participants, room });
                if (room) {
                    socket.join(room._id.toString());
                    socket.emit('room-created', room);
                    console.log(`*`.repeat(25));
                    console.log(`Created chat room: ${room._id}`);
                }
            } else {
                socket.join(roomId.toString());
                console.log(`*`.repeat(25));
                console.log(`Resumed chat on room: ${roomId}`);
            }
        });
    },
    function (socket, io) {
        socket.on(
            'message',
            async function ({ conversationId, senderId, message }) {
                if (!conversationId)
                    return console.log(
                        `must provide room id ,received ${conversationId}`,
                    );
                if (!senderId)
                    return console.log(
                        `must provide sender id ,received ${senderId}`,
                    );
                if (message === '')
                    return console.log(
                        `must provide message ,received empty message`,
                    );

                const createdMessage = await createMessage({
                    conversationId,
                    senderId,
                    messageContent: message,
                });
                // await addLastMessage({ conversationId, lastMessageId: createdMessage.message });
                io.to(conversationId).emit('incoming-message', createdMessage);
            },
        );
    },
    function (socket, io) {
        socket.on('user-status', async function ({ status, userId }) {
            await toggleUserStatus({ status, userId });
        });
    },

    function (socket, io) {
        socket.on('typing', function ({ conversationId }) {
            socket.broadcast.to(conversationId).emit('start-typing');
        });
    },
    function () {
        console.log('dummy listener');
    },
];

function registerListeners(socket, io) {
    listeners.forEach((listener) => {
        if (typeof listener === 'function') {
            listener(socket, io);
        }
    });
}

module.exports = registerListeners;
