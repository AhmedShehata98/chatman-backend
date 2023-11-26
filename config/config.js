require('dotenv').config();

const config = {
    socketVersion: 1,
    apiVersion: 1,
    appEnv: 'production',
    dbUrl: process.env.DATABASE_URL,
    port: process.env.PORT || 7000,
    jwtSecret: process.env.JWT_KEY,
    saltRounds: +process.env.SALT_ROUNDS,
};

if (process.env.NODE_ENV == 'development') {
    config.appEnv = 'development';
    config.dbUrl = process.env.DEV_DATABASE_URL;
}

module.exports = config;
