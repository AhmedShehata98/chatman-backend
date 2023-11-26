const { apiVersion, socketVersion, appEnv } = require('../config/config');

const infoRouter = require('express').Router();

infoRouter.get('/', async (_req, res, _next) => {
    const info = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        apiVersion,
        socketVersion,
        appEnv,
        appVersion: require('../package.json').version,
        envVars: appEnv == 'development' ? process.env : null,
    };
    try {
        res.json(info);
    } catch (error) {
        info.message = error;
        res.status(503).send();
    }
});

module.exports = infoRouter;
