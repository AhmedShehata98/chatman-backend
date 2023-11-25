const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then((value) => console.log(`CONNECTED DATABASE SUCCESS !!`))
    .catch((err) => console.log(err.message));
}
module.exports = connectDB;
