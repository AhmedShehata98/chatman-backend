const conversationModel = require('../models/conversation.model');

async function createConversation({ participants }) {
    const { sender, receiver } = participants;
    try {
        const conversation = await new conversationModel({
            owner: sender,
            participants: { sender, receiver },
        }).populate([
            {
                path: 'participants.sender',
                model: 'User',
                select: '_id fullName username isOnline profileImg',
            },
            {
                path: 'participants.receiver',
                model: 'User',
                select: '_id fullName username isOnline profileImg',
            },
        ]);
        await conversation.save();
        return conversation;
    } catch (error) {
        throw error;
    }
}

async function addLastMessage({ roomId, lastMessageId }) {
    try {
        const chat = await chatRoomModel.findByIdAndUpdate(roomId, {
            lastMessageId,
        });
        await chat.save();
        return chat;
    } catch (error) {
        res.status(500).json(error.message);
    }
}
module.exports = { createConversation, addLastMessage };
