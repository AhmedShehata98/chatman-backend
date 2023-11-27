const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/token');
const { saltRounds } = require('../config/config');
const expireDate = new Date().setHours(24);

async function signup(req, res) {
    const { username, email, phone, fullName, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await new User({
            username,
            email,
            phone,
            fullName,
            password: hashedPassword,
        });
        await user.save();
        const token = signToken(
            { _id: user._id, email: user.email },
            expireDate,
        );
        if (!token)
            res.status(400).json({
                message: `error will decoding user data token is: ${token}`,
            });
        res.status(201).json({
            message: `Created new  user successfully , welcome ${username}`,
            token,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function login(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (!user)
            return res
                .status(404)
                .json({ message: 'Sorry ,This account is not exist' });
        const compare = await bcrypt.compare(password, user.password);
        if (compare) {
            const token = signToken(
                { _id: user._id, username: user.username },
                expireDate,
            );

            res.json({
                message: `welcome back ${user.username}, logged in successfully`,
                token,
            });
        } else {
            res.json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function searchUser(req, res) {
    const { q } = req.query;
    try {
        const regex = new RegExp(q, 'ig');
        const users = await User.find({
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } },
            ],
        }).select('username email fullName isOnline profileImg ');
        if (!users)
            return res.status(404).json({
                message: " Couldn't find user with email address or username",
                users: [],
            });
        res.status(200).json({ message: 'founded users', users, q });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function userData(req, res) {
    try {
        const { userId } = res.locals;

        const user = await User.findById({ _id: userId })
            .populate([
                {
                    path: 'contacts.user',
                    model: 'User',
                    select: ' _id username fullName profileImg isOnline createdAt',
                },
                {
                    path: 'contacts.conversation',
                    model: 'Conversation',
                    select: '_id lastMessage owner participants createdAt',
                },
            ])
            .select(
                'username _id email phone fullName contacts profileImg isOnline createdAt ',
            );
        return res
            .status(200)
            .json({ message: 'fetched user data successfully .', data: user });
    } catch (error) {
        res.status(400).json(error.message);
    }
}
async function addContacts({ participants, room }) {
    const { sender, receiver } = participants;
    try {
        // sender
        const updatedSenderUser = await User.findByIdAndUpdate(sender, {
            contacts: { user: receiver, conversation: room._id },
        })
            .populate('contacts.user')
            .populate('contacts.conversation')
            .exec();

        await updatedSenderUser.save();

        // receiver
        const updatedReceiverUser = await User.findByIdAndUpdate(receiver, {
            contacts: { user: sender, conversation: room._id },
        })
            .populate('contacts.user')
            .populate('contacts.conversation')
            .exec();
        await updatedReceiverUser.save();

        return { updatedSenderUser, updatedReceiverUser };
    } catch (error) {
        throw error;
    }
}
async function toggleUserStatus({ status, userId }) {
    try {
        const user = await User.findByIdAndUpdate(userId, { isOnline: status });
        await user.save();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signup,
    login,
    searchUser,
    userData,
    addContacts,
    toggleUserStatus,
};
