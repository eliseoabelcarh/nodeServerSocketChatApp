const io = require("socket.io")();

const messageHandler = require("./handlers/message.handler");

let currentUserId = 2;
const users = {};

function createUserAvatarUrl(username) {
  // const nameSpace = username.replaceAll("\\s+","")
  // return `https://ui-avatars.com/api/?name=${nameSpace}&background=random`;
  const rand1 = Math.round(Math.random() * 200 +100);
  const rand2 = Math.round(Math.random() * 200 +100);
  return `https://placeimg.com/${rand1}/${rand2}/any`;
}

io.on("connection", (socket) => {
  console.log("socket.id:", socket.id);
  users[socket.id] = { userId: currentUserId++ };
  socket.on("join", (username) => {
    users[socket.id].username = username;
    users[socket.id].avatar = createUserAvatarUrl(username);
    console.log("username:", username);
    messageHandler.handleMessage(socket, users);

    // socket.on("disconnect", () => {
    //   io.emit("message", `${username} has left the chat`);
    // });
  });

  
});

io.listen(3001);
