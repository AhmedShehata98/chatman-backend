const messagesRouter = require('./message.route');
const userRouter = require('./user.route');

const v1Router = require('express').Router();

v1Router.get('/version', (req, res) => res.send('API V1 IS RUNNING!'));
v1Router.use('/user', userRouter);
v1Router.use('/messages', messagesRouter);

module.exports = v1Router;
