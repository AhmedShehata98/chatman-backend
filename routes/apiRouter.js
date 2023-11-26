const { apiVersion } = require('../config/config');
const router = require(`./v1/v${apiVersion}Router`);

const apiRouter = require('express').Router();

apiRouter.use('/api/' + apiVersion, router);

module.exports = apiRouter;
