const mongoose = require('mongoose');
const { dbUrl } = require('./config');

function connectDB() {
    mongoose
        .connect(dbUrl)
        .then(() => console.log(`CONNECTED DATABASE SUCCESS !!`))
        .catch((err) => console.log(err.message));
}
module.exports = connectDB;
