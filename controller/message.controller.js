const messageModel = require("../models/message.model");
async function createMessage({ conversationId, senderId, messageContent }) {
  try {
    const message = await new messageModel({
      conversation: conversationId,
      sender: senderId,
      message: messageContent,
    }).populate([
      {
        path: "sender",
        model: "User",
        select: " _id username fullName profileImg isOnline ",
      },
    ]);
    await message.save();

    return message;
  } catch (error) {
    throw error;
  }
}

async function getUserMessages(req, res) {
  const { conversationId } = req.params;
  console.log(conversationId);

  try {
    const messages = await messageModel
      .find({ conversation: conversationId })
      .populate([
        {
          path: "sender",
          model: "User",
          select: " _id username fullName profileImg isOnline ",
        },
      ]);
    return res.json({
      message: "fetched messages list success",
      messagesList: messages,
    });
  } catch (error) {
    throw error;
  }
}
module.exports = { createMessage, getUserMessages };
