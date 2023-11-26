const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username should be provided'],
            unique: [true, 'username should be unique'],
            trim: true,
            minlength: [3, 'username must be at least 3 characters'],
            maxlength: [30, 'username must be at most 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'email should be provided'],
            unique: [true, 'email should be unique'],
            trim: true,
        },
        phone: {
            type: String,
        },
        fullName: {
            type: String,
            required: [true, 'fullName should be provided'],
            trim: true,
            minlength: [3, 'fullName must be at least 3 characters'],
            maxlength: [30, 'fullName must be at most 30 characters'],
        },
        profileImg: {
            type: String,
            default: null,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: [true, 'password should be provided'],
            trim: true,
            minlength: [8, 'password must be at least 8 characters'],
        },
        contacts: [
            {
                user: {
                    type: mongoose.Types.ObjectId,
                    ref: 'User',
                },
                conversation: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Conversation',
                },
            },
        ],
        groupContacts: {
            users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
            conversation: {
                type: mongoose.Types.ObjectId,
                ref: 'Conversation',
            },
        },
    },
    { timestamps: true },
);

const userModal = mongoose.model('User', userSchema);
module.exports = userModal;
