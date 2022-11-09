const io = require("socket.io")();

const messageHandler = require("./handlers/message.handler");

let currentUserId = 2;

const users = {};

io.on("connection", (socket) => {
  console.log("socket.id:", socket.id);
  users[socket.id] = { userId: currentUserId++ };
  socket.on("join", (username) => {
    users[socket.id].username = username;
    console.log("username:", username);
    messageHandler.handleMessage(socket, users);

    // socket.on("disconnect", () => {
    //   io.emit("message", `${username} has left the chat`);
    // });
  });

  
});

io.listen(3001);
