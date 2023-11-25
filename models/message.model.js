const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
