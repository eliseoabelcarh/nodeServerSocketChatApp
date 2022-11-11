const io = require("socket.io")();
const { v4: uuidv4 } = require("uuid");

const messageHandler = require("./handlers/message.handler");

const users = {};

function createUserAvatarUrl(username) {
  // const nameSpace = username.replaceAll("\\s+","")
  // return `https://ui-avatars.com/api/?name=${nameSpace}&background=random`;
  const rand1 = Math.round(Math.random() * 200 + 100);
  const rand2 = Math.round(Math.random() * 200 + 100);
  return `https://placeimg.com/${rand1}/${rand2}/any`;
}

function getUsersOnline() {
  const values = Object.values(users);
  return values.filter((v) => v.username);
}

io.on("connection", (socket) => {
  console.log("socket.id:", socket.id);
  users[socket.id] = { userId: uuidv4() };
 

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id];
    io.emit("action", {
      type: "chat/setUsers",
      payload: getUsersOnline(),
    });
  });

  socket.on("action", (action) => {
    console.log("action:", action);

  
    if (action.type === "server/join") {
      console.log("got join event", action);
      const username = action.payload;
      users[socket.id].username = username;
      users[socket.id].avatar = createUserAvatarUrl(username);
      io.emit("action", {
        type: "chat/setUsers",
        payload: getUsersOnline(),
      });
      socket.emit('action',{
        type:'chat/setSelfUser',
        payload:users[socket.id]
      })
    }
    if (action.type === "server/private-message") {
      console.log("private message event", action);
   
      const {conversationId} = action.payload
      const from = users[socket.id].userId;
      const userValues = Object.values(users);
      const socketIds = Object.keys(users);
      for (let i = 0; i < userValues.length; i++) {
        
        
        if (userValues[i].userId === conversationId) {
          const socketId = socketIds[i];


          io.to(socketId).emit("action", {
            type: "chat/setPrivateMessage",
            payload: {
              ...action.payload,
              conversationId: from,
            },
          });


        }


      }
      
    }


  });
});

io.listen(3001);
