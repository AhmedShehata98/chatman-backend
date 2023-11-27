// pkgs
const express = require('express');
const app = express();
const connectDB = require('./config/mongoDB');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const envConfig = require('dotenv');

// other imports
const createSocketServer = require('./socket/socketServer.js');
const apiRouter = require('./routes/apiRouter.js');
const infoRouter = require('./routes/infoRouter.js');
const { port, socketOrigin } = require('./config/config.js');
const { server, initConnection } = createSocketServer(app);

connectDB();
initConnection();
envConfig.config();

app.use(helmet());
app.use(
    cors({
        origin: socketOrigin,
    }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.use('/', infoRouter);
app.use(apiRouter);

server.listen(port, () => {
    console.log(`Chat application listening on port => ${port} !`);
});
