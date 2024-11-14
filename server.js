import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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
  const userData = {
    id: userId,
    name: "User " + userId,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    online: true,
  };
  
  users.set(userId, { ...userData, socketId: socket.id });
  
  // Send updated user list to all clients
  io.emit("userList", Array.from(users.values()).map(({ socketId, ...user }) => user));

  socket.on("message", (data) => {
    const [user1, user2] = data.chatId.split("-");
    const recipientId = user1 === data.senderId ? user2 : user1;
    const recipientSocket = users.get(recipientId)?.socketId;
    
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
    io.emit("userList", Array.from(users.values()).map(({ socketId, ...user }) => user));
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});