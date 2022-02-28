const express = require('express');
// const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';
// app.use(cors())
const io = require("socket.io")(port, {
    cors: {
      origin: "https://khanhhoa-ictu.github.io",
      // origin: "http://localhost:3000",
    },
  });
  let users = [];
  
  //mang gom userId, socketId
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {

      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  app.listen(port,host, () => console.log("server running on port " + port));
  app.get('/', (req: Request, res: Response) => { res.send('welcome to Test') })