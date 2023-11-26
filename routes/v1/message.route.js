const messagesRouter = require('express').Router();
const { authentication } = require('../../middlewares/authentication');
const { getUserMessages } = require('../../controller/message.controller');

messagesRouter.get('/:conversationId', getUserMessages);

module.exports = messagesRouter;
