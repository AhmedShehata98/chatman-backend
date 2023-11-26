const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        participants: {
            sender: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            receiver: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        },
        lastMessage: {
            type: mongoose.Types.ObjectId,
            ref: 'Message',
            required: false,
        },
    },
    { timestamps: true },
);

const conversationModel = mongoose.model('Conversation', conversationSchema);
module.exports = conversationModel;
