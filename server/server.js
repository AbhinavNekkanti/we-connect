
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const socketUsers = new Map();
const onlineCounts = new Map();
const messages = [];

function sendOnlineUsers() {
  const onlineUsers = [...onlineCounts.entries()]
    .filter(([, count]) => count > 0)
    .map(([name]) => name);

  io.emit("online_users", onlineUsers);
}

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join", (username) => {
    const oldUsername = socketUsers.get(socket.id);

    if (oldUsername) {
      socket.leave(oldUsername);

      onlineCounts.set(
        oldUsername,
        Math.max(0, (onlineCounts.get(oldUsername) || 1) - 1)
      );
    }

    socketUsers.set(socket.id, username);
    socket.join(username);

    onlineCounts.set(
      username,
      (onlineCounts.get(username) || 0) + 1
    );

    sendOnlineUsers();

    console.log(`${username} joined`);
  });

  socket.on("private_message", (data) => {
    const sender = socketUsers.get(socket.id);

    if (!sender || !data.receiver || !data.message?.trim()) {
      return;
    }

    const message = {
      id: randomUUID(),
      sender,
      receiver: data.receiver,
      message: data.message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      likes: 0,
      senderImage: data.senderImage || "",
    };

    messages.push(message);

    io.to(message.receiver).emit(
      "receive_private_message",
      message
    );

    socket.emit(
      "receive_private_message",
      message
    );
  });

  socket.on("get_conversation", ({ withUser }) => {
    const username = socketUsers.get(socket.id);

    if (!username || !withUser) {
      return;
    }

    const history = messages.filter(
      (message) =>
        (message.sender === username &&
          message.receiver === withUser) ||
        (message.sender === withUser &&
          message.receiver === username)
    );

    socket.emit("conversation_history", history);
  });

  socket.on("like_message", ({ messageId }) => {
    const message = messages.find(
      (item) => item.id === messageId
    );

    if (!message) {
      return;
    }

    message.likes += 1;

    io.to(message.sender).emit(
      "message_liked",
      message
    );

    io.to(message.receiver).emit(
      "message_liked",
      message
    );
  });

  socket.on("typing", ({ receiver }) => {
    const sender = socketUsers.get(socket.id);

    if (!sender || !receiver) {
      return;
    }

    io.to(receiver).emit("typing", {
      from: sender,
    });
  });

  socket.on("disconnect", () => {
    const username = socketUsers.get(socket.id);

    if (username) {
      onlineCounts.set(
        username,
        Math.max(
          0,
          (onlineCounts.get(username) || 1) - 1
        )
      );

      socketUsers.delete(socket.id);

      sendOnlineUsers();

      console.log(`${username} disconnected`);
    }
  });
});

app.get("/", (req, res) => {
  res.send("We-Connect server is running");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("================================");
  console.log("       WE-CONNECT SERVER");
  console.log("================================");
  console.log(`Server running on port ${PORT}`);
  console.log("================================");
});

