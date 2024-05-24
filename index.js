const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3001",
  },
});

app.use(cors());
app.use(express.json());
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // socket.on("click", (data) => {
  //   console.log("in server side...", data);
  //   socketIO.emit("messageResponse", data);
  // });
    socket.on('message', (data) => {
      socketIO.emit('messageResponse', data);
    });
  socket.on("message", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

let userPost = [];

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});
app.post("/api/createPost", (req, res) => {
  console.log(req.body);
  userPost.push(req.body);
  res.json({
    message: "post created",
  });
  socketIO.emit("newpostCreated", userPost);
});
app.post("/api/createChat", (req, res) => {
  console.log(req.body);
  userPost.push(req.body);
  res.json({
    message: "Chat created",
  });
  socketIO.emit("newChatCreated", userPost);
});
app.get("/api/getChat", (req, res) => {
  res.json({
    userPost,
  });
});
app.get("/api/getPost", (req, res) => {
  res.json({
    userPost,
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
