const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  users.set(userId, socket.id);

  socket.on("message", (data) => {
    const recipientSocket = Array.from(users.values()).find(
      (id) => id !== socket.id
    );
    
    if (recipientSocket) {
      io.to(recipientSocket).emit("message", {
        id: Date.now().toString(),
        content: data.content,
        sender: {
          id: data.senderId,
          name: "User " + data.senderId,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.senderId}`,
        },
        timestamp: new Date(),
        status: "delivered",
        chatId: data.chatId,
      });
    }
  });

  socket.on("disconnect", () => {
    users.delete(userId);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});