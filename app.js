//libraries
const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const connectDB = require("./config/mongoDB");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const cors = require("cors");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");

// routes
const auth = require("./routes/v1/user.route");
const messages = require("./routes/v1/message.route");

// controllers
const { createMessage } = require("./controller/message.controller");
const {
  addContacts,
  toggleUserStatus,
} = require("./controller/users.controller");
const { createConversation } = require("./controller/conversation.controller");

// initialize
const server = createServer(app);
const PORT = process.env.PORT || 7000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
dotEnv.config();
connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.get("/api", (req, res) => {
  res.send("API IS RUNNING!");
});
app.use("/api/user", auth);
app.use("/api/messages", messages);

io.on("connection", (socket) => {
  console.count(`New Client : ${socket.id} ,was connected success`);

  socket.on("join-room", async function ({ participants, roomId }) {
    if (!roomId) {
      const room = await createConversation({ participants });
      await addContacts({ participants, room });
      if (room) {
        socket.join(room._id.toString());
        socket.emit("room-created", room);
        console.log(`*`.repeat(25));
        console.log(`Created chat room: ${room._id}`);
      }
    } else {
      socket.join(roomId.toString());
      console.log(`*`.repeat(25));
      console.log(`Resumed chat on room: ${roomId}`);
    }
  });

  socket.on("message", async function ({ conversationId, senderId, message }) {
    if (!conversationId)
      return console.log(`must provide room id ,received ${conversationId}`);
    if (!senderId)
      return console.log(`must provide sender id ,received ${senderId}`);
    if (message === "")
      return console.log(`must provide message ,received empty message`);

    const createdMessage = await createMessage({
      conversationId,
      senderId,
      messageContent: message,
    });
    // await addLastMessage({ conversationId, lastMessageId: createdMessage.message });
    io.to(conversationId).emit("incoming-message", createdMessage);
  });

  socket.on("user-status", async function ({ status, userId }) {
    await toggleUserStatus({ status, userId });
  });
  socket.on("typing", function ({ conversationId }) {
    socket.broadcast.to(conversationId).emit("start-typing");
  });
});

server.listen(PORT, () => {
  console.log(`Chat application listening on port => ${PORT} !`);
});
