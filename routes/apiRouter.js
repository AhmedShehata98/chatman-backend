const { apiVersion } = require('../config/config');
const router = require(`./v${apiVersion}/v${apiVersion}Router.js`);

const apiRouter = require('express').Router();

apiRouter.use(`/api/v${apiVersion}`, router);

module.exports = apiRouter;
